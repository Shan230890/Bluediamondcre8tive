// Cre8tive Score scoring prompt — VERSION v1
// Methodology is server-side only. Never expose this to the client.

import type { ScoreAxes } from "@/lib/score/types";

type ScoreInput = {
  name: string;
  description: string;
  url?: string | undefined;
  competitors?: string | undefined;
};

// Weights — DO NOT expose to clients.
const WEIGHTS = {
  originality: 0.3,
  technical: 0.2,
  geoAeo: 0.2,
  competition: 0.15,
  gap: 0.15,
} as const;

export function buildScorePrompt(input: ScoreInput): string {
  const competitorList = input.competitors
    ? input.competitors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  return `You are scoring an AI tool idea for Cre8tive Score, an originality and positioning benchmark.

TOOL NAME: ${input.name}
DESCRIPTION: ${input.description}
${input.url ? `URL: ${input.url}` : ""}
${competitorList.length ? `KNOWN COMPETITORS: ${competitorList.join(", ")}` : ""}

Score each axis 0-100 based on your honest technical assessment:

1. ORIGINALITY (weight ${WEIGHTS.originality * 100}%): How novel is the idea vs existing tools? Does it solve a problem no one is solving well, or is it a clone of category leader with a different logo?

2. TECHNICAL FEASIBILITY (weight ${WEIGHTS.technical * 100}%): Can this be built with current technology? Is the technical approach sound? Are there red flags (overpromising, missing critical infra, hand-wavy "AI magic")?

3. GEO / AEO READINESS (weight ${WEIGHTS.geoAeo * 100}%): Will generative engines (ChatGPT, Claude, Perplexity, Google AI Overviews) recommend this tool when users ask relevant queries? Consider: structured data, brand mentions, content strategy, niche specificity. High score = niche authority. Low score = commodity in a crowded space.

4. COMPETITION (weight ${WEIGHTS.competition * 100}%): Higher = LESS competition = more white space. If the category is saturated with funded players, score low. If it's wide open, score high.

5. GAP / WHITE SPACE (weight ${WEIGHTS.gap * 100}%): Where exactly can this tool carve out a defensible position? Is the angle obvious, defensible, and underserved?

THEN:
- Calculate overall = weighted average, round to integer.
- Write a "brutal truth" — ONE sentence, max 25 words, no hedging, no encouragement. What would a brutally honest technical founder say about this idea?

RESPOND WITH THIS EXACT JSON SHAPE (no prose, no markdown):

{
  "overall": <integer 0-100>,
  "axes": {
    "originality": <integer>,
    "technical": <integer>,
    "geoAeo": <integer>,
    "competition": <integer>,
    "gap": <integer>
  },
  "brutalTruth": "<one sentence, max 25 words>"
}`;
}

// ---------------------------------------------------------------------------
// Recommended Fixes prompt (reserved for a future iteration — not wired into
// the v1 API route, kept for parity with the source pipeline's shape).
// ---------------------------------------------------------------------------

export function buildFixesPrompt(input: {
  tool_name: string;
  axes: ScoreAxes;
  weakest_axis: keyof ScoreAxes;
  second_weakest_axis: keyof ScoreAxes;
  brutal_truth: string;
  evidence_summary?: string;
}): string {
  const axisLabel = (k: keyof ScoreAxes): string => {
    const labels: Record<keyof ScoreAxes, string> = {
      originality: "Originality",
      technical: "Technical Feasibility",
      geoAeo: "GEO / AEO Readiness",
      competition: "Competition (higher = less competition)",
      gap: "Gap / White Space",
    };
    return labels[k];
  };

  return `You are a brutally honest product strategist for AI tools. Your job is to recommend specific, actionable fixes to improve a tool's Cre8tive Score.

TOOL NAME: ${input.tool_name}
BRUTAL TRUTH: ${input.brutal_truth}

CURRENT SCORES:
- Originality: ${input.axes.originality}
- Technical Feasibility: ${input.axes.technical}
- GEO / AEO Readiness: ${input.axes.geoAeo}
- Competition (higher = less competition): ${input.axes.competition}
- Gap / White Space: ${input.axes.gap}

The two weakest axes needing improvement:
1. ${axisLabel(input.weakest_axis)} — score: ${input.axes[input.weakest_axis]}
2. ${axisLabel(input.second_weakest_axis)} — score: ${input.axes[input.second_weakest_axis]}
${input.evidence_summary ? `\nEVIDENCE:\n${input.evidence_summary}` : ""}

Generate 3-5 specific, actionable fixes focused on improving these two weakest axes. Each fix must be:
- Concrete and specific to THIS tool (not generic advice)
- Something the builder can actually do (not "be more innovative")
- Include estimated effort (Low / Medium / High)
- Include expected impact (+X points to the axis score)

RESPOND WITH THIS EXACT JSON SHAPE (no prose, no markdown fences):

{
  "fixes": [
    {
      "id": "fix-1",
      "axis": "${input.weakest_axis}",
      "title": "<short imperative title, max 8 words>",
      "body": "<2-3 sentences explaining exactly what to do and why>",
      "effort": "Low" | "Medium" | "High",
      "expected_impact": "+<N> points"
    }
  ]
}`;
}
