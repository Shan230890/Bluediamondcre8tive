import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/** Get / edit / delete a single custom agent. RLS-scoped, no admin client. */

const UpdateCustomAgentSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  title: z.string().min(1).max(120).optional(),
  mission: z.string().min(1).max(400).optional(),
  systemPrompt: z.string().min(1).max(4000).optional(),
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

  const { data, error } = await supabase.from("custom_agents").select("*").eq("id", id).eq("client_id", user.id).maybeSingle();
  if (error) {
    console.error("[custom-agents] get failed:", error);
    return NextResponse.json({ error: "Failed to load agent." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }

  return NextResponse.json({ agent: data });
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

  const parsed = UpdateCustomAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const input = parsed.data;
  if (Object.keys(input).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (input.name !== undefined) update.name = input.name;
  if (input.title !== undefined) update.title = input.title;
  if (input.mission !== undefined) update.mission = input.mission;
  if (input.systemPrompt !== undefined) update.system_prompt = input.systemPrompt;

  const { data, error } = await supabase
    .from("custom_agents")
    .update(update)
    .eq("id", id)
    .eq("client_id", user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[custom-agents] update failed:", error);
    return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }

  return NextResponse.json({ agent: data });
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

  const { error } = await supabase.from("custom_agents").delete().eq("id", id).eq("client_id", user.id);
  if (error) {
    console.error("[custom-agents] delete failed:", error);
    return NextResponse.json({ error: "Failed to delete agent." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
