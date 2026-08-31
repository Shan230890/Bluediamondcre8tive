"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Chat state is in-memory/per-session only — no persistence to Supabase in
 * this pass. Known follow-up, not a silent omission: a `persona_chat_messages`
 * table would need its own migration + RLS policy, out of scope here.
 */
export function PersonaChat({ slug, name, emoji }: { slug: string; name: string; emoji: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <span style={{ fontWeight: 700 }}>{name}</span>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>
            Say hello to {name} to get started.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {pending && <div className="chat-bubble assistant pending">{name} is typing...</div>}
      </div>
      <form onSubmit={handleSend} className="chat-input-row">
        <textarea
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
        <button type="submit" className="btn-solid" disabled={pending || !input.trim()}>
          Send
        </button>
      </form>
      {error && <p className="form-error" style={{ padding: "0 16px 12px" }}>{error}</p>}
    </div>
  );
}
