"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CHANNEL_OPTIONS: { value: string; label: string }[] = [
  { value: "seo_content", label: "SEO / content" },
  { value: "paid_media", label: "Paid media" },
  { value: "social", label: "Social" },
  { value: "email_lifecycle", label: "Email / lifecycle" },
  { value: "outbound", label: "Outbound" },
  { value: "brand_design", label: "Brand / design" },
  { value: "video_podcast", label: "Video / podcast" },
  { value: "web_app", label: "Web / app" },
];

const CHANNEL_VALUES = new Set(CHANNEL_OPTIONS.map((c) => c.value));

function NewProjectPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    // ?focus=seo_content,paid_media preselects channels of interest — the
    // hand-off point from the /tools/* use-case marketing pages' CTAs, so a
    // visitor arriving with a specific interest doesn't have to re-tell us.
    const focus = searchParams.get("focus");
    if (!focus) return;
    const preselected = focus.split(",").map((v) => v.trim()).filter((v) => CHANNEL_VALUES.has(v));
    if (preselected.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChannels((prev) => Array.from(new Set([...prev, ...preselected])));
    }
    // Only ever applied once on mount from the initial query string.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleChannel(value: string) {
    setChannels((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !goals.trim() || !industry.trim() || !audience.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, goals, industry, audience, channels }),
      });
      if (!res.ok) {
        const { error: err } = await res.json().catch(() => ({ error: "Failed to create project." }));
        setError(err);
        return;
      }
      const { project } = await res.json();
      router.push(`/dashboard/projects/${project.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>New project</h1>
          <p>Tell your team what you&apos;re trying to do. Henry will draft a starter task list from it.</p>
        </div>
      </div>

      <form className="kanban-new-task-panel" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q4 launch for the new product line"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="project-goals">Goals</label>
          <textarea
            id="project-goals"
            rows={4}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="What are you trying to achieve? Be specific, this becomes the brief your team works from."
            required
          />
        </div>
        <div className="field">
          <label htmlFor="project-industry">Industry</label>
          <input
            id="project-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. B2B SaaS, DTC skincare, local services"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="project-audience">Target audience</label>
          <textarea
            id="project-audience"
            rows={2}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Who are you trying to reach?"
            required
          />
        </div>
        <div className="field">
          <label>Channels of interest</label>
          <div className="checkbox-grid">
            {CHANNEL_OPTIONS.map((c) => (
              <label key={c.value}>
                <input type="checkbox" checked={channels.includes(c.value)} onChange={() => toggleChannel(c.value)} />
                {c.label}
              </label>
            ))}
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="submit" className="btn-solid" disabled={submitting}>
            {submitting ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={null}>
      <NewProjectPageInner />
    </Suspense>
  );
}
