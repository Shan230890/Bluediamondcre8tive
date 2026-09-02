import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas/blue-diamond";
import { chatWithPersona, hasOllamaKey } from "@/lib/ai/ollama-chat";
import { hasReachedAutoRunCap, startOfTodayUtc, AUTO_RUN_DAILY_CAP } from "@/lib/tasks/auto-run";

export const runtime = "nodejs";
// A single synchronous persona reply, same bounded-latency shape as the
// existing /api/dashboard/team/[persona]/chat route — not a background job.
export const maxDuration = 60;

const AssignSchema = z.object({
  personaKey: z.enum(["henry", "harvey", "ray", "anna", "scott", "barry"]),
  autoRun: z.boolean().default(false),
});

/**
 * Assigns a task to one of the six Cre8tive Team personas and runs it
 * synchronously: the persona drafts a reply to the task's title +
 * description, the reply is stored on the task, and the task stays "open"
 * for review unless auto-run was requested, in which case it flips straight
 * to "done" (gated by a per-client daily cap so auto-run can't be abused).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const parsed = AssignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assignment." }, { status: 400 });
  }
  const { personaKey, autoRun } = parsed.data;

  const persona = getPersona(personaKey);
  if (!persona) {
    return NextResponse.json({ error: "Unknown persona." }, { status: 400 });
  }

  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("id, title, description")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (fetchError || !task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!hasOllamaKey()) {
    return NextResponse.json(
      { error: `${persona.name} isn't configured yet — the AI service key is missing.` },
      { status: 503 },
    );
  }

  // Daily auto-run cap: count this client's tasks that completed an
  // auto-run today (auto_run = true, updated_at >= start of today in UTC).
  // Checked before doing any work so a rejected request doesn't burn an
  // LLM call, and re-checked implicitly by the count staying accurate since
  // the flip to "done" only happens after this check passes.
  if (autoRun) {
    const { count, error: countError } = await supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("client_id", user.id)
      .eq("auto_run", true)
      .gte("updated_at", startOfTodayUtc().toISOString());

    if (countError) {
      console.error("[tasks/assign] auto-run cap check failed:", countError);
      return NextResponse.json({ error: "Failed to check auto-run cap." }, { status: 500 });
    }

    if (hasReachedAutoRunCap(count ?? 0)) {
      return NextResponse.json(
        { error: `Daily auto-run limit reached (${AUTO_RUN_DAILY_CAP} per day). Try again tomorrow, or review this task manually.` },
        { status: 429 },
      );
    }
  }

  const opening = [task.title, task.description].filter(Boolean).join("\n\n");

  let replyText: string;
  try {
    const { text } = await chatWithPersona({
      system: persona.systemPrompt,
      messages: [{ role: "user", content: opening }],
    });
    replyText = text;
  } catch (err) {
    console.error(`[tasks/assign] ${personaKey} generation failed`, err);
    return NextResponse.json({ error: "The AI service failed to respond — try again." }, { status: 502 });
  }

  const update: Record<string, unknown> = {
    assignee_persona_key: personaKey,
    auto_run: autoRun,
    ai_reply: replyText,
    ai_replied_at: new Date().toISOString(),
  };
  if (autoRun) update.status = "done";

  const { data: updated, error: updateError } = await supabase
    .from("tasks")
    .update(update)
    .eq("id", id)
    .eq("client_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    console.error("[tasks/assign] failed to persist reply:", updateError);
    return NextResponse.json({ error: "Reply generated but failed to save — try again." }, { status: 500 });
  }

  return NextResponse.json({ task: updated });
}
