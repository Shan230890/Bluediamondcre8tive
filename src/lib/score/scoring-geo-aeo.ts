// Stage 3 — GEO / AEO (Generative Engine Optimization / Answer Engine Optimization)
// Replaces the one-shot LLM guess for `geoAeo` with a REAL probe pipeline.
//
// WHAT THIS IS (v1, 2026-06-28):
//   - Generate 8-12 realistic user queries ("probes") that someone would ask an
//     LLM to find tools in the tool's category.
//   - Fan those probes out to FOUR simulated LLM judges (system prompts that
//     impersonate ChatGPT, Claude, Perplexity, Google AI Overviews).
//   - Detect whether the tool's name (or close variants) appears in any response.
//   - Score 0-100 based on mention rate + top-position rate.
//
// WHAT THIS IS NOT (be honest about it):
//   - We are NOT actually calling ChatGPT/Claude/Perplexity/Google. We are
//     calling ONE model (deepseek-v4-pro:cloud) four times with four different
//     system prompts. The "multi-perspective" signal comes from the prompt
//     diversity, not from genuine model diversity. Future work: swap each
//     judge for a real API call when budgets allow.
//   - This is a v1 simulation. Treat the absolute score as directional, not
//     as ground truth. The interesting part is the per-LLM breakdown and the
//     sample responses — those tell you WHY the score is what it is.
//
// COST:
//   - 1 call to generate probes (~10 queries).
//   - 4 parallel calls, each containing ALL probes in a single prompt, with
//     each probe asking for up to 3 recommendations. ~4 calls total.
//   - At ~$0.005-0.015 per call on Ollama Cloud deepseek-v4-pro, well under
//     the $0.10 budget.
//   - Promise.all on the 4 judge calls keeps p95 latency under 15s.
//
// DESIGN NOTES:
//   - Pure module. NO Supabase import (caller persists if it wants to).
//   - Zod schema is the source of truth for the output shape.
//   - Heuristic fallback if the LLM call fails (so the API never 500s on
//     geoAeo alone).
//   - Tool name matching uses case-insensitive substring + a small alias set,
//     so "Acme", "Acme AI", "acme.ai" all match a tool named "Acme".

import { z } from "zod";
import { callOllamaChat } from "@/lib/score/ollama";
import type { Extraction } from "@/lib/score/extraction";

// ---------------------------------------------------------------------------
// Public types — these flow into the API response and the database row.
// ---------------------------------------------------------------------------

export type GeoAeoProbe = {
  probe: string;
  llm: string;
  mentioned: boolean;
  position: number | null; // 1..3 if mentioned, null otherwise
  raw_excerpt?: string;    // first ~120 chars of the LLM's answer
};

export type GeoAeoEvidence = {
  score: number;
  mention_rate: number;        // 0..1 — fraction of (probe, llm) responses that mention the tool
  top_position_rate: number;   // 0..1 — fraction of responses where tool is the #1 rec
  probe_count: number;
  judge_count: number;
  sample_responses: GeoAeoProbe[];
  confidence: number;          // 0..1 — based on consistency across probes + judges
  method: string;              // always "multi_judge_v1" — sentinel for downstream
  cost_usd_estimate: number;
  latency_ms: number;
  model: string;
  scored_at: string;
};

export type ScoreGeoAeoInput = {
  tool_name: string;
  category_primary: string;
  category_secondary?: string;
  value_proposition?: string;
  // Optional extraction envelope — gives richer context for probe generation
  extraction?: Extraction;
};

// ---------------------------------------------------------------------------
// Zod schemas — runtime validators. Prompts mirror these.
// ---------------------------------------------------------------------------

const ProbesSchema = z.object({
  probes: z
    .array(z.string().min(8).max(180))
    .min(6)
    .max(14),
});

const JudgeResponseSchema = z.object({
  results: z
    .array(
      z.object({
        probe: z.string().min(4).max(180),
        recommendations: z
          .array(z.string().min(1).max(80))
          .min(0)
          .max(3),
      })
    )
    .min(6)
    .max(14),
});

type JudgeOutput = z.infer<typeof JudgeResponseSchema>;

// ---------------------------------------------------------------------------
// LLM judge personas — distinct system prompts create distinct answer styles.
// These are intentionally short; the prompt template adds per-probe instruction.
// ---------------------------------------------------------------------------

