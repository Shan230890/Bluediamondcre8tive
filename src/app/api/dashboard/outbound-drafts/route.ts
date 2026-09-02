import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas/blue-diamond";
import { chatWithPersona, hasOllamaKey } from "@/lib/ai/ollama-chat";

/**
 * Signal-based outbound drafting — draft messaging only, against a
 * described ICP, no real contact data, no scraping, no sending. Same
 * bounded synchronous shape as the task-assign route.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  targetTitle: z.string().min(2).max(150),
  industry: z.string().min(2).max(150),
  companySize: z.string().min(1).max(100),
  painPoint: z.string().min(2).max(500),
});

const DraftsResponseSchema = z.object({
  icp_summary: z.string().min(1).max(1000),
  cold_emails: z.array(z.string().min(1).max(1200)).min(3).max(5),
  linkedin_openers: z.array(z.string().min(1).max(400)).min(2).max(3),
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

function buildPrompt(input: { targetTitle: string; industry: string; companySize: string; painPoint: string }): string {
  return `You are drafting outbound messaging against a described ICP (Ideal Customer Profile).
You have NO real contact data, no scraping, no enrichment tools — you are writing TEMPLATE
drafts for a human to personalize and send themselves. Use placeholder tokens like [First name]
and [Company], never invented real-sounding names presented as real people.

ICP:
- Target title: ${input.targetTitle}
- Industry: ${input.industry}
- Company size: ${input.companySize}
- Pain point: ${input.painPoint}

TASK: Produce a short ICP/persona summary, 4 cold email drafts, and 3 LinkedIn connection
request/opener drafts.

RULES:
1. Output ONLY a JSON object, no prose, no markdown fences.
2. Use [First name], [Company], and similar placeholder tokens — never real-sounding names.
3. Cold emails are short (under 120 words each), no corporate filler, a clear reason for reaching out.
4. LinkedIn openers are under 300 characters each.

REQUIRED SHAPE:
{
  "icp_summary": "...",
  "cold_emails": ["...", "...", "...", "..."],
  "linkedin_openers": ["...", "...", "..."]
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
    return NextResponse.json({ error: "Invalid ICP description." }, { status: 400 });
  }
  const input = parsed.data;

  if (!hasOllamaKey()) {
    return NextResponse.json({ error: "Ray isn't configured yet. The AI service key is missing." }, { status: 503 });
  }

  const ray = getPersona("ray")!;
  let drafts: z.infer<typeof DraftsResponseSchema>;
  try {
    const { text } = await chatWithPersona({
      system: ray.systemPrompt,
      messages: [{ role: "user", content: buildPrompt(input) }],
      temperature: 0.6,
      maxTokens: 1600,
    });
    const parsedJson = tryParseJson(text);
    if (!parsedJson) {
      return NextResponse.json({ error: "The AI service returned unreadable drafts. Try again." }, { status: 502 });
    }
    const validated = DraftsResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("[outbound-drafts] validation failed:", validated.error);
      return NextResponse.json({ error: "The AI service returned invalid drafts. Try again." }, { status: 502 });
    }
    drafts = validated.data;
  } catch (err) {
    console.error("[outbound-drafts] generation failed:", err);
    return NextResponse.json({ error: "The AI service failed to respond. Try again." }, { status: 502 });
  }

  const { data: deliverable, error: insertError } = await supabase
    .from("deliverables")
    .insert({
      client_id: user.id,
      project_id: input.projectId || null,
      title: `Outbound drafts: ${input.targetTitle}`,
      type: "outbound_drafts",
      content: { ...drafts, icp: input },
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("[outbound-drafts] failed to persist:", insertError);
    return NextResponse.json({ error: "Drafts generated but failed to save. Try again." }, { status: 500 });
  }

  return NextResponse.json({ deliverable }, { status: 201 });
}
