import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas/blue-diamond";
import { chatWithPersona, hasOllamaKey, type ChatMessage } from "@/lib/ai/ollama-chat";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(60),
});

export async function POST(request: Request, { params }: { params: Promise<{ persona: string }> }) {
  const { persona: slug } = await params;
  const persona = getPersona(slug);
  if (!persona) {
    return NextResponse.json({ error: "Unknown persona." }, { status: 404 });
  }

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
      { error: `${persona.name} isn't configured yet — the AI service key is missing.` },
      { status: 503 },
    );
  }

  const history: ChatMessage[] = parsed.data.messages.map((m) => ({ role: m.role, content: m.content }));

  try {
    const { text } = await chatWithPersona({ system: persona.systemPrompt, messages: history });
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error(`[team/${slug}/chat] generation failed`, err);
    return NextResponse.json({ error: "The AI service failed to respond — try again." }, { status: 502 });
  }
}
