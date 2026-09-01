// Stage 2 — Originality axis scorer (evidence-based).
//
// Scores 0..100 for "how original is this idea" using real evidence, not vibes.
//
// Approach:
//   1. Build a combined query string from the user's tool description.
//   2. Embed it (Ollama `/api/embed`, with deterministic fallback).
//   3. Compare against ~55 seeded AI tools in the corpus (cosine similarity).
//   4. Score = inverted similarity (100 - max_sim * 100), bucketed per the
//      calibration table below.
//   5. Output: { score, top_matches, confidence, source }.
//
// Calibration (max similarity → score):
//   > 0.85 → 0-20    (very derivative, near-clone)
//   0.70-0.85 → 20-50 (clearly similar to existing tool)
//   0.55-0.70 → 50-75 (partial overlap — adjacent category)
//   < 0.55  → 75-100  (truly original)
//
// Pure module — no Supabase import. Tested via scripts/stage2-test.ts.

import { z } from "zod";
import { embedText, type EmbeddingResult } from "@/lib/score/ollama";
import { CORPUS, type CorpusEntryWithEmbedding } from "@/lib/score/corpus";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OriginalityInput = {
  /** Tool name (concatenated into the query). */
  name: string;
  /** Full description (primary signal). */
  description: string;
  /** Optional one-sentence value prop (Stage 1's extraction). */
  value_proposition?: string | undefined;
  /** Optional list of features (Stage 1's extraction). */
  features?: string[] | undefined;
  /** Optional extraction confidence (0..1) — used to scale overall confidence. */
  extraction_confidence?: number | undefined;
};

export type OriginalityMatch = {
  tool: string;
  category: string;
  similarity: number;
};

export type OriginalityOutput = {
  /** 0..100 integer — higher = more original. */
  score: number;
  /** Top-K nearest corpus entries (sorted by similarity desc). */
  top_matches: OriginalityMatch[];
  /** Max cosine similarity observed across the whole corpus. */
  max_similarity: number;
  /** 0..1 — how much to trust this score. */
  confidence: number;
  /** Which embedding backend produced the vectors. */
  source: "ollama" | "deterministic";
  /** Model name (or "model:fallback" if deterministic). */
  embed_model: string;
  /** Internal: original vector length (helps debug dim mismatches). */
  dim: number;
};

// Zod schema — matches OriginalityOutput exactly. Used for runtime validation
// in tests and at API boundaries.
export const OriginalityOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  top_matches: z
    .array(
      z.object({
        tool: z.string(),
        category: z.string(),
        similarity: z.number().min(0).max(1),
      })
    )
    .max(10),
  max_similarity: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  source: z.enum(["ollama", "deterministic"]),
  embed_model: z.string(),
  dim: z.number().int().positive(),
});

// ---------------------------------------------------------------------------
// Cosine similarity
// ---------------------------------------------------------------------------

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Dim mismatch — return 0 (no overlap) rather than throwing. Callers
    // should ensure vectors are the same dim (we do, via embedText's `dim`).
    return 0;
  }
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  // Both vectors are L2-normalized in deterministicEmbed AND in Ollama's
  // nomic-embed-text, so dot product == cosine similarity. For safety:
  return Math.max(0, Math.min(1, dot));
}

// ---------------------------------------------------------------------------
// Query construction
// ---------------------------------------------------------------------------

const MAX_FEATURES = 6;

function buildQuery(input: OriginalityInput): string {
  const parts: string[] = [];
  if (input.name) parts.push(input.name);
  if (input.value_proposition) parts.push(input.value_proposition);
  else if (input.description) parts.push(input.description);
  if (input.features && input.features.length > 0) {
    parts.push(input.features.slice(0, MAX_FEATURES).join("; "));
  }
  if (parts.length === 1 && input.description) {
    // Ensure we have at least the description as the dominant signal.
    parts.push(input.description);
  }
  return parts.filter(Boolean).join(" — ");
}

// ---------------------------------------------------------------------------
// Calibration
// ---------------------------------------------------------------------------

/**
 * Map max similarity → 0..100 originality score.
 *
 * The mapping is non-linear: very high similarity (<0.85) collapses
 * aggressively to give a strong "very derivative" signal. Low similarity
 * (>0.55) is generous so genuinely novel ideas score well.
 *
 * Buckets (per brief):
 *   > 0.85          → 0-20    (very derivative)
 *   0.70 - 0.85     → 20-50   (clearly similar to an existing tool)
 *   0.55 - 0.70     → 50-75   (partial overlap, adjacent category)
 *   < 0.55          → 75-100  (truly original / white space)
 *
 * Within each bucket we interpolate linearly so the score has more
 * resolution than the bucket edges.
 */
