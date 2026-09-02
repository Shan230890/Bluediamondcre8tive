import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * List + create for the Platform task board. Auth + RLS scoping follows the
 * same pattern as src/app/api/dashboard/team/[persona]/chat/route.ts — a
 * user-scoped Supabase client (respects RLS via client_id = auth.uid()), no
 * admin client needed since a client only ever touches their own rows.
 */

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().date().optional().nullable(),
  assigneePersonaKey: z.enum(["henry", "harvey", "ray", "anna", "scott", "barry"]).optional().nullable(),
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
    .from("tasks")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tasks] list failed:", error);
    return NextResponse.json({ error: "Failed to load tasks." }, { status: 500 });
  }

  return NextResponse.json({ tasks: data ?? [] });
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

  const parsed = CreateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid task." }, { status: 400 });
  }
  const input = parsed.data;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      client_id: user.id,
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      due_date: input.dueDate || null,
      assignee_persona_key: input.assigneePersonaKey || null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[tasks] create failed:", error);
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }

  return NextResponse.json({ task: data }, { status: 201 });
}