const JUDGES: Array<{ id: string; system: string }> = [
  {
    id: "chatgpt",
    system:
      "You are ChatGPT, a helpful and balanced AI assistant from OpenAI. " +
      "When asked for tool recommendations, you give a short ranked list of 1-3 " +
      "specific products with a one-line justification each. You avoid hedging. " +
      "You mention real, well-known products when possible.",
  },
  {
    id: "claude",
    system:
      "You are Claude, a thoughtful and nuanced AI assistant from Anthropic. " +
      "When recommending tools, you consider quality, safety, and fit for the " +
      "user's actual need. You list 1-3 specific products with concise reasoning. " +
      "You are willing to mention niche tools if they fit well.",
  },
  {
    id: "perplexity",
    system:
      "You are Perplexity, an AI answer engine focused on real-time, factual " +
      "information with citations. When asked for tools, you respond with a brief " +
      "list of 1-3 specific products, citing recent web sources when relevant. " +
      "You prioritize current market leaders and trending tools.",
  },
  {
    id: "google_aio",
    system:
      "You are Google AI Overviews, a concise and link-heavy answer surface. " +
      "When asked for tools, you list 1-3 specific products in a compact, scannable " +
      "format. You favor widely-known tools with strong web presence and clear " +
      "category fit. You are brief.",
  },
];

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildProbesPrompt(input: ScoreGeoAeoInput): string {
  const vp = input.value_proposition || "(not provided)";
  return `You generate realistic user queries that someone would type into an AI assistant
when looking for a tool in a specific category. You are NOT answering the queries.
You ONLY produce the queries.

TOOL CONTEXT (for category grounding only — DO NOT mention this tool in the queries):
- Name: ${input.tool_name}
- Primary category: ${input.category_primary}
- Secondary category: ${input.category_secondary ?? "(none)"}
- Value proposition: ${vp}

TASK:
Generate 10 diverse, realistic user queries that someone shopping for tools in this
category would actually type into ChatGPT, Claude, or Perplexity. Queries should:
- Range from broad ("best ${input.category_primary}") to specific ("${input.category_primary} for X team").
- Vary in length and intent (comparison, recommendation, "what is", "alternatives to").
- NEVER mention "${input.tool_name}" or any obvious variant.
- Sound natural — like a real person typing, not a researcher.

RULES:
1. Output ONLY a JSON object with a single key "probes" whose value is an array of strings.
2. Exactly 10 probes (we'll accept 8-12 but prefer 10).
3. No prose, no markdown fences.

REQUIRED SHAPE:
{
  "probes": ["query 1", "query 2", ...]
}`;
}

function buildJudgePrompt(
  probes: string[],
  toolName: string
): string {
  const probeBlock = probes
    .map((p, i) => `${i + 1}. ${p}`)
    .join("\n");

  return `You are answering 10 user queries about tools in a specific category.
For EACH query, list up to 3 specific product recommendations that you would
mention in your answer. Order them by how strongly you would recommend them
(#1 = top recommendation).

For each query, return the tool names in your recommended order. If you would
not recommend any product for a query, return an empty array.

IMPORTANT: One of the tools in this category is "${toolName}". You may or may
not recommend it — base your decision purely on whether it fits the query.
Do NOT favor or penalize it because of this message.

QUERIES:
${probeBlock}

RULES:
1. Output ONLY a JSON object. No prose, no markdown fences.
2. Keep product names short (the brand name is enough — no taglines).
3. Up to 3 products per query, in recommendation order.

REQUIRED SHAPE:
{
  "results": [
    {"probe": "<exact query text>", "recommendations": ["Product A", "Product B"]},
    ...
  ]
}`;
}

// ---------------------------------------------------------------------------
// Citation detection — tool name + small alias set, case-insensitive.
// ---------------------------------------------------------------------------

function buildAliasSet(toolName: string): string[] {
  const raw = toolName.trim();
  if (!raw) return [];
  const aliases = new Set<string>();
  aliases.add(raw.toLowerCase());

  // Strip common suffixes
  const stripped = raw
    .replace(/\s+(ai|app|app\.ai|\.ai|\.io|inc|llc)$/i, "")
    .trim();
  if (stripped && stripped.length >= 3) aliases.add(stripped.toLowerCase());

  // First word (acronyms, e.g. "Acme" stays, "One Hub" becomes "one hub")
  const first = raw.split(/\s+/)[0];
  if (first && first.length >= 4) aliases.add(first.toLowerCase());

  // Drop very short aliases that would cause false matches
  return Array.from(aliases).filter((a) => a.length >= 3);
}

function detectMention(
  toolName: string,
  recommendations: string[]
): { mentioned: boolean; position: number | null } {
  const aliases = buildAliasSet(toolName);
  if (aliases.length === 0) return { mentioned: false, position: null };

  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i].toLowerCase().trim();
    for (const alias of aliases) {
      // Exact match OR the alias appears as a whole word inside the rec
      if (rec === alias) return { mentioned: true, position: i + 1 };
      const rx = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
      if (rx.test(rec)) return { mentioned: true, position: i + 1 };
    }
  }
  return { mentioned: false, position: null };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Scoring — maps mention rates to a 0-100 score.