function calibrate(maxSim: number): number {
  if (maxSim >= 0.85) {
    // 0.85 → 20, 1.00 → 0  (descending)
    const t = (maxSim - 0.85) / (1.0 - 0.85);
    return Math.round(20 - 20 * Math.min(1, Math.max(0, t)));
  }
  if (maxSim >= 0.7) {
    // 0.70 → 50, 0.85 → 20
    const t = (maxSim - 0.7) / (0.85 - 0.7);
    return Math.round(50 - 30 * Math.min(1, Math.max(0, t)));
  }
  if (maxSim >= 0.55) {
    // 0.55 → 75, 0.70 → 50
    const t = (maxSim - 0.55) / (0.7 - 0.55);
    return Math.round(75 - 25 * Math.min(1, Math.max(0, t)));
  }
  // < 0.55 → 75..100
  // 0.55 → 75, 0.00 → 100
  const t = maxSim / 0.55;
  return Math.round(100 - 25 * Math.min(1, Math.max(0, t)));
}

// ---------------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------------

function deriveConfidence(args: {
  source: "ollama" | "deterministic";
  extractionConfidence: number;
  inputLength: number;
  topMatchSimilarity: number; // 0..1 — closer to 1 = more confident in the score
}): number {
  // Deterministic fallback is meaningful but not semantically accurate —
  // bump down confidence by 0.15.
  let c = args.source === "ollama" ? 0.85 : 0.7;

  // Thin input reduces confidence.
  if (args.inputLength < 80) c -= 0.1;
  if (args.inputLength < 40) c -= 0.15;

  // Very clear signal (close to 1 or close to 0) is more confident than
  // ambiguous middle band.
  if (args.topMatchSimilarity > 0.7 || args.topMatchSimilarity < 0.3) {
    c += 0.05;
  }

  // Blend with extraction confidence if provided.
  if (args.extractionConfidence > 0) {
    c = c * 0.7 + args.extractionConfidence * 0.3;
  }

  return Math.max(0.1, Math.min(1, Math.round(c * 100) / 100));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type OriginalityOpts = {
  /** Number of top matches to return (default 5). */
  topK?: number;
  /** Embedding model override. */
  embedModel?: string;
  /** Embedding dim override. */
  embedDim?: number;
};

/**
 * Score the originality axis for a tool.
 *
 * Cost: ≤ $0.001 per call (one embedding). Latency p95: < 2s.
 *
 * Never throws on embedding failures — falls back to deterministic vectors.
 * Only throws on truly catastrophic errors (empty input, etc.).
 */
export async function scoreOriginality(
  input: OriginalityInput,
  opts: OriginalityOpts = {}
): Promise<OriginalityOutput> {
  const query = buildQuery(input);
  if (!query || query.trim().length < 4) {
    throw new Error(
      "scoreOriginality: empty or too-short query (need at least a name + a few words)"
    );
  }

  const topK = opts.topK ?? 5;
  const embedDim = opts.embedDim ?? 384;

  // Embed the user's tool.
  const userVec: EmbeddingResult = await embedText(query, {
    model: opts.embedModel,
    dim: embedDim,
  });

  // Compare against every corpus entry.
  const scored: Array<OriginalityMatch & { vec: number[] }> = CORPUS.map(
    (entry: CorpusEntryWithEmbedding) => {
      const sim = cosineSimilarity(userVec.vector, entry.vector);
      return {
        tool: entry.name,
        category: entry.category,
        similarity: sim,
        vec: entry.vector,
      };
    }
  );

  scored.sort((a, b) => b.similarity - a.similarity);
  const top = scored.slice(0, Math.max(topK, 1));
  const maxSim = top.length > 0 ? top[0].similarity : 0;

  const score = calibrate(maxSim);
  const confidence = deriveConfidence({
    source: userVec.source,
    extractionConfidence: input.extraction_confidence ?? 0,
    inputLength: query.length,
    topMatchSimilarity: maxSim,
  });

  return {
    score,
    top_matches: top.map((m) => ({
      tool: m.tool,
      category: m.category,
      similarity: Number(m.similarity.toFixed(4)),
    })),
    max_similarity: Number(maxSim.toFixed(4)),
    confidence,
    source: userVec.source,
    embed_model: userVec.model,
    dim: userVec.dim,
  };
}