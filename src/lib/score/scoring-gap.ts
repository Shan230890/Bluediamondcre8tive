// Stage 4 — Gap / white-space axis scorer.
//
// Scores 0..100 for "is there a defensible white-space position?"
// Uses ONE medium LLM call that grounds its reasoning in evidence:
//   - Stage 1's value_proposition + differentiation_claims
//   - Stage 2's originality.top_matches (the "neighborhood") — optional
//   - User's claimed_competitors
//
// The LLM MUST cite at least 2 specific features or segments in its reasoning
// (enforced via Zod min(2)). Output includes `evidence_citations` as a
// short list of cited features/segments.
//
// Cost: < $0.05 (1 medium LLM call, maxTokens ~700).
// Latency: < 6s p95 on a fast model.
//
// Pure module — no Supabase import.

import { callOllamaChat } from "@/lib/score/ollama";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GapNeighborhoodMatch = {
  name: string;
  similarity: number;
};

export type GapInput = {
  name: string;
  description: string;
  claimed_competitors: string[];
  value_proposition: string; // one_sentence from Stage 1
  differentiation_claims: string[];
  /** Stage 2 originality.top_matches — empty if Stage 2 hasn't run. */
  top_matches: GapNeighborhoodMatch[];
};

export type GapEvidence = {
  cited_features: string[]; // ≥ 2, enforced
  reasoning: string;
  neighborhood_size: number;
  llm_ok: boolean;
  confidence: number;
  score: number;
};

export type GapOutput = {
  score: number; // 0..100
  reasoning: string;
  evidence_citations: string[];
  confidence: number; // 0..1, derived from citations + neighborhood
  /** Full evidence blob — persisted to assessments.gap_evidence. */
  evidence: GapEvidence;
};

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const GapLLMSchema = z.object({
  score: z.number().int().min(0).max(100),
  reasoning: z.string().min(20).max(600),
  cited_features: z.array(z.string().min(2).max(120)).min(2).max(8),
});

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

function buildGapPrompt(input: GapInput): string {
  const competitorsBlock =
    input.claimed_competitors.length > 0
      ? `USER-CLAIMED COMPETITORS:
- ${input.claimed_competitors.join("\n- ")}`
      : "USER-CLAIMED COMPETITORS: (none provided)";

  const neighborhoodBlock =
    input.top_matches.length > 0
      ? `TOP SIMILAR EXISTING TOOLS (from embedding search):
${input.top_matches
  .slice(0, 5)
  .map((m, i) => `${i + 1}. ${m.name} (similarity ${m.similarity.toFixed(2)})`)
  .join("\n")}`
      : "TOP SIMILAR EXISTING TOOLS: (none available — score without neighborhood)";

  const differentiationBlock =
    input.differentiation_claims.length > 0
      ? `USER'S DIFFERENTIATION CLAIMS:
- ${input.differentiation_claims.join("\n- ")}`
      : "USER'S DIFFERENTIATION CLAIMS: (none provided)";

  return `You are scoring the WHITE-SPACE / DEFENSIBILITY of an AI tool idea for Cre8tive Score.

TOOL NAME: ${input.name}
ONE-SENTENCE VALUE PROP: ${input.value_proposition}
FULL DESCRIPTION: ${input.description}

${competitorsBlock}

${differentiationBlock}

${neighborhoodBlock}

YOUR JOB:
Score 0-100 for: "Is there a clear, defensible gap this tool can own?"

CALIBRATION GUIDE:
- 0-30:  Commodity. Exact clones exist; no angle.
- 31-55: Crowded, but a thin angle. Hard to defend long-term.
- 56-75: Real white space. Clear segment or feature gap; some defensibility.
- 76-100: Open territory. Vertical or feature combo nobody is doing well.

RULES:
1. You MUST cite at least 2 specific features, segments, or use-cases in your reasoning. Each citation must be a short phrase (≤ 12 words).
2. Score based on evidence, not optimism. If competitors cover the same ground, score low.
3. If top_matches is empty, lean toward middle (45-60) and flag the lack of evidence in your reasoning.
4. Be specific. "It's unique" is not a citation. "Vertical: solo construction estimators" is.

OUTPUT (strict JSON, no prose, no markdown):
{
  "score": <integer 0-100>,
  "reasoning": "<2-4 sentences, cite specific features/segments inline>",
  "cited_features": ["<short phrase 1>", "<short phrase 2>", "..."]
}`;
}

