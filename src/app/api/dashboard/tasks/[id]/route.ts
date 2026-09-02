import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/** Update (status drag, edits) + delete for a single task. RLS-scoped, no admin client. */

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(4000).nullable().optional(),
  status: z.enum(["open", "done", "dismissed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().date().nullable().optional(),
  assigneePersonaKey: z.enum(["henry", "harvey", "ray", "anna", "scott", "barry"]).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const parsed = UpdateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const input = parsed.data;

  const update: Record<string, unknown> = {};
  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) update.description = input.description;
  if (input.status !== undefined) update.status = input.status;
  if (input.priority !== undefined) update.priority = input.priority;
  if (input.dueDate !== undefined) update.due_date = input.dueDate;
  if (input.assigneePersonaKey !== undefined) {
    update.assignee_persona_key = input.assigneePersonaKey;
    // Reassigning away from a persona always clears auto-run, matching the
    // Opsara pattern this is adapted from — auto-run only makes sense while
    // a persona is actually attached to the task.
    if (!input.assigneePersonaKey) update.auto_run = false;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(update)
    .eq("id", id)
    .eq("client_id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("[tasks] update failed:", error);
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 });
  }

  return NextResponse.json({ task: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("client_id", user.id);
  if (error) {
    console.error("[tasks] delete failed:", error);
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
