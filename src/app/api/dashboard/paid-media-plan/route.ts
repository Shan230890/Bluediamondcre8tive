import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas/blue-diamond";
import { chatWithPersona, hasOllamaKey } from "@/lib/ai/ollama-chat";

/**
 * Paid Media Plan — creative direction + recommended budget split only.
 * Blue Diamond Cre8tive does not manage ad accounts or spend on a client's
 * behalf (Shan's explicit boundary); this generates a plan for the client's
 * own media buyer or ad platform account to execute, same bounded
 * synchronous shape as the task-assign route.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const CHANNELS = ["google", "meta", "linkedin", "youtube", "reddit"] as const;

const RequestSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  totalBudget: z.number().positive().max(10_000_000),
  channels: z.array(z.enum(CHANNELS)).min(1),
  goal: z.string().min(2).max(500),
});

const ChannelPlanSchema = z.object({
  channel: z.enum(CHANNELS),
  budget: z.number().nonnegative(),
  creative_angle: z.string().min(1).max(600),
  audience_notes: z.string().min(1).max(600),
});

const PlanResponseSchema = z.object({
  channels: z.array(ChannelPlanSchema).min(1),
  summary: z.string().max(1000).optional().default(""),
});

function tryParseJson(raw: string): unknown | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
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

function buildPrompt(input: { totalBudget: number; channels: string[]; goal: string }): string {
  return `A client wants a paid media plan. You are producing creative direction and a recommended
budget split ONLY — you do not manage ad accounts or spend money. The client (or their media
buyer) will execute this plan themselves.

TOTAL BUDGET: ${input.totalBudget}
CHANNELS: ${input.channels.join(", ")}
GOAL: ${input.goal}

TASK: Split the total budget across the listed channels (the budgets MUST sum to exactly
${input.totalBudget}), and for each channel give a creative angle/messaging direction and
target-audience notes.

RULES:
1. Output ONLY a JSON object, no prose, no markdown fences.
2. One entry per channel listed, budgets sum to ${input.totalBudget}.
3. creative_angle and audience_notes are each 1-3 concrete sentences, not generic filler.

REQUIRED SHAPE:
{
  "summary": "one paragraph overview of the strategy",
  "channels": [
    {"channel": "google", "budget": 1000, "creative_angle": "...", "audience_notes": "..."}
  ]
}`;
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
    return NextResponse.json({ error: "Invalid plan request." }, { status: 400 });
  }
  const input = parsed.data;

  if (!hasOllamaKey()) {
    return NextResponse.json({ error: "Henry isn't configured yet. The AI service key is missing." }, { status: 503 });
  }

  const henry = getPersona("henry")!;
  let plan: z.infer<typeof PlanResponseSchema>;
  try {
    const { text } = await chatWithPersona({
      system: henry.systemPrompt,
      messages: [{ role: "user", content: buildPrompt(input) }],
      temperature: 0.5,
      maxTokens: 1400,
    });
    const parsedJson = tryParseJson(text);
    if (!parsedJson) {
      return NextResponse.json({ error: "The AI service returned an unreadable plan. Try again." }, { status: 502 });
    }
    const validated = PlanResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("[paid-media-plan] validation failed:", validated.error);
      return NextResponse.json({ error: "The AI service returned an invalid plan. Try again." }, { status: 502 });
    }
    plan = validated.data;

    // The model is asked to make the budgets sum exactly, but LLM output
    // sometimes drifts by a few units — rescale proportionally so the
    // rendered plan always adds up to what the client asked for.
    const sum = plan.channels.reduce((acc, c) => acc + c.budget, 0);
    if (sum > 0 && Math.abs(sum - input.totalBudget) > 0.01) {
      const factor = input.totalBudget / sum;
      plan = { ...plan, channels: plan.channels.map((c) => ({ ...c, budget: Math.round(c.budget * factor * 100) / 100 })) };
    }
  } catch (err) {
    console.error("[paid-media-plan] generation failed:", err);
    return NextResponse.json({ error: "The AI service failed to respond. Try again." }, { status: 502 });
  }

  const { data: deliverable, error: insertError } = await supabase
    .from("deliverables")
    .insert({
      client_id: user.id,
      project_id: input.projectId || null,
      title: `Paid media plan: ${input.goal}`,
      type: "paid_media_plan",
      content: { ...plan, total_budget: input.totalBudget, goal: input.goal, channels_requested: input.channels },
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("[paid-media-plan] failed to persist:", insertError);
    return NextResponse.json({ error: "Plan generated but failed to save. Try again." }, { status: 500 });
  }

  return NextResponse.json({ deliverable }, { status: 201 });
}