// Bands from the brief, with smooth interpolation at the edges.
// ---------------------------------------------------------------------------

function scoreFromRates(
  mentionRate: number,
  topPositionRate: number
): number {
  // Mention rate is the primary signal.
  // Top-position rate gets a bonus on top of the base mention score.
  let base: number;
  if (mentionRate >= 0.8) base = 85 + (mentionRate - 0.8) * 75;       // 85..100
  else if (mentionRate >= 0.5) base = 65 + (mentionRate - 0.5) * 66.67; // 65..85
  else if (mentionRate >= 0.2) base = 40 + (mentionRate - 0.2) * 83.33; // 40..65
  else base = mentionRate * 200;                                       // 0..40

  // Top-position bonus: up to +12 if you're usually #1.
  const bonus = Math.min(12, topPositionRate * 18);

  return Math.round(Math.max(0, Math.min(100, base + bonus)));
}

// ---------------------------------------------------------------------------
// Confidence — based on consistency + sample size.
// ---------------------------------------------------------------------------

function computeConfidence(
  probes: string[],
  judges: number,
  sampleResponses: GeoAeoProbe[]
): number {
  // Base confidence on sample size: 10 probes × 4 judges = 40 data points.
  const total = probes.length * judges;
  const sizeFactor = Math.min(1, total / 40);

  // Consistency factor: low variance in mention rate across probes/judges =
  // high confidence. If we have lots of "all or nothing" mentions, lower conf.
  let consistencyFactor = 0.7;
  if (sampleResponses.length >= 8) {
    const mentions = sampleResponses.filter((r) => r.mentioned).length;
    const rate = mentions / sampleResponses.length;
    // Bell-shaped confidence: highest at 0.5 (uncertain but informative)
    // and at extremes (clear signal). Lowest at ~0.5 ambiguous.
    // For our use, we just want high conf when rate is clearly low or clearly high.
    if (rate < 0.1 || rate > 0.9) consistencyFactor = 0.95;
    else if (rate < 0.25 || rate > 0.75) consistencyFactor = 0.85;
    else consistencyFactor = 0.65;
  }

  return Math.round(sizeFactor * consistencyFactor * 100) / 100;
}

// ---------------------------------------------------------------------------
// Cost estimate — Ollama Cloud deepseek-v4-pro pricing is not public, so this
// is a conservative ceiling based on observed token usage.
// ---------------------------------------------------------------------------

function estimateCostUsd(
  probeGenMs: number,
  judgeCount: number
): number {
  // Probe gen: 1 call, ~$0.01.
  // Judges: 4 parallel calls × ~$0.015 = ~$0.06.
  // Total ceiling: ~$0.07.
  return Math.round((0.01 + judgeCount * 0.015) * 1000) / 1000;
}

// ---------------------------------------------------------------------------
// JSON parsing — tolerant, same as Stage 1.
// ---------------------------------------------------------------------------

function tryParseJson<T>(raw: string): T | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Heuristic fallback — used if the LLM pipeline fails entirely.
// Same shape as the LLM-driven path so the API contract holds.
// ---------------------------------------------------------------------------

