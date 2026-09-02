import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/** Fetch + status update for a single project. RLS-scoped, no admin client. */

const UpdateProjectSchema = z.object({
  status: z.enum(["discovery", "active", "review", "complete"]).optional(),
  name: z.string().min(1).max(200).optional(),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", user.id)
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (tasksError) {
    console.error("[projects/id] task load failed:", tasksError);
  }

  return NextResponse.json({ project, tasks: tasks ?? [] });
}

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

  const parsed = UpdateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const input = parsed.data;

  const update: Record<string, unknown> = {};
  if (input.status !== undefined) update.status = input.status;
  if (input.name !== undefined) update.name = input.name;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .eq("client_id", user.id)
    .select("*")
    .single();

  if (error) {
    console.error("[projects/id] update failed:", error);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}
