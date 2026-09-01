import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { callOllamaChat } from "@/lib/score/ollama";
import { buildScorePrompt } from "@/lib/score/prompts";
import { extractStructured } from "@/lib/score/extraction";
import { scoreTechnical } from "@/lib/score/scoring-technical";
import { scoreGap } from "@/lib/score/scoring-gap";
import { scoreGeoAeo } from "@/lib/score/scoring-geo-aeo";
import { scoreOriginality } from "@/lib/score/scoring-originality";
import { scoreCompetition } from "@/lib/score/scoring-competition";
import {
  computeConfidenceIntervals,
  computeOverall,
  buildEvidenceSummary,
  type ConfidenceInputs,
} from "@/lib/score/confidence";
import type { ScoreAxes } from "@/lib/score/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const FREE_TIER_LIMIT = 3;

const InputSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(20).max(2000),
  url: z.string().url().or(z.literal("")).optional(),
  competitors: z.string().max(500).optional(),
  // Anonymous visitor id (localStorage-backed) for pre-auth free tier tracking.
  visitorId: z.string().uuid().optional(),
  // Email required by the form — used to scope free credits and prevent abuse.
  email: z.string().email(),
});

// Schema for the legacy one-shot LLM call. Originality/Competition/GeoAeo are
// overwritten below by the evidence-based scorers once they resolve; this
// call exists as the seed + fallback source for brutalTruth.
const LegacyScoreLLMSchema = z.object({
  overall: z.number().int().min(0).max(100),
  axes: z.object({
    originality: z.number().int().min(0).max(100),
    technical: z.number().int().min(0).max(100),
    geoAeo: z.number().int().min(0).max(100),
    competition: z.number().int().min(0).max(100),
    gap: z.number().int().min(0).max(100),
  }),
  brutalTruth: z.string().min(10).max(500),
});

