// Stage 2 — Competition axis scorer (evidence-based).
//
// Scores 0..100 for "how saturated is this space" (higher = LESS competition
// = more white space).
//
// Approach:
//   1. Use the user's claimed category + claimed competitors.
//   2. Count seeded corpus entries in the same category.
//   3. Check user-claimed competitors against the funded lookup.
//   4. Apply a fund/saturation curve to produce a 0..100 score.
//   5. Output: { score, funded_competitor_count, total_competitor_count,
//                red_ocean, confidence, ... }
//
// Calibration (funded competitor count → score):
//   0 funded, sparse category:                90-100
//   1-3 funded:                               60-80
//   4-6 funded:                               40-60
//   7+ funded:                                20-40
//   "Red ocean" (8+ funded AND bigtech):      0-20
//
// Pure module — no Supabase import.

import { z } from "zod";
import {
  CORPUS,
  getCategoryStats,
  lookupByName,
  type CorpusCategory,
  type CorpusFundingTier,
} from "@/lib/score/corpus";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CompetitionInput = {
  /** User-claimed primary category (Stage 1 extraction). */
  category?: string | undefined;
  /** User-claimed competitor names (raw, comma-split done by caller). */
  claimed_competitors?: string[] | undefined;
  /** Optional extraction confidence (0..1). */
  extraction_confidence?: number | undefined;
};

export type CompetitionOutput = {
  /** 0..100 integer — higher = LESS competition = more white space. */
  score: number;
  /** Count of FUNDED entries in this category (corpus + user-supplied). */
  funded_competitor_count: number;
  /** Count of all entries (funded + unfunded) in this category. */
  total_competitor_count: number;
  /** True if 8+ funded AND at least one bigtech entry in this category. */
  red_ocean: boolean;
  /** Category slug the score was anchored on. */
  category: string;
  /** Names of funded user-claimed competitors we matched in the corpus. */
  user_claimed_competitors_funded: string[];
  /** Confidence 0..1. */
  confidence: number;
  /** Why we anchored on this category (for debug + UI tooltip). */
  category_resolution: "matched" | "fallback_unknown" | "fallback_no_category";
  /** Distribution of funded competitors by funding tier (for UI). */
  funded_by_tier: Record<CorpusFundingTier, number>;
};

export const CompetitionOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  funded_competitor_count: z.number().int().min(0),
  total_competitor_count: z.number().int().min(0),
  red_ocean: z.boolean(),
  category: z.string(),
  user_claimed_competitors_funded: z.array(z.string()).max(20),
  confidence: z.number().min(0).max(1),
  category_resolution: z.enum(["matched", "fallback_unknown", "fallback_no_category"]),
  funded_by_tier: z.object({
    bootstrap: z.number().int().min(0),
    seed: z.number().int().min(0),
    series_a: z.number().int().min(0),
    series_b_plus: z.number().int().min(0),
    bigtech: z.number().int().min(0),
  }),
});

// ---------------------------------------------------------------------------
// Category normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a free-text category from Stage 1 into a corpus slug.
 *
 * Strategy:
 *   1. Lowercase, strip punctuation, collapse whitespace.
 *   2. Tokenize into 1-3 word windows.
 *   3. Match against corpus category labels and their known aliases.
 *   4. If no match → return null (caller decides fallback).
 */
