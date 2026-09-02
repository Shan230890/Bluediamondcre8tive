import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPersona, PERSONA_SLUGS } from "@/lib/personas/blue-diamond";
import { chatWithPersona, hasOllamaKey } from "@/lib/ai/ollama-chat";

/**
 * List + create for client projects. Auth + RLS scoping follows the same
 * pattern as src/app/api/dashboard/tasks/route.ts — a user-scoped Supabase
 * client, no admin client needed.
 *
 * POST creates the project (status "discovery"), then synchronously asks
 * Henry to draft 5-8 starter tasks from the brief, inserts them as real
 * tasks rows scoped to the new project, and flips the project to "active".
 * If the LLM call fails or returns malformed JSON, the project is still
 * created with zero starter tasks — the client can add tasks manually.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const CHANNEL_OPTIONS = [
  "seo_content",
  "paid_media",
  "social",
  "email_lifecycle",
  "outbound",
  "brand_design",
  "video_podcast",
  "web_app",
] as const;

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  goals: z.string().min(1).max(4000),
  industry: z.string().min(1).max(200),
  audience: z.string().min(1).max(1000),
  channels: z.array(z.enum(CHANNEL_OPTIONS)).default([]),
});

const StarterTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().default(""),
  assignee_persona_key: z.enum(["henry", "harvey", "ray", "anna", "scott", "barry"]).optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
});

const StarterTasksResponseSchema = z.object({
  tasks: z.array(StarterTaskSchema).min(1).max(10),
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

function buildBriefPrompt(input: { name: string; goals: string; industry: string; audience: string; channels: string[] }): string {
  return `A client just created a new project brief. Draft a starter task list.

PROJECT: ${input.name}
INDUSTRY: ${input.industry}
GOALS: ${input.goals}
TARGET AUDIENCE: ${input.audience}
CHANNELS OF INTEREST: ${input.channels.length ? input.channels.join(", ") : "(none specified)"}

TASK: Produce 5-8 concrete starter tasks that would actually move this project forward,
each assigned to whichever of the six team members fits best: henry (CMO/strategy),
harvey (legal), ray (copywriter), anna (designer), scott (video/podcast), barry (web/app/code).
Keep each task specific to this brief, not generic filler.

RULES:
1. Output ONLY a JSON object, no prose, no markdown fences.
2. 5-8 tasks.
3. Each task: title (short), description (1-3 sentences of context), assignee_persona_key
   (one of henry/harvey/ray/anna/scott/barry), priority (low/medium/high).

REQUIRED SHAPE:
{
  "tasks": [
    {"title": "...", "description": "...", "assignee_persona_key": "ray", "priority": "medium"}
  ]
}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[projects] list failed:", error);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }

  const { data: taskCounts, error: countError } = await supabase
    .from("tasks")
    .select("project_id, status")
    .eq("client_id", user.id)
    .not("project_id", "is", null);

  if (countError) {
    console.error("[projects] task count failed:", countError);
  }

  const counts: Record<string, { total: number; done: number }> = {};
  for (const t of taskCounts ?? []) {
    const pid = t.project_id as string;
    if (!counts[pid]) counts[pid] = { total: 0, done: 0 };
    counts[pid].total += 1;
    if (t.status === "done") counts[pid].done += 1;
  }

  const withCounts = (projects ?? []).map((p) => ({
    ...p,
    task_count: counts[p.id]?.total ?? 0,
    done_count: counts[p.id]?.done ?? 0,
  }));

  return NextResponse.json({ projects: withCounts });
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

  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project brief." }, { status: 400 });
  }
  const input = parsed.data;

  const brief = [
    `Goals: ${input.goals}`,
    `Industry: ${input.industry}`,
    `Target audience: ${input.audience}`,
    `Channels of interest: ${input.channels.length ? input.channels.join(", ") : "none specified"}`,
  ].join("\n");

  const { data: project, error: createError } = await supabase
    .from("projects")
    .insert({
      client_id: user.id,
      name: input.name,
      brief,
      status: "discovery",
    })
    .select("*")
    .single();

  if (createError || !project) {
    console.error("[projects] create failed:", createError);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }

  let starterTasks: z.infer<typeof StarterTaskSchema>[] = [];

  if (hasOllamaKey()) {
    try {
      const henry = getPersona("henry")!;
      const { text } = await chatWithPersona({
        system: henry.systemPrompt,
        messages: [{ role: "user", content: buildBriefPrompt(input) }],
        temperature: 0.5,
        maxTokens: 1400,
      });
      const parsedJson = tryParseJson(text);
      if (parsedJson) {
        const validated = StarterTasksResponseSchema.safeParse(parsedJson);
        if (validated.success) {
          starterTasks = validated.data.tasks;
        } else {
          console.error("[projects] starter task JSON failed validation:", validated.error);
        }
      } else {
        console.error("[projects] starter task response was not valid JSON");
      }
    } catch (err) {
      console.error("[projects] starter task generation failed:", err);
    }
  } else {
    console.error("[projects] Ollama not configured — creating project with no starter tasks");
  }

  let insertedTasks: unknown[] = [];
  if (starterTasks.length > 0) {
    const rows = starterTasks.map((t) => ({
      client_id: user.id,
      project_id: project.id,
      title: t.title,
      description: t.description || null,
      priority: t.priority,
      assignee_persona_key: t.assignee_persona_key && PERSONA_SLUGS.includes(t.assignee_persona_key) ? t.assignee_persona_key : null,
      status: "open",
    }));

    const { data: created, error: tasksError } = await supabase.from("tasks").insert(rows).select("*");
    if (tasksError) {
      console.error("[projects] starter task insert failed:", tasksError);
    } else {
      insertedTasks = created ?? [];
    }
  }

  const { data: updatedProject, error: statusError } = await supabase
    .from("projects")
    .update({ status: "active" })
    .eq("id", project.id)
    .eq("client_id", user.id)
    .select("*")
    .single();

  if (statusError) {
    console.error("[projects] failed to flip project to active:", statusError);
  }

  return NextResponse.json(
    { project: updatedProject ?? project, tasks: insertedTasks },
    { status: 201 },
  );
}