// Last-resort heuristic so the API never fully fails even if the LLM is down.
// Returns axes + brutalTruth; overall is recomputed by computeOverall.
function heuristicAxes(input: z.infer<typeof InputSchema>): {
  axes: ScoreAxes;
  brutalTruth: string;
} {
  const len = input.description.length;
  const hasUrl = !!input.url;
  const compCount = (input.competitors ?? "").split(",").filter(Boolean).length;

  const originality = Math.min(95, 40 + Math.floor(len / 30) + (compCount === 0 ? 15 : 0));
  const technical = Math.min(95, 45 + (hasUrl ? 20 : 0) + Math.floor(len / 40));
  const geoAeo = Math.min(85, 30 + (hasUrl ? 15 : 0));
  const competition = Math.max(15, 85 - compCount * 12);
  const gap = Math.min(90, originality - 5);

  return {
    axes: { originality, technical, geoAeo, competition, gap },
    brutalTruth:
      "Heuristic-only score (AI analysis unavailable right now). Try again shortly for a real assessment.",
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const service = createAdminClient();
  const userClient = await createUserClient();
  const { data: userData } = await userClient.auth.getUser();
  const userId = userData.user?.id ?? null;
  const userEmail = userData.user?.email ?? input.email;

  // ---------- FREE TIER ENFORCEMENT ----------
  // Scope priority: user_id > email > visitor_id. Signed-in users get scored
  // against their account so switching browsers doesn't reset the counter.
  let scopeColumn = "visitor_id";
  let scopeValue: string | null = input.visitorId ?? null;
  if (userId) {
    scopeColumn = "user_id";
    scopeValue = userId;
  } else if (input.email) {
    scopeColumn = "email";
    scopeValue = input.email;
  }

  if (scopeValue) {
    const { count } = await service
      .from("idea_assessments")
      .select("*", { count: "exact", head: true })
      .eq(scopeColumn, scopeValue);

    if ((count ?? 0) >= FREE_TIER_LIMIT) {
      return NextResponse.json(
        {
          error: `Free tier limit reached (${FREE_TIER_LIMIT} lifetime scores). Create a free account for more.`,
          upgrade: true,
          ctaHref: "/signup",
        },
        { status: 402 }
      );
    }
  }

  // ---------- STAGE 1: EXTRACTION ----------
  let extraction: Awaited<ReturnType<typeof extractStructured>> | null = null;
  try {
    extraction = await extractStructured({
      name: input.name,
      description: input.description,
      url: input.url,
      competitors: input.competitors,
    });
  } catch (err) {
    console.error("[score] extraction failed (non-fatal):", err);
  }

  // ---------- STAGE 2: ORIGINALITY + COMPETITION (evidence-based) ----------
  // Runs in parallel with Stage 4 below.
  const stage2Promise = Promise.all([
    scoreOriginality({
      name: input.name,
      description: input.description,
      value_proposition: extraction?.value_proposition.one_sentence,
      features: extraction?.claimed_features,
      extraction_confidence: extraction?.extraction_confidence,
    }).catch((err) => {
      console.error("[score] originality scoring failed (non-fatal):", err);
      return null;
    }),
    scoreCompetition({
      category: extraction?.category.primary,
      claimed_competitors:
        extraction?.claimed_competitors ??
        (input.competitors ?? "").split(",").map((c) => c.trim()).filter(Boolean),
      extraction_confidence: extraction?.extraction_confidence,
    }).catch((err) => {
      console.error("[score] competition scoring failed (non-fatal):", err);
      return null;
    }),
  ]);

  // ---------- STAGE 4: TECHNICAL + GAP (deterministic + cited) ----------
  const [techResult, gapResult] = await Promise.all([
    scoreTechnical({
      name: input.name,
      description: input.description,
      extraction,
    }),
    scoreGap({
      name: input.name,
      description: input.description,
      claimed_competitors:
        extraction?.claimed_competitors ??
        (input.competitors ?? "").split(",").map((c) => c.trim()).filter(Boolean),
      value_proposition: extraction?.value_proposition.one_sentence ?? input.description,
      differentiation_claims: extraction?.differentiation_claims ?? [],
      // Originality top_matches aren't awaited yet at this point in the
      // pipeline (kept identical to the source's documented limitation —
      // Gap scores without the neighborhood on this run).
      top_matches: [],
    }),
  ]);

  // ---------- STAGE 3: GEO/AEO (simulated multi-judge probe) ----------
  // Runs in parallel with the legacy LLM call below to save wall time.
  const geoAeoPromise = scoreGeoAeo({
    tool_name: input.name,
    category_primary: extraction?.category.primary ?? "general AI tool",
    category_secondary: extraction?.category.secondary,
    value_proposition: extraction?.value_proposition.one_sentence,
    ...(extraction ? { extraction } : {}),
  }).catch((err) => {
    console.error("[score] geoAeo scoring failed (non-fatal):", err);
    return null;
  });

  // ---------- LEGACY ONE-SHOT LLM (seeds brutalTruth + fallback axes) ----------
  let legacyAxes: ScoreAxes;
  let brutalTruth: string;

  try {
    const prompt = buildScorePrompt(input);
    const raw = await callOllamaChat({
      model: process.env.OLLAMA_ANALYSIS_MODEL || "deepseek-v4-pro:cloud",
      messages: [
        {
          role: "system",
          content:
            "You are a strict, technical AI tool reviewer. Always respond with valid JSON only. No prose, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/, "")
      .trim();
    const json = JSON.parse(cleaned);
    const legacy = LegacyScoreLLMSchema.parse(json);

    legacyAxes = {
      originality: legacy.axes.originality,
      technical: techResult.score, // Stage 4 overwrites
      geoAeo: legacy.axes.geoAeo, // Stage 3 overwrites below
      competition: legacy.axes.competition,
      gap: gapResult.score, // Stage 4 overwrites
    };
    brutalTruth = legacy.brutalTruth;
  } catch (err) {
    console.error(
      "[score] legacy LLM failed, falling back to heuristic (Technical/Gap still use Stage 4):",
      err
    );
    const h = heuristicAxes(input);
    legacyAxes = {
      originality: h.axes.originality,
      technical: techResult.score,
      geoAeo: h.axes.geoAeo,
      competition: h.axes.competition,
      gap: gapResult.score,
    };
    brutalTruth = h.brutalTruth;
  }

  // ---------- STAGE 3 OVERWRITE ----------
  const geoAeoEvidence = await geoAeoPromise;
  if (geoAeoEvidence) {
    legacyAxes.geoAeo = geoAeoEvidence.score;
  }

  // ---------- STAGE 2 OVERWRITE ----------
  const [originalityEvidence, competitionEvidence] = await stage2Promise;
  if (originalityEvidence) {
    legacyAxes.originality = originalityEvidence.score;
  }
  if (competitionEvidence) {
    legacyAxes.competition = competitionEvidence.score;
  }

  // ---------- CONFIDENCE INTERVALS + EVIDENCE SUMMARY ----------
  const ciInputs: ConfidenceInputs = {
    originality_embedding_ok: originalityEvidence?.source === "ollama",
    competition_corpus_ok: competitionEvidence?.category_resolution !== "fallback_no_category",
    geo_mention_rate: geoAeoEvidence?.mention_rate ?? 0,
    technical_url_probed: extraction?.tech_signals.url_probed ?? false,
    gap_has_neighborhood: (originalityEvidence?.top_matches?.length ?? 0) > 0,
  };
  const confidenceIntervals = computeConfidenceIntervals(ciInputs);

  const evidenceSummary = buildEvidenceSummary({
    originality_top_match: originalityEvidence
      ? {
          name: originalityEvidence.top_matches[0]?.tool ?? "unknown",
          similarity: originalityEvidence.max_similarity,
        }
      : null,
    competition_funded_count: competitionEvidence?.funded_competitor_count ?? null,
    geo_mention_rate: geoAeoEvidence?.mention_rate ?? 0,
    technical_url_probed: extraction?.tech_signals.url_probed ?? false,
    technical_has_schema_org: extraction?.tech_signals.has_schema_org ?? false,
    gap_neighborhood_size: originalityEvidence?.top_matches?.length ?? 0,
    gap_top_gap: gapResult.evidence_citations[0] ?? null,
  });

  // ---------- OVERALL ----------
  const overall = computeOverall(legacyAxes);

  // ---------- SHARE SLUG ----------
  const slug = `${input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 24)}-${Math.random().toString(36).slice(2, 8)}`;

  // ---------- PERSIST ----------
  const { data, error } = await service
    .from("idea_assessments")
    .insert({
      visitor_id: userId ? null : input.visitorId ?? null,
      client_id: userId,
      email: userEmail,
      idea_name: input.name,
      idea_description: input.description,
      idea_url: input.url || null,
      competitors: (input.competitors ?? "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      extraction_json: extraction ?? null,
      score_overall: overall,
      score_originality: legacyAxes.originality,
      score_technical: legacyAxes.technical,
      score_geo_aeo: legacyAxes.geoAeo,
      score_competition: legacyAxes.competition,
      score_gap: legacyAxes.gap,
      brutal_truth: brutalTruth,
      share_slug: slug,
      scoring_version: "v1",
      technical_evidence: techResult.evidence,
      gap_evidence: gapResult.evidence,
      geo_aeo_evidence: geoAeoEvidence ?? null,
      originality_evidence: originalityEvidence ?? null,
      competition_evidence: competitionEvidence ?? null,
      confidence_intervals: confidenceIntervals,
    })
    .select("share_slug")
    .single();

  if (error) {
    console.error("[score] insert failed:", error);
  }

  return NextResponse.json({
    overall,
    axes: legacyAxes,
    confidenceIntervals,
    brutalTruth,
    shareSlug: data?.share_slug ?? slug,
    evidenceSummary,
  });
}