const CATEGORY_ALIASES: Array<{ slug: CorpusCategory; keys: string[] }> = [
  {
    slug: "ai-writing-assistant",
    keys: [
      "writing assistant",
      "ai writer",
      "copywriting",
      "content writing",
      "blog writer",
      "seo content",
      "ai writing",
      "writing tool",
    ],
  },
  {
    slug: "ai-code-assistant",
    keys: [
      "code assistant",
      "coding assistant",
      "code completion",
      "pair programmer",
      "developer tool",
      "code editor",
      "copilot",
      "coding tool",
      "developer ai",
    ],
  },
  {
    slug: "ai-image-generator",
    keys: [
      "image generator",
      "text to image",
      "image generation",
      "image ai",
      "ai art",
      "ai image",
      "image model",
    ],
  },
  {
    slug: "ai-video-generator",
    keys: [
      "video generator",
      "text to video",
      "video generation",
      "video ai",
      "ai video",
    ],
  },
  {
    slug: "ai-meeting-summarizer",
    keys: [
      "meeting notes",
      "meeting summarizer",
      "meeting assistant",
      "meeting ai",
      "transcription",
      "notetaker",
      "meeting transcript",
    ],
  },
  {
    slug: "ai-search",
    keys: ["ai search", "answer engine", "search ai", "search engine ai"],
  },
  {
    slug: "ai-chatbot",
    keys: ["chatbot", "chat assistant", "conversational ai", "chat gpt", "llm chat"],
  },
  {
    slug: "ai-data-analytics",
    keys: ["data analytics", "ai analyst", "data analyst", "bi tool", "data notebook"],
  },
  {
    slug: "ai-agent-platform",
    keys: ["agent platform", "ai agent", "agent framework", "multi agent"],
  },
  {
    slug: "ai-voice-speech",
    keys: [
      "voice ai",
      "text to speech",
      "voice generator",
      "voice synthesis",
      "voice cloning",
      "voiceover",
    ],
  },
  {
    slug: "ai-translation",
    keys: ["translation", "translator", "localization", "translation tool"],
  },
  {
    slug: "ai-sales-crm",
    keys: ["sales ai", "sales tool", "crm ai", "cold outreach", "sales email"],
  },
  {
    slug: "ai-recruiting-hr",
    keys: ["recruiting ai", "hr ai", "talent ai", "hiring ai", "recruitment"],
  },
  {
    slug: "ai-design-tool",
    keys: ["design ai", "design tool", "ai design", "ui generator", "graphic design"],
  },
  {
    slug: "ai-research-assistant",
    keys: ["research assistant", "research ai", "academic ai", "paper search"],
  },
  {
    slug: "ai-presentation",
    keys: ["presentation ai", "slide ai", "deck ai", "presentation tool"],
  },
  {
    slug: "ai-music-audio",
    keys: ["music ai", "music generator", "ai music", "song ai", "audio ai"],
  },
  {
    slug: "ai-document-summarizer",
    keys: ["pdf ai", "document ai", "doc summarizer", "pdf chat", "paper ai"],
  },
  {
    slug: "ai-avatar-video",
    keys: ["avatar ai", "avatar video", "talking head", "ai avatar"],
  },
  {
    slug: "ai-workflow-automation",
    keys: [
      "workflow automation",
      "automation tool",
      "zapier alternative",
      "no code automation",
      "automation platform",
    ],
  },
];

