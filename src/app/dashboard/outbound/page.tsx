"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Copy, Check } from "lucide-react";

interface OutboundDeliverable {
  id: string;
  title: string;
  content: { icp_summary: string; cold_emails: string[]; linkedin_openers: string[] };
}

const DISCLAIMER =
  "These are draft messages for you to personalize and send yourself. Blue Diamond Cre8tive does not source real contact data, scrape prospects, or send messages on your behalf.";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-outline draft-copy-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard access can fail silently in some browser contexts; no-op.
        }
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function OutboundPageInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";

  const [targetTitle, setTargetTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<OutboundDeliverable | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetTitle.trim() || !industry.trim() || !companySize.trim() || !painPoint.trim()) return;
    setSubmitting(true);
    setError(null);
    setDrafts(null);
    try {
      const res = await fetch("/api/dashboard/outbound-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTitle, industry, companySize, painPoint, projectId: projectId || undefined }),
      });
      if (!res.ok) {
        const { error: err } = await res.json().catch(() => ({ error: "Failed to generate drafts." }));
        setError(err);
        return;
      }
      const { deliverable } = await res.json();
      setDrafts(deliverable);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Outbound Drafts</h1>
          <p>Signal-based outbound messaging, drafted by Ray against a described ICP.</p>
        </div>
      </div>

      <div className="dash-disclaimer">
        <Send size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{DISCLAIMER}</span>
      </div>

      <form className="kanban-new-task-panel" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label htmlFor="ob-title">Target title</label>
          <input id="ob-title" value={targetTitle} onChange={(e) => setTargetTitle(e.target.value)} placeholder="e.g. Head of Marketing" required />
        </div>
        <div className="field">
          <label htmlFor="ob-industry">Industry</label>
          <input id="ob-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. B2B SaaS" required />
        </div>
        <div className="field">
          <label htmlFor="ob-size">Company size</label>
          <input id="ob-size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="e.g. 50-200 employees" required />
        </div>
        <div className="field">
          <label htmlFor="ob-pain">Pain point</label>
          <textarea id="ob-pain" rows={2} value={painPoint} onChange={(e) => setPainPoint(e.target.value)} placeholder="What problem are they dealing with?" required />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="submit" className="btn-solid" disabled={submitting}>
            {submitting ? "Drafting…" : "Generate drafts"}
          </button>
        </div>
      </form>

      {drafts && (
        <div className="content-card">
          <h3>{drafts.title}</h3>
          <p>{drafts.content.icp_summary}</p>

          <h3 style={{ marginTop: 16 }}>Cold email drafts</h3>
          {drafts.content.cold_emails.map((email, i) => (
            <div className="draft-card" key={i}>
              {email}
              <CopyButton text={email} />
            </div>
          ))}

          <h3 style={{ marginTop: 16 }}>LinkedIn openers</h3>
          {drafts.content.linkedin_openers.map((opener, i) => (
            <div className="draft-card" key={i}>
              {opener}
              <CopyButton text={opener} />
            </div>
          ))}

          <div className="dash-disclaimer" style={{ marginTop: 16, marginBottom: 0 }}>
            <Send size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{DISCLAIMER}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutboundPage() {
  return (
    <Suspense fallback={null}>
      <OutboundPageInner />
    </Suspense>
  );
}
