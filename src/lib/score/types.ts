// Cre8tive Score — shared types. Server-only weights live in confidence.ts,
// not here; this file only carries shapes.

export type ScoreAxes = {
  originality: number;
  technical: number;
  geoAeo: number;
  competition: number;
  gap: number;
};

export const AXIS_LABELS: Record<keyof ScoreAxes, string> = {
  originality: "Originality",
  technical: "Technical Feasibility",
  geoAeo: "GEO / AEO Readiness",
  competition: "Competition (higher = less competition)",
  gap: "Gap / White Space",
};

export const AXIS_DESCRIPTIONS: Record<keyof ScoreAxes, string> = {
  originality:
    "How different this idea is from ~55 known AI tools we compare it against, using semantic similarity.",
  technical:
    "Whether the idea is technically buildable as described, based on rule-based feasibility checks plus a light AI review.",
  geoAeo:
    "A simulation of how often AI assistants would recommend something like this when asked relevant questions. This is not a live check against ChatGPT, Claude, or Perplexity's real APIs.",
  competition:
    "How saturated the category is. Higher means less competition and more open ground.",
  gap: "Whether there is a defensible, underserved angle this idea could own.",
};

// ---------------------------------------------------------------------------
// idea_assessments row shape (mirrors supabase/migrations/0002_idea_score.sql)
// ---------------------------------------------------------------------------
export type IdeaAssessment = {
  id: string;
  visitor_id: string | null;
  client_id: string | null;
  email: string | null;
  idea_name: string;
  idea_description: string;
  idea_url: string | null;
  competitors: string[];
  score_overall: number;
  score_originality: number;
  score_technical: number;
  score_geo_aeo: number;
  score_competition: number;
  score_gap: number;
  brutal_truth: string;
  share_slug: string;
  scoring_version: string;
  extraction_json: Record<string, unknown> | null;
  originality_evidence: {
    top_matches?: Array<{ tool: string; category: string; similarity: number }>;
    source?: "ollama" | "deterministic";
    confidence?: number;
  } | null;
  competition_evidence: {
    funded_competitor_count?: number;
    red_ocean?: boolean;
    confidence?: number;
  } | null;
  geo_aeo_evidence: {
    mention_rate?: number;
    confidence?: number;
    method?: string;
  } | null;
  technical_evidence: {
    url_probed?: boolean;
    red_flags?: string[];
    llm_reasoning?: string;
  } | null;
  gap_evidence: {
    reasoning?: string;
    cited_features?: string[];
    confidence?: number;
  } | null;
  confidence_intervals: Record<keyof ScoreAxes, number> | null;
  created_at: string;
};