// ---------------------------------------------------------------------------
// JSON helpers
// ---------------------------------------------------------------------------

function tryParseJson(raw: string): unknown | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Confidence derivation
// ---------------------------------------------------------------------------

/**
 * Confidence (0..1) is a function of:
 *  - Neighborhood size (more neighbors = sharper calibration)
 *  - Whether the LLM produced ≥ 2 citations
 *
 * Returns a coarse 0..1 that the API consumer can compare to the global CI.
 */
function deriveConfidence(
  neighborhoodSize: number,
  citationCount: number
): number {
  let c = 0;
  if (neighborhoodSize >= 5) c += 0.5;
  else if (neighborhoodSize >= 1) c += 0.3;
  else c += 0.1; // no neighborhood — low confidence

  if (citationCount >= 3) c += 0.4;
  else if (citationCount >= 2) c += 0.3;
  else c += 0.1;

  // model bonus: at least one citation
  if (citationCount >= 1) c += 0.1;

  return Math.min(1, Math.round(c * 100) / 100);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score the gap axis. Returns 0..100 + structured evidence + confidence.
 * Never throws — failure modes (LLM down) fall back to a middle score
 * with a clear flag in the evidence.
 */
export async function scoreGap(input: GapInput): Promise<GapOutput> {
  const model =
    process.env.OLLAMA_ANALYSIS_MODEL || "deepseek-v4-pro:cloud";

  const prompt = buildGapPrompt(input);

  try {
    const raw = await callOllamaChat({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a brutally honest product strategist evaluating white-space opportunities. Always respond with valid JSON only. No prose, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      maxTokens: 1200,
    });

    const parsed = tryParseJson(raw);
    if (parsed === null) {
      return fallback(input, "llm_parse_failed");
    }
    const result = GapLLMSchema.safeParse(parsed);
    if (!result.success) {
      return fallback(input, "llm_schema_failed");
    }
    const r = result.data;
    const confidence = deriveConfidence(
      input.top_matches.length,
      r.cited_features.length
    );
    return {
      score: r.score,
      reasoning: r.reasoning,
      evidence_citations: r.cited_features,
      confidence,
      evidence: {
        cited_features: r.cited_features,
        reasoning: r.reasoning,
        neighborhood_size: input.top_matches.length,
        llm_ok: true,
        confidence,
        score: r.score,
      },
    };
  } catch {
    return fallback(input, "llm_call_failed");
  }
}

function fallback(input: GapInput, reason: string): GapOutput {
  // Honest default: lean middle, flag the failure, no fake citations.
  // Empty `evidence_citations` is the signal to consumers that this is a
  // fallback (the CI layer will already be wider too).
  const hasNeighborhood = input.top_matches.length > 0;
  const hasCompetitors = input.claimed_competitors.length > 0;
  let score = 50;
  if (hasNeighborhood) score = 55; // a little optimism
  if (!hasCompetitors && !hasNeighborhood) score = 45;

  return {
    score,
    reasoning: `Gap scoring fallback (${reason}). Insufficient evidence for a defensible score — ${input.top_matches.length} neighbors, ${input.claimed_competitors.length} claimed competitors.`,
    evidence_citations: [],
    confidence: 0.2,
    evidence: {
      cited_features: [],
      reasoning: `Gap scoring fallback (${reason}).`,
      neighborhood_size: input.top_matches.length,
      llm_ok: false,
      confidence: 0.2,
      score,
    },
  };
}