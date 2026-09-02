import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { randomSuffix, slugify } from "@/lib/custom-agents/slug";

/**
 * List + create for a client's own custom marketing agents (0007 migration).
 * Auth + RLS scoping follows the same pattern as
 * src/app/api/dashboard/task-templates/route.ts — a user-scoped Supabase
 * client, no admin client needed since a client only ever touches their own
 * rows.
 */

const CreateCustomAgentSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  mission: z.string().min(1).max(400),
  systemPrompt: z.string().min(1).max(4000),
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
    .from("custom_agents")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[custom-agents] list failed:", error);
    return NextResponse.json({ error: "Failed to load your custom agents." }, { status: 500 });
  }

  return NextResponse.json({ agents: data ?? [] });
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

  const parsed = CreateCustomAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid agent." }, { status: 400 });
  }
  const input = parsed.data;
  const baseSlug = slugify(input.name);

  // A client may reuse a display name under a different intent — the
  // unique(client_id, slug) constraint would reject that as a collision, so
  // append a short suffix instead of surfacing a confusing DB error.
  let slug = baseSlug;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: existing } = await supabase
      .from("custom_agents")
      .select("id")
      .eq("client_id", user.id)
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${randomSuffix()}`;
  }

  const { data, error } = await supabase
    .from("custom_agents")
    .insert({
      client_id: user.id,
      slug,
      name: input.name,
      title: input.title,
      mission: input.mission,
      system_prompt: input.systemPrompt,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[custom-agents] create failed:", error);
    return NextResponse.json({ error: "Failed to create agent." }, { status: 500 });
  }

  return NextResponse.json({ agent: data }, { status: 201 });
}
