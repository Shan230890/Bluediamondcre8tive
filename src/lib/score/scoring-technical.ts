// Stage 4 — Technical axis scorer.
//
// Scores 0..100 for "is this technically feasible, and does the implementation
// sound sane?" Uses a layered approach:
//
//   1. Rule-based feasibility checks (no LLM) — penalize hand-wavy / impossible
//      claims with hard-coded deductions.
//   2. Tech signal scoring — bonus for evidence we already have (URL probed,
//      schema.org, og:image, framework hints).
//   3. Light LLM review — one small deepseek call to spot overpromising /
//      buzzword stuffing / missing fundamentals in the narrative. Returns
//      a `delta` in [-15, +15] that we add to the base score.
//
// Output is `scoreTechnical` returning { score, reasoning, evidence, delta }.
// All outputs are Zod-typed. The module is pure (no Supabase import).
//
// Cost: < $0.02 (1 small LLM call, maxTokens ~400).
// Latency: < 3s p95 on a fast model.

import { callOllamaChat } from "@/lib/score/ollama";
import { z } from "zod";
import type { Extraction } from "@/lib/score/extraction";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TechnicalEvidence = {
  /** Penalty total from rule-based feasibility checks. */
  feasibility_penalty: number;
  /** Bonus total from tech signals. */
  tech_signal_bonus: number;
  /** LLM-reported delta in [-15, +15]. */
  llm_delta: number;
  /** Specific red flags hit. */
  red_flags: string[];
  /** Tech signals that contributed bonus. */
  tech_signals_used: string[];
  /** Whether the URL was probed successfully (mirrors Extraction.tech_signals). */
  url_probed: boolean;
  /** 1-line LLM reasoning (or fallback explanation). */
  llm_reasoning: string;
  /** LLM was called successfully. */
  llm_ok: boolean;
  /** Final computed technical score (mirrored for the page evidence shape). */
  score: number;
};

export type TechnicalInput = {
  name: string;
  description: string;
  /** Stage 1 extraction envelope. Provides tech_signals + features. */
  extraction: Extraction | null;
};

export type TechnicalOutput = {
  score: number; // 0..100
  reasoning: string;
  evidence: TechnicalEvidence;
};

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const LLMReviewSchema = z.object({
  delta: z.number().int().min(-15).max(15),
  reasoning: z.string().min(5).max(280),
  red_flags: z.array(z.string().min(2).max(80)).max(6),
});

// ---------------------------------------------------------------------------
// Rule-based feasibility checks
// ---------------------------------------------------------------------------

type Penalty = { pattern: RegExp; label: string; amount: number };

const PENALTIES: Penalty[] = [
  {
    pattern: /\breal[\s-]?time\s+(agi|superintelligence|general\s+intelligence)\b/i,
    label: "Real-time AGI claim",
    amount: 40,
  },
  {
    pattern: /\bfully\s+autonomous\s+everything\b/i,
    label: "'Fully autonomous everything' claim",
    amount: 40,
  },
  {
    pattern: /\b(agi|artificial general intelligence|superintelligence|superintelligent)\b/i,
    label: "AGI / superintelligence claim",
    amount: 25,
  },
  {
    pattern: /\b(blockchain|web3|crypto)\b.*\b(ai|llm|gpt|model)\b/i,
    label: "Blockchain + AI (often vague)",
    amount: 20,
  },
  {
    pattern: /\binstant\s+\d+[mk]?\s*[-]?token\s+(reasoning|inference|context)\b/i,
    label: "Impossible-speed claim",
    amount: 20,
  },
  {
    pattern: /\b(perfect|100%\s+accurate|infallible|guaranteed\s+correct)\b/i,
    label: "Perfection claim",
    amount: 15,
  },
];

const FUNDAMENTAL_KEYWORDS = [
  "auth",
  "login",
  "sign in",
  "signup",
  "sign up",
  "payment",
  "billing",
  "stripe",
  "checkout",
  "subscription",
  "hosted",
  "hosting",
  "deploy",
  "deployed",
  "cloud",
  "aws",
  "vercel",
  "database",
  "postgres",
  "supabase",
  "firebase",
];

