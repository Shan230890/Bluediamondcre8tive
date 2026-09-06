import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { chatWithPersona, hasOllamaKey, type ChatMessage } from "@/lib/ai/ollama-chat";
import { HELP_SYSTEM_PROMPT } from "@/lib/help/system-prompt";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(60),
});

/**
 * Stateless Help Assistant chat — same request/response shape and auth
 * pattern as /api/dashboard/team/[persona]/chat, no persistence, no
 * streaming, matching this app's existing chat convention exactly.
 */
export async function POST(request: Request) {
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

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!hasOllamaKey()) {
    return NextResponse.json(
      { error: "The Help Assistant isn't configured yet — the AI service key is missing." },
      { status: 503 },
    );
  }

  const history: ChatMessage[] = parsed.data.messages.map((m) => ({ role: m.role, content: m.content }));

  try {
    const { text } = await chatWithPersona({ system: HELP_SYSTEM_PROMPT, messages: history });
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[help/chat] generation failed", err);
    return NextResponse.json({ error: "The AI service failed to respond — try again." }, { status: 502 });
  }
}
