import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { scoreGeoAeo } from "@/lib/score/scoring-geo-aeo";
import { hasReachedAiVisibilityCap, startOfTodayUtc, AI_VISIBILITY_DAILY_CAP } from "@/lib/ai-visibility/daily-cap";

/**
 * AI Visibility Report — runs the existing scoreGeoAeo() simulation
 * (src/lib/score/scoring-geo-aeo.ts) once for the client's own brand and
 * once per named competitor (max 3), then stores the comparison. This is a
 * single bounded synchronous request, same shape as the task-assign route —
 * no background job, no polling.
 */

export const runtime = "nodejs";
export const maxDuration = 90;

const RequestSchema = z.object({
  brandName: z.string().min(2).max(100),
  category: z.string().min(2).max(120),
  valueProposition: z.string().max(500).optional(),
  competitors: z.array(z.string().min(1).max(100)).max(3).default([]),
  projectId: z.string().uuid().optional().nullable(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ai_visibility_reports")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ai-visibility] list failed:", error);
    return NextResponse.json({ error: "Failed to load reports." }, { status: 500 });
  }

  return NextResponse.json({ reports: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report request. Up to 3 competitors allowed." }, { status: 400 });
  }
  const input = parsed.data;

  const { count, error: countError } = await supabase
    .from("ai_visibility_reports")
    .select("id", { count: "exact", head: true })
    .eq("client_id", user.id)
    .gte("created_at", startOfTodayUtc().toISOString());

  if (countError) {
    console.error("[ai-visibility] daily cap check failed:", countError);
    return NextResponse.json({ error: "Failed to check daily report limit." }, { status: 500 });
  }

  if (hasReachedAiVisibilityCap(count ?? 0)) {
    return NextResponse.json(
      { error: `Daily AI Visibility Report limit reached (${AI_VISIBILITY_DAILY_CAP} per day). Try again tomorrow.` },
      { status: 429 },
    );
  }

  let ownResult;
  try {
    ownResult = await scoreGeoAeo({
      tool_name: input.brandName,
      category_primary: input.category,
      value_proposition: input.valueProposition,
    });
  } catch (err) {
    console.error("[ai-visibility] own-brand scoring failed:", err);
    return NextResponse.json({ error: "The AI service failed to score your brand. Try again." }, { status: 502 });
  }

  const competitorResults = await Promise.all(
    input.competitors.map(async (name) => {
      try {
        const result = await scoreGeoAeo({
          tool_name: name,
          category_primary: input.category,
          value_proposition: input.valueProposition,
        });
        return { name, result };
      } catch (err) {
        console.error(`[ai-visibility] competitor scoring failed for "${name}":`, err);
        return { name, result: null, error: "Scoring failed for this competitor." };
      }
    }),
  );

  const { data: report, error: insertError } = await supabase
    .from("ai_visibility_reports")
    .insert({
      client_id: user.id,
      project_id: input.projectId || null,
      brand_name: input.brandName,
      category: input.category,
      value_proposition: input.valueProposition || null,
      competitors: input.competitors,
      own_result: ownResult,
      competitor_results: competitorResults,
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("[ai-visibility] failed to persist report:", insertError);
    return NextResponse.json({ error: "Report generated but failed to save. Try again." }, { status: 500 });
  }

  return NextResponse.json({ report }, { status: 201 });
}
