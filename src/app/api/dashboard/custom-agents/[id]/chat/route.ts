import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { chatWithPersona, hasOllamaKey, type ChatMessage } from "@/lib/ai/ollama-chat";
import {
  buildCustomAgentSystemPrompt,
  buildDeclineReply,
  buildScopeClassifierUserMessage,
  SCOPE_CLASSIFIER_SYSTEM_PROMPT,
} from "@/lib/custom-agents/prompt";

/**
 * Chat for one client-built custom agent. Follows the exact stateless
 * pattern of src/app/api/dashboard/team/[persona]/chat/route.ts (same
 * request/response shape, same auth check, same hasOllamaKey() guard, same
 * error handling) with one addition: a two-layer marketing-only scope lock.
 * Layer 1 is the fixed closing clause baked into buildCustomAgentSystemPrompt.
 * Layer 2 is the runtime classifier gate below — it runs BEFORE the real
 * generation call, and if it doesn't clearly return YES the real call never
 * happens.
 */

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(60),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: agent, error: agentError } = await supabase
    .from("custom_agents")
    .select("*")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();

  if (agentError) {
    console.error(`[custom-agents/${id}/chat] lookup failed`, agentError);
    return NextResponse.json({ error: "Failed to load agent." }, { status: 500 });
  }
  if (!agent) {
    return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!hasOllamaKey()) {
    return NextResponse.json(
      { error: `${agent.name} isn't configured yet. The AI service key is missing.` },
      { status: 503 },
    );
  }

  const history: ChatMessage[] = parsed.data.messages.map((m) => ({ role: m.role, content: m.content }));
  const latestUserMessage = [...parsed.data.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Layer 2: runtime scope gate. Runs before the real generation call. Fails
  // open to the real generation on a classifier infra error (network/model
  // failure) rather than blocking a legitimate user over a hiccup — but the
  // failure is logged so it's visible.
  let inScope = true;
  try {
    // No maxTokens cap here: the "haiku" tier model is a reasoning model
    // that emits its chain-of-thought in a separate `thinking` field before
    // the final word, so a tight token cap truncates the response before
    // it reaches the actual YES/NO content, leaving `text` empty. Verified
    // live against the real Ollama API — see the task notes.
    const classification = await chatWithPersona({
      tier: "haiku",
      system: SCOPE_CLASSIFIER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildScopeClassifierUserMessage(latestUserMessage) }],
      temperature: 0,
    });
    inScope = classification.text.trim().toUpperCase().startsWith("YES");
  } catch (err) {
    console.error(`[custom-agents/${id}/chat] scope classifier failed, failing open`, err);
    inScope = true;
  }

  if (!inScope) {
    return NextResponse.json({ reply: buildDeclineReply(agent.name, agent.mission) });
  }

  const systemPrompt = buildCustomAgentSystemPrompt({
    name: agent.name,
    title: agent.title,
    mission: agent.mission,
    systemPrompt: agent.system_prompt,
  });

  try {
    const { text } = await chatWithPersona({ system: systemPrompt, messages: history });
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error(`[custom-agents/${id}/chat] generation failed`, err);
    return NextResponse.json({ error: "The AI service failed to respond. Try again." }, { status: 502 });
  }
}