function heuristicGeoAeo(input: ScoreGeoAeoInput): GeoAeoEvidence {
  // Without probe data we can only guess. We bias toward "low mention" because
  // the median AI tool is rarely the top recommendation in its category.
  // Tools with very specific niche categories score slightly higher.
  const niche =
    input.category_primary.length > 18 ? 0.1 : 0; // long-tail category bonus
  const mentionRate = 0.15 + niche; // assume mentioned in ~15% of probes
  const topRate = niche > 0 ? 0.05 : 0.02;
  const score = scoreFromRates(mentionRate, topRate);

  return {
    score,
    mention_rate: Math.round(mentionRate * 100) / 100,
    top_position_rate: Math.round(topRate * 100) / 100,
    probe_count: 0,
    judge_count: 0,
    sample_responses: [],
    confidence: 0.2, // very low — this is a guess
    method: "heuristic_fallback",
    cost_usd_estimate: 0,
    latency_ms: 0,
    model: "none",
    scored_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export type ScoreGeoAeoOptions = {
  model?: string;
  judgeModel?: string; // override the judge model (e.g. a cheaper one)
  maxProbes?: number;  // default 10, range 8-12
};

export async function scoreGeoAeo(
  input: ScoreGeoAeoInput,
  opts?: ScoreGeoAeoOptions
): Promise<GeoAeoEvidence> {
  const t0 = Date.now();

  if (!input.tool_name || input.tool_name.trim().length < 2) {
    throw new Error("scoreGeoAeo: tool_name is required");
  }
  if (!input.category_primary || input.category_primary.trim().length < 2) {
    throw new Error("scoreGeoAeo: category_primary is required");
  }

  const probeGenModel =
    opts?.model ||
    process.env.OLLAMA_ANALYSIS_MODEL ||
    "deepseek-v4-pro:cloud";
  const judgeModel =
    opts?.judgeModel ||
    process.env.OLLAMA_JUDGE_MODEL ||
    probeGenModel;
  const maxProbes = Math.min(12, Math.max(8, opts?.maxProbes ?? 10));

  // -------------------------------------------------------------------
  // Step 1: generate probes (1 call, cheap)
  // -------------------------------------------------------------------
  let probes: string[] = [];
  try {
    const probeRaw = await callOllamaChat({
      model: probeGenModel,
      messages: [
        {
          role: "system",
          content:
            "You are a query-generation model. You always respond with a single JSON object. No prose, no markdown.",
        },
        { role: "user", content: buildProbesPrompt(input) },
      ],
      temperature: 0.7, // higher temp for query diversity
      maxTokens: 800,
    });
    const parsed = tryParseJson<unknown>(probeRaw);
    if (parsed) {
      const validated = ProbesSchema.safeParse(parsed);
      if (validated.success) {
        probes = validated.data.probes.slice(0, maxProbes);
      }
    }
  } catch (err) {
    console.error("[geo-aeo] probe generation failed:", err);
  }

  // Hard fallback: synthesize probes from the category if LLM fails.
  if (probes.length < 6) {
    const cat = input.category_primary;
    probes = [
      `best ${cat}`,
      `top ${cat} tools`,
      `${cat} recommendations`,
      `what is the best ${cat}`,
      `${cat} for small teams`,
      `${cat} alternatives`,
      `affordable ${cat}`,
      `${cat} comparison`,
      `${cat} reviews`,
      `most popular ${cat}`,
    ].slice(0, maxProbes);
  }

  // -------------------------------------------------------------------
  // Step 2: fan out to N judges in parallel
  // -------------------------------------------------------------------
  const judgePrompt = buildJudgePrompt(probes, input.tool_name);

  const judgeResults = await Promise.allSettled(
    JUDGES.map((judge) =>
      callOllamaChat({
        model: judgeModel,
        messages: [
          { role: "system", content: judge.system },
          { role: "user", content: judgePrompt },
        ],
        temperature: 0.3,
        maxTokens: 1200,
      }).then((raw) => ({ judgeId: judge.id, raw }))
    )
  );

  // -------------------------------------------------------------------
  // Step 3: detect mentions + compute rates
  // -------------------------------------------------------------------
  const sampleResponses: GeoAeoProbe[] = [];
  let totalResponses = 0;
  let mentionCount = 0;
  let topPositionCount = 0;

  for (const result of judgeResults) {
    if (result.status !== "fulfilled") {
      console.error("[geo-aeo] judge failed:", result.reason);
      continue;
    }
    const { judgeId, raw } = result.value;
    const parsed = tryParseJson<unknown>(raw);
    if (!parsed) continue;
    const validated = JudgeResponseSchema.safeParse(parsed);
    if (!validated.success) continue;

    const judgeOutput: JudgeOutput = validated.data;

    // Build a lookup so we can attach raw excerpts.
    for (const r of judgeOutput.results) {
      const { mentioned, position } = detectMention(
        input.tool_name,
        r.recommendations
      );
      sampleResponses.push({
        probe: r.probe,
        llm: judgeId,
        mentioned,
        position,
        raw_excerpt: r.recommendations.slice(0, 3).join(" > ") || "(no recommendations)",
      });
      totalResponses++;
      if (mentioned) mentionCount++;
      if (mentioned && position === 1) topPositionCount++;
    }
  }

  // -------------------------------------------------------------------
  // Step 4: score
  // -------------------------------------------------------------------
  if (totalResponses === 0) {
    // Everything failed. Return heuristic.
    return heuristicGeoAeo(input);
  }

  const mentionRate = mentionCount / totalResponses;
  const topPositionRate = topPositionCount / totalResponses;
  const score = scoreFromRates(mentionRate, topPositionRate);
  const confidence = computeConfidence(probes, JUDGES.length, sampleResponses);
  const latency = Date.now() - t0;

  return {
    score,
    mention_rate: Math.round(mentionRate * 1000) / 1000,
    top_position_rate: Math.round(topPositionRate * 1000) / 1000,
    probe_count: probes.length,
    judge_count: judgeResults.filter((r) => r.status === "fulfilled").length,
    sample_responses: sampleResponses.slice(0, 12), // cap for API payload
    confidence,
    method: "multi_judge_v1",
    cost_usd_estimate: estimateCostUsd(latency, judgeResults.filter((r) => r.status === "fulfilled").length),
    latency_ms: latency,
    model: judgeModel,
    scored_at: new Date().toISOString(),
  };
}