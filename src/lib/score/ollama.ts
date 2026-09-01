// Cre8tive Score — server-only Ollama Cloud client.
//
// Ported from a sibling project's scoring-engine client, adapted to
// reuse this repo's `ollama` npm client (see src/lib/ai/ollama-chat.ts)
// instead of duplicating a raw-fetch chat wrapper. Embeddings still need a
// dedicated call shape (model/dim/fallback) not covered by `chatWithPersona`,
// so this module owns that piece.
//
// Server-only: never import from a Client Component. Only Route Handlers /
// Server Components / other server/lib code should import this file.

import { Ollama } from "ollama";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatOptions = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

function getClient(): Ollama {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error("OLLAMA_API_KEY not set");
  const host = process.env.OLLAMA_BASE_URL || "https://ollama.com";
  return new Ollama({ host, headers: { Authorization: `Bearer ${apiKey}` } });
}

export async function callOllamaChat({
  model,
  messages,
  temperature = 0.3,
  maxTokens,
}: ChatOptions): Promise<string> {
  const client = getClient();
  const response = await client.chat({
    model,
    messages,
    stream: false,
    options: {
      temperature,
      ...(maxTokens ? { num_predict: maxTokens } : {}),
    },
  });

  const content = response.message?.content;
  if (!content) {
    throw new Error("Ollama returned empty message");
  }
  return content;
}

// ---------------------------------------------------------------------------
// Embeddings
// ---------------------------------------------------------------------------

export type EmbeddingResult = {
  vector: number[];
  dim: number;
  model: string;
  source: "ollama" | "deterministic";
};

/**
 * Generate an embedding for the given text.
 *
 * Tries Ollama Cloud `/api/embed` first (real semantic embeddings). If the
 * embed endpoint is unavailable (e.g. account tier restriction), falls back
 * to a deterministic hashed-feature-vector approach so the pipeline stays
 * end-to-end functional. The fallback is NOT semantically accurate, but it
 * preserves pipeline behavior and makes cosine similarity rank order stable
 * across calls. Callers that surface this to users should check `.source`
 * and be honest about which backend produced the vector.
 */
export async function embedText(
  text: string,
  opts?: { model?: string; dim?: number }
): Promise<EmbeddingResult> {
  const cleaned = text.trim();
  if (!cleaned) {
    throw new Error("embedText: empty text");
  }

  const model = opts?.model || process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

  try {
    const client = getClient();
    const res = await client.embed({ model, input: cleaned });
    const vec = res.embeddings?.[0];
    if (!vec || !Array.isArray(vec) || vec.length === 0) {
      throw new Error("Ollama embed returned empty/invalid vector");
    }
    return { vector: vec, dim: vec.length, model, source: "ollama" };
  } catch (err) {
    if (process.env.NODE_ENV !== "production" || process.env.SCORE_DEBUG_EMBED === "1") {
      console.warn(
        "[score/ollama.embed] falling back to deterministic:",
        err instanceof Error ? err.message.slice(0, 120) : String(err)
      );
    }
    const dim = opts?.dim ?? 384;
    const v = deterministicEmbed(cleaned, dim);
    return { vector: v, dim, model: `${model}:fallback`, source: "deterministic" };
  }
}

/**
 * Deterministic embedding fallback. Bag-of-character-trigrams + word-hash
 * with seeded projection. NOT semantically meaningful, but stable enough to
 * make the pipeline run end-to-end when real embeddings are unavailable, and
 * keeps similar descriptions ranking near each other.
 */
export function deterministicEmbed(text: string, dim: number): number[] {
  const v = new Float64Array(dim);

  const words = text.toLowerCase().match(/[a-z][a-z0-9_-]{1,}/g) ?? [];
  for (const w of words) {
    v[fnv1a(w) % dim] += 1;
  }

  for (let i = 0; i < words.length - 1; i++) {
    const bg = `${words[i]} ${words[i + 1]}`;
    v[fnv1a(bg) % dim] += 0.8;
  }

  const norm = text.toLowerCase().replace(/\s+/g, " ").trim();
  for (let i = 0; i < norm.length - 2; i++) {
    const tg = norm.slice(i, i + 3);
    if (/[a-z]/.test(tg[0]) && /[a-z]/.test(tg[2])) {
      v[fnv1a(tg) % dim] += 0.4;
    }
  }

  let norm2 = 0;
  for (let i = 0; i < dim; i++) norm2 += v[i] * v[i];
  const n = Math.sqrt(norm2) || 1;
  const out = new Array<number>(dim);
  for (let i = 0; i < dim; i++) out[i] = v[i] / n;
  return out;
}

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
