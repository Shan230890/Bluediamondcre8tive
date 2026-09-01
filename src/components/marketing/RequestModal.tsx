"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useRequestModal } from "./RequestModalContext";
import { useScrollLock } from "./useScrollLock";

/**
 * Shared request modal, reachable from any CTA across the marketing site.
 * Backdrop blur, bottom-sheet on mobile, Escape/backdrop-click closes, and
 * posts to the real /api/contact route (not a stub -- this reuses the same
 * working inquiry pipeline the standalone /contact page uses).
 */
export function RequestModal() {
  const { open, interest, closeModal } = useRequestModal();
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => setStatus("idle"), 300);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: "",
      interest,
      message: String(form.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bdc-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="bdc-modal-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Send a request">
        <button type="button" className="bdc-modal-close" onClick={closeModal} aria-label="Close">
          <X size={18} />
        </button>

        {status === "sent" ? (
          <div className="bdc-modal-success">
            <div className="bdc-modal-success-badge">
              <CheckCircle2 size={28} />
            </div>
            <h3>Request sent</h3>
            <p>Thanks, we&apos;ve got it. We&apos;ll follow up by email shortly with next steps.</p>
            <button type="button" className="bdc-pill bdc-pill-dark" onClick={closeModal}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="bdc-eyebrow bdc-eyebrow-dark">
              <span className="bdc-eyebrow-dot" />
              Let&apos;s talk
            </span>
            <h3 className="bdc-modal-heading">Tell us about your brand</h3>
            <div className="field">
              <label htmlFor="modal-name">Name</label>
              <input id="modal-name" name="name" required />
            </div>
            <div className="field">
              <label htmlFor="modal-email">Email</label>
              <input id="modal-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="modal-message">Project details</label>
              <textarea id="modal-message" name="message" rows={4} required />
            </div>
            {status === "error" && (
              <p className="form-error">Something went wrong. Email hello@bluediamondcre8tive.com directly.</p>
            )}
            <p className="bdc-modal-note">This is not live checkout. We reply by email, usually within one business day.</p>
            <button type="submit" className="bdc-pill bdc-pill-dark" style={{ width: "100%" }} disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
