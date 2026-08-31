import { Ollama } from "ollama";

/**
 * Model tier mapping onto the Ollama cloud subscription, mirroring Opsara's
 * src/lib/ai/ollama.ts. "haiku" = cheap/fast, "sonnet" = quality-critical
 * (default for persona chat), "deepthink" = heaviest reasoning tier.
 */
export const MODELS = {
  haiku: process.env.OLLAMA_MODEL_HAIKU ?? "kimi-k2.7-code:cloud",
  sonnet: process.env.OLLAMA_MODEL_SONNET ?? "glm-5.2:cloud",
  deepthink: process.env.OLLAMA_MODEL_DEEPTHINK ?? "deepseek-v4-pro:cloud",
} as const;

export type ModelTier = keyof typeof MODELS;

export function hasOllamaKey(): boolean {
  return !!process.env.OLLAMA_API_KEY;
}

function getOllamaClient(): Ollama {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error("OLLAMA_API_KEY is not set");
  return new Ollama({
    host: "https://ollama.com",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

interface ChatParams {
  tier?: ModelTier;
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

interface ChatResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Single entry point for Cre8tive Team persona chat. Defaults to the
 * sonnet tier (quality-critical) — persona chat is a client-facing
 * feature, not a high-frequency classification call.
 */
export async function chatWithPersona({
  tier = "sonnet",
  system,
  messages,
  temperature,
  maxTokens,
}: ChatParams): Promise<ChatResult> {
  const ollama = getOllamaClient();
  const fullMessages: ChatMessage[] = [{ role: "system", content: system }, ...messages];

  const response = await ollama.chat({
    model: MODELS[tier],
    messages: fullMessages,
    options: {
      ...(maxTokens != null ? { num_predict: maxTokens } : {}),
      ...(temperature != null ? { temperature } : {}),
    },
  });

  return {
    text: response.message.content,
    inputTokens: response.prompt_eval_count ?? 0,
    outputTokens: response.eval_count ?? 0,
  };
}
