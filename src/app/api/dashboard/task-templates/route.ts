import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * List + create for a client's own saved task templates (the honest
 * adaptation of "create custom agents" — see supabase/migrations/0006).
 * Auth + RLS scoping follows the same pattern as
 * src/app/api/dashboard/tasks/route.ts — a user-scoped Supabase client, no
 * admin client needed since a client only ever touches their own rows.
 */

const CreateTaskTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  instructions: z.string().min(1).max(4000),
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
    .from("task_templates")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[task-templates] list failed:", error);
    return NextResponse.json({ error: "Failed to load your templates." }, { status: 500 });
  }

  return NextResponse.json({ templates: data ?? [] });
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

  const parsed = CreateTaskTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid template." }, { status: 400 });
  }
  const input = parsed.data;

  const { data, error } = await supabase
    .from("task_templates")
    .insert({
      client_id: user.id,
      name: input.name,
      instructions: input.instructions,
      assignee_persona_key: input.assigneePersonaKey || null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[task-templates] create failed:", error);
    return NextResponse.json({ error: "Failed to save template." }, { status: 500 });
  }

  return NextResponse.json({ template: data }, { status: 201 });
}