function assessFundamentals(text: string): boolean {
  const lower = text.toLowerCase();
  return FUNDAMENTAL_KEYWORDS.some((k) => lower.includes(k));
}

type FeasibilityResult = {
  penalty: number;
  red_flags: string[];
};

function checkFeasibility(input: TechnicalInput): FeasibilityResult {
  const corpus = `${input.name}\n${input.description}`;
  let penalty = 0;
  const flags: string[] = [];

  for (const p of PENALTIES) {
    if (p.pattern.test(corpus)) {
      penalty += p.amount;
      flags.push(p.label);
    }
  }

  // Missing-fundamentals check — only penalize for substantive descriptions
  // (otherwise we'd punish one-liner submissions unfairly).
  if (input.description.length >= 120 && !assessFundamentals(corpus)) {
    penalty += 15;
    flags.push("Missing fundamentals (no auth/payments/hosting mentioned)");
  }

  return { penalty, red_flags: flags };
}

// ---------------------------------------------------------------------------
// Tech signal scoring
// ---------------------------------------------------------------------------

function scoreTechSignals(extraction: Extraction | null): {
  bonus: number;
  signals_used: string[];
} {
  if (!extraction) return { bonus: 0, signals_used: [] };
  const t = extraction.tech_signals;
  let bonus = 0;
  const used: string[] = [];

  // Has a probed landing page → +10
  if (t.url_probed) {
    bonus += 10;
    used.push("url_probed");
  }
  // Has schema.org JSON-LD → +5
  if (t.has_schema_org) {
    bonus += 5;
    used.push("schema_org");
  }
  // Has og:image → +3
  if (t.og_image && t.og_image.length > 0) {
    bonus += 3;
    used.push("og_image");
  }
  // URL probed to a real domain (HTTP 200/3xx) → +5
  if (
    t.url_probed &&
    typeof t.http_status === "number" &&
    t.http_status >= 200 &&
    t.http_status < 400
  ) {
    bonus += 5;
    used.push(`http_${t.http_status}`);
  }

  return { bonus, signals_used: used };
}

// ---------------------------------------------------------------------------
// LLM review — one small call, ±15 nudge.
// ---------------------------------------------------------------------------

type LLMReview = z.infer<typeof LLMReviewSchema>;

function buildReviewPrompt(input: TechnicalInput, base: {
  penalty: number;
  red_flags: string[];
  tech_bonus: number;
  tech_signals: string[];
}): string {
  const extractionBlock = input.extraction
    ? `TECH SIGNALS (from landing page probe):
- URL probed: ${input.extraction.tech_signals.url_probed}
- HTTP status: ${input.extraction.tech_signals.http_status ?? "(n/a)"}
- Schema.org types: ${input.extraction.tech_signals.schema_org_types?.join(", ") ?? "(none)"}
- Framework hints: ${input.extraction.tech_signals.framework_hints.join(", ") || "(none)"}
- og:image: ${input.extraction.tech_signals.og_image ? "yes" : "no"}`
    : "TECH SIGNALS: (extraction not available)";

  return `You are a technical reviewer scoring the FEASIBILITY of an AI tool idea.

TOOL NAME: ${input.name}
DESCRIPTION: ${input.description}

${extractionBlock}

RULE-BASED SCAN ALREADY RAN:
- Penalty so far: -${base.penalty}
- Red flags hit: ${base.red_flags.length ? base.red_flags.join("; ") : "(none)"}
- Tech signal bonus so far: +${base.tech_bonus}
- Tech signals used: ${base.tech_signals.length ? base.tech_signals.join(", ") : "(none)"}

YOUR JOB (single small pass):
- Check the technical NARRATIVE for overpromising, buzzword stuffing, or missing fundamentals that the rule scan missed.
- Adjust the score by a delta in [-15, +15]:
  - Positive delta: sound architecture, realistic claims, evidence of thoughtfulness.
  - Negative delta: hand-wavy "AI magic", missing concrete plan, vague scaling claims.
  - Zero delta: nothing new to add beyond the rule scan.

OUTPUT (strict JSON, no prose, no markdown):
{
  "delta": <integer -15..15>,
  "reasoning": "<one sentence, max 25 words>",
  "red_flags": ["<short flag>", "..."]
}`;
}

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

