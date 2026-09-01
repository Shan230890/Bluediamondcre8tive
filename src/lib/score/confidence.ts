// Cre8tive Score — Confidence interval computation (shared, pure).
//
// Given stage-success flags + per-axis evidence, return a `±X` value for each
// axis. Smaller CI = higher confidence. Used in the final API response so
// users know how much to trust each score.
//
// Design:
//   - Pure function, no I/O, no LLM.
//   - Inputs are loose: any stage that didn't run falls back to its "worst
//     case" CI (largest interval). Caller decides which flags to set true.
//   - Output is a plain record keyed by axis name (matches ScoreAxes).

import type { ScoreAxes } from "@/lib/score/types";

export type ConfidenceInputs = {
  /** Originality embedding succeeded → tight CI. */
  originality_embedding_ok: boolean;
  /** Competition corpus lookup succeeded → tight CI. */
  competition_corpus_ok: boolean;
  /** Fraction of LLM probes that mentioned this tool (0..1). */
  geo_mention_rate: number; // 0..1
  /** Technical — URL was probed successfully. */
  technical_url_probed: boolean;
  /** Gap — originality top_matches had any neighbors. */
  gap_has_neighborhood: boolean;
};

export type ConfidenceIntervals = Record<keyof ScoreAxes, number>;

/**
 * Compute per-axis confidence interval `±X` from stage outcomes.
 *
 * Rule table:
 *   - Originality: ±5 if embedding ok, else ±15
 *   - Competition: ±5 if corpus lookup ok, else ±12
 *   - GEO/AEO:     ±(30 - mention_rate*25), clamped to [5, 30]
 *   - Technical:   ±8 normally, ±20 if no URL probed
 *   - Gap:         ±10 normally, ±18 if originality neighborhood empty
 */
export function computeConfidenceIntervals(
  inputs: ConfidenceInputs
): ConfidenceIntervals {
  const geoRaw = 30 - inputs.geo_mention_rate * 25;
  const geo = Math.max(5, Math.min(30, Math.round(geoRaw)));

  return {
    originality: inputs.originality_embedding_ok ? 5 : 15,
    competition: inputs.competition_corpus_ok ? 5 : 12,
    geoAeo: geo,
    technical: inputs.technical_url_probed ? 8 : 20,
    gap: inputs.gap_has_neighborhood ? 10 : 18,
  };
}

/**
 * Weights (server-side only — never expose):
 *   originality 30%, technical 20%, geoAeo 20%, competition 15%, gap 15%
 */
export const AXIS_WEIGHTS: Record<keyof ScoreAxes, number> = {
  originality: 0.3,
  technical: 0.2,
  geoAeo: 0.2,
  competition: 0.15,
  gap: 0.15,
};

/**
 * Recompute the weighted overall score from per-axis scores. Result is
 * rounded to integer 0..100.
 */
export function computeOverall(axes: ScoreAxes): number {
  const raw =
    axes.originality * AXIS_WEIGHTS.originality +
    axes.technical * AXIS_WEIGHTS.technical +
    axes.geoAeo * AXIS_WEIGHTS.geoAeo +
    axes.competition * AXIS_WEIGHTS.competition +
    axes.gap * AXIS_WEIGHTS.gap;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Build a one-line human-readable evidence summary per axis. Used in the API
 * response so users can scan why each score landed where it did.
 */
export type EvidenceSummary = Record<keyof ScoreAxes, string>;

export function buildEvidenceSummary(args: {
  originality_top_match?: { name: string; similarity: number } | null;
  competition_funded_count?: number | null;
  geo_mention_rate?: number | null;
  technical_url_probed: boolean;
  technical_has_schema_org: boolean;
  gap_neighborhood_size?: number | null;
  gap_top_gap?: string | null;
}): EvidenceSummary {
  const o = args.originality_top_match;
  const c = args.competition_funded_count;
  const g = args.geo_mention_rate;
  const gn = args.gap_neighborhood_size;

  return {
    originality: o
      ? `Closest match: ${o.name} (${o.similarity.toFixed(2)} similarity)`
      : "No closest match available",
    competition:
      c != null
        ? c === 0
          ? "No funded competitors detected in category"
          : `${c} funded ${c === 1 ? "competitor" : "competitors"} in category`
        : "Competition evidence unavailable",
    geoAeo:
      g != null
        ? `Mentioned in ${Math.round(g * 100)}% of LLM probes`
        : "GEO/AEO probe results unavailable",
    technical: args.technical_url_probed
      ? args.technical_has_schema_org
        ? "URL probed, schema.org detected"
        : "URL probed, no schema.org"
      : "URL not probed — feasibility based on description only",
    gap: args.gap_top_gap
      ? `Top gap: ${args.gap_top_gap}`
      : gn != null && gn > 0
        ? `Evaluated against ${gn} similar tools`
        : "No neighborhood evidence — gap scored in isolation",
  };
}