export function normalizeCategory(raw: string | undefined): CorpusCategory | null {
  if (!raw) return null;
  const norm = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!norm) return null;

  // Exact alias hit
  for (const { slug, keys } of CATEGORY_ALIASES) {
    for (const key of keys) {
      if (norm === key || norm.includes(key)) return slug;
    }
  }

  // Slug itself
  for (const { slug } of CATEGORY_ALIASES) {
    if (norm.includes(slug.replace(/-/g, " ")) || norm.includes(slug)) {
      return slug;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Apply the funded-competitor curve from the brief.
 *
 * Returns a 0..100 score. The curve is monotonic-decreasing in
 * funded_competitor_count + tier-weighted (bigtech hits harder).
 */
function calibrateFundedScore(
  fundedCount: number,
  bigtechCount: number,
  totalCount: number
): { score: number; red_ocean: boolean } {
  const red_ocean = fundedCount >= 8 && bigtechCount >= 1;

  // Base score from funded count.
  let score: number;
  if (fundedCount === 0) {
    // Sparse: 90-100. Add tiny bonus for very sparse total.
    score = 100 - Math.min(10, totalCount);
  } else if (fundedCount <= 3) {
    // 1-3 funded → 60-80. Score inside range based on bigtech pressure.
    score = 80 - (fundedCount - 1) * 7 - bigtechCount * 8;
  } else if (fundedCount <= 6) {
    // 4-6 → 40-60.
    score = 60 - (fundedCount - 4) * 6 - bigtechCount * 4;
  } else if (fundedCount <= 10) {
    // 7-10 → 20-40.
    score = 40 - (fundedCount - 7) * 5 - bigtechCount * 3;
  } else {
    // 11+ → 5-20.
    score = Math.max(5, 20 - (fundedCount - 11) * 2 - bigtechCount * 2);
  }

  // Red-ocean override: clamp to 0-20.
  if (red_ocean) score = Math.min(20, score);

  return { score: Math.max(0, Math.min(100, Math.round(score))), red_ocean };
}

// ---------------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------------

function deriveConfidence(args: {
  resolution: "matched" | "fallback_unknown" | "fallback_no_category";
  extractionConfidence: number;
  userCompetitorsCount: number;
  totalCategoryCount: number;
}): number {
  let c = 0.7;
  if (args.resolution === "matched") c += 0.15;
  else if (args.resolution === "fallback_unknown") c -= 0.1;
  else c -= 0.2;

  // User-claimed competitors sharpen the picture.
  if (args.userCompetitorsCount > 0) c += 0.1;
  if (args.userCompetitorsCount >= 3) c += 0.05;

  // Larger corpus categories = more reliable calibration.
  if (args.totalCategoryCount >= 3) c += 0.05;

  // Blend with extraction confidence if provided.
  if (args.extractionConfidence > 0) {
    c = c * 0.7 + args.extractionConfidence * 0.3;
  }

  return Math.max(0.1, Math.min(1, Math.round(c * 100) / 100));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score the competition axis for a tool.
 *
 * Cost: zero (pure lookup). Latency: <50ms p95.
 * Never throws.
 */
export async function scoreCompetition(
  input: CompetitionInput
): Promise<CompetitionOutput> {
  // 1. Resolve category.
  const resolved = normalizeCategory(input.category);
  let category: CorpusCategory;
  let resolution: CompetitionOutput["category_resolution"];

  if (resolved) {
    category = resolved;
    resolution = "matched";
  } else if (input.category && input.category.trim().length > 0) {
    // We got a category string but it didn't match any alias.
    // Pick the smallest category as a defensible fallback.
    const stats = getCategoryStats();
    let smallest: CorpusCategory | null = null;
    let smallestTotal = Infinity;
    for (const [slug, s] of stats) {
      if (s.total < smallestTotal) {
        smallestTotal = s.total;
        smallest = slug;
      }
    }
    category = smallest ?? "ai-chatbot";
    resolution = "fallback_unknown";
  } else {
    // No category at all → very low confidence, default to the largest
    // category (which gives the harshest score, forcing a low confidence).
    const stats = getCategoryStats();
    let largest: CorpusCategory | null = null;
    let largestTotal = -1;
    for (const [slug, s] of stats) {
      if (s.total > largestTotal) {
        largestTotal = s.total;
        largest = slug;
      }
    }
    category = largest ?? "ai-chatbot";
    resolution = "fallback_no_category";
  }

  // 2. Count funded + total in this category.
  const catEntries = CORPUS.filter((e) => e.category === category);
  let fundedCount = 0;
  let bigtechCount = 0;
  const fundedByTier: Record<CorpusFundingTier, number> = {
    bootstrap: 0,
    seed: 0,
    series_a: 0,
    series_b_plus: 0,
    bigtech: 0,
  };
  for (const e of catEntries) {
    if (e.funded) {
      fundedCount += 1;
      fundedByTier[e.funding_tier] += 1;
      if (e.funding_tier === "bigtech") bigtechCount += 1;
    }
  }
  const totalCount = catEntries.length;

  // 3. Add user-claimed competitors that aren't already in the corpus.
  const userClaimed = (input.claimed_competitors ?? [])
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  const userClaimedFunded: string[] = [];

  for (const name of userClaimed.slice(0, 10)) {
    const lookup = lookupByName(name);
    if (lookup && lookup.funded && !catEntries.find((e) => e.name === lookup.name)) {
      // The user named a funded competitor we hadn't already counted. Add it.
      fundedCount += 1;
      fundedByTier[lookup.funding_tier] += 1;
      if (lookup.funding_tier === "bigtech") bigtechCount += 1;
      userClaimedFunded.push(lookup.name);
    } else if (lookup && lookup.funded) {
      // Already in the category count — just record the name for UI.
      userClaimedFunded.push(lookup.name);
    }
  }

  // 4. Calibrate.
  const { score, red_ocean } = calibrateFundedScore(
    fundedCount,
    bigtechCount,
    totalCount
  );

  // 5. Confidence.
  const confidence = deriveConfidence({
    resolution,
    extractionConfidence: input.extraction_confidence ?? 0,
    userCompetitorsCount: userClaimed.length,
    totalCategoryCount: totalCount,
  });

  return {
    score,
    funded_competitor_count: fundedCount,
    total_competitor_count: totalCount + userClaimed.length,
    red_ocean,
    category,
    user_claimed_competitors_funded: userClaimedFunded,
    confidence,
    category_resolution: resolution,
    funded_by_tier: fundedByTier,
  };
}

// ---------------------------------------------------------------------------
// Pure helper exports (for testing)
// ---------------------------------------------------------------------------

export const __test__ = {
  calibrateFundedScore,
  normalizeCategory,
};