async function llmReview(
  input: TechnicalInput,
  ruleState: {
    penalty: number;
    red_flags: string[];
    tech_bonus: number;
    tech_signals: string[];
  }
): Promise<{ review: LLMReview | null; ok: boolean; raw_reasoning: string }> {
  const model =
    process.env.OLLAMA_ANALYSIS_MODEL || "deepseek-v4-pro:cloud";

  const prompt = buildReviewPrompt(input, ruleState);

  try {
    const raw = await callOllamaChat({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a strict technical feasibility reviewer. Always respond with valid JSON only. No prose, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      maxTokens: 800,
    });

    const parsed = tryParseJson(raw);
    if (parsed === null) {
      return { review: null, ok: false, raw_reasoning: raw.slice(0, 200) };
    }
    const result = LLMReviewSchema.safeParse(parsed);
    if (!result.success) {
      return {
        review: null,
        ok: false,
        raw_reasoning: raw.slice(0, 200),
      };
    }
    return { review: result.data, ok: true, raw_reasoning: result.data.reasoning };
  } catch {
    return { review: null, ok: false, raw_reasoning: "llm_call_failed" };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score the technical axis. Returns 0..100 + structured evidence.
 * Never throws — failure modes (no extraction, LLM down) are recorded
 * in `evidence` and produce a reasonable fallback score.
 */
export async function scoreTechnical(
  input: TechnicalInput
): Promise<TechnicalOutput> {
  const feas = checkFeasibility(input);
  const tech = scoreTechSignals(input.extraction);

  const llm = await llmReview(input, {
    penalty: feas.penalty,
    red_flags: feas.red_flags,
    tech_bonus: tech.bonus,
    tech_signals: tech.signals_used,
  });

  const llm_delta = llm.review?.delta ?? 0;
  const llm_reasoning = llm.ok
    ? (llm.review!.reasoning)
    : llm.raw_reasoning === "llm_call_failed"
      ? "LLM review unavailable — score based on rule scan only"
      : "LLM review parse-failed — score based on rule scan only";

  // Base = 70 (neutral), adjusted by penalties, tech bonus, and LLM delta.
  // 70 is the "credible, average" starting point — bonuses push higher,
  // penalties push lower. Clamped to [0, 100].
  const raw = 70 - feas.penalty + tech.bonus + llm_delta;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const red_flags = [
    ...feas.red_flags,
    ...(llm.review?.red_flags ?? []),
  ];

  // Compose the reasoning line.
  const parts: string[] = [];
  if (feas.penalty > 0) parts.push(`-${feas.penalty} feasibility`);
  if (tech.bonus > 0) parts.push(`+${tech.bonus} tech signals`);
  if (llm_delta !== 0) {
    parts.push(`${llm_delta >= 0 ? "+" : ""}${llm_delta} LLM`);
  }
  const breakdown =
    parts.length > 0 ? parts.join(", ") : "baseline 70, no adjustments";
  const reasoning = `${score}/100 — ${breakdown}. ${llm_reasoning}`;

  return {
    score,
    reasoning,
    evidence: {
      feasibility_penalty: feas.penalty,
      tech_signal_bonus: tech.bonus,
      llm_delta,
      red_flags,
      tech_signals_used: tech.signals_used,
      url_probed: input.extraction?.tech_signals.url_probed ?? false,
      llm_reasoning,
      llm_ok: llm.ok,
      score,
    },
  };
}