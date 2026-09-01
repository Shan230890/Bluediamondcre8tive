"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Short, role-grounded conversation starter per persona — derived from the
// role already sourced from IDENTITY.md/SOUL.md in blue-diamond.ts, not new
// invented copy about who they are.
const STARTER_TOPIC: Record<string, string> = {
  henry: "your marketing strategy",
  harvey: "a legal or contract question",
  ray: "copy that actually converts",
  anna: "visual and brand direction",
  scott: "video or podcast production",
  barry: "a build, bug, or technical question",
};

/**
 * Chat state is in-memory/per-session only — no persistence to Supabase in
 * this pass. Known follow-up, not a silent omission: a `persona_chat_messages`
 * table would need its own migration + RLS policy, out of scope here.
 */
export function PersonaChat({
  slug,
  name,
  role,
  emoji,
}: {
  slug: string;
  name: string;
  role: string;
  emoji: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);
    setError("");

    try {
      const res = await fetch(`/api/dashboard/team/${slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: body.reply }]);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  const topic = STARTER_TOPIC[slug] ?? "how they can help";

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <span className="chat-header-avatar">{emoji}</span>
        <div>
          <div className="chat-header-name">{name}</div>
          <div className="chat-header-role">{role}</div>
        </div>
        <span className="chat-header-status">
          <span className="chat-header-status-dot" />
          Online
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="chat-empty">
          <span className="persona-avatar">{emoji}</span>
          <p className="chat-empty-title">Chat with {name}</p>
          <p className="chat-empty-sub">Ask {name} about {topic}.</p>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-row ${m.role}`}>
              {m.role === "assistant" && <span className="chat-row-avatar">{emoji}</span>}
              <div className={`chat-bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}
          {pending && (
            <div className="chat-row assistant">
              <span className="chat-row-avatar">{emoji}</span>
              <div className="chat-bubble assistant chat-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <form onSubmit={handleSend} className="chat-input-row">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={`Message ${name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <button type="submit" className="btn-solid" disabled={pending || !input.trim()} aria-label="Send message">
          <Send size={14} />
        </button>
      </form>
      <p className="chat-input-hint">Enter to send &middot; Shift+Enter for a new line</p>
      {error && (
        <p className="form-error" style={{ padding: "0 16px 12px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
