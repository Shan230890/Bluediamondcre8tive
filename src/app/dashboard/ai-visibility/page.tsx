"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Radar } from "lucide-react";

interface GeoAeoProbe {
  probe: string;
  llm: string;
  mentioned: boolean;
  position: number | null;
  raw_excerpt?: string;
}

interface GeoAeoEvidence {
  score: number;
  mention_rate: number;
  top_position_rate: number;
  probe_count: number;
  judge_count: number;
  sample_responses: GeoAeoProbe[];
  confidence: number;
  method: string;
}

interface CompetitorResult {
  name: string;
  result: GeoAeoEvidence | null;
  error?: string;
}

interface Report {
  id: string;
  brand_name: string;
  category: string;
  value_proposition: string | null;
  competitors: string[];
  own_result: GeoAeoEvidence;
  competitor_results: CompetitorResult[];
  created_at: string;
}

const JUDGE_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT-style judge",
  claude: "Claude-style judge",
  perplexity: "Perplexity-style judge",
  google_aio: "Google AI Overviews-style judge",
};

function judgeBreakdown(sampleResponses: GeoAeoProbe[]) {
  const byJudge: Record<string, { mentioned: number; total: number; bestPosition: number | null }> = {};
  for (const r of sampleResponses) {
    if (!byJudge[r.llm]) byJudge[r.llm] = { mentioned: 0, total: 0, bestPosition: null };
    byJudge[r.llm].total += 1;
    if (r.mentioned) {
      byJudge[r.llm].mentioned += 1;
      if (r.position != null && (byJudge[r.llm].bestPosition == null || r.position < byJudge[r.llm].bestPosition!)) {
        byJudge[r.llm].bestPosition = r.position;
      }
    }
  }
  return byJudge;
}

function BarRow({ label, value, variant }: { label: string; value: number; variant: "you" | "competitor" }) {
  return (
    <div className="bar-row">
      <span className="bar-row-label">{label}</span>
      <div className="bar-track">
        <div className={`bar-fill is-${variant}`} style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
      <span className="bar-row-value">{Math.round(value * 100)}%</span>
    </div>
  );
}

function AiVisibilityPageInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";

  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [competitors, setCompetitors] = useState(["", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[] | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/ai-visibility");
      if (res.ok) {
        const { reports } = await res.json();
        setHistory(reports);
      } else {
        setHistory([]);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandName.trim() || !category.trim()) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/dashboard/ai-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          category,
          valueProposition: valueProposition || undefined,
          competitors: competitors.map((c) => c.trim()).filter(Boolean),
          projectId: projectId || undefined,
        }),
      });
      if (!res.ok) {
        const { error: err } = await res.json().catch(() => ({ error: "Failed to generate report." }));
        setError(err);
        return;
      }
      const { report } = await res.json();
      setResult(report);
      setHistory((prev) => [report, ...(prev ?? [])]);
    } finally {
      setSubmitting(false);
    }
  }

  const CAVEAT =
    "This is a simulation. One underlying model answers as four distinct judge personas modeled on ChatGPT, Claude, Perplexity, and Google AI Overviews. It does not query the real ChatGPT, Claude, Perplexity, or Google systems. Treat the score as directional, not as ground truth.";

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>AI Visibility Report</h1>
          <p>A deep-dive AEO comparison against up to 3 named competitors, beyond the single-axis Cre8tive Score.</p>
        </div>
      </div>

      <div className="dash-disclaimer">
        <Radar size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{CAVEAT}</span>
      </div>

      <form className="kanban-new-task-panel" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label htmlFor="vis-brand">Brand name</label>
          <input id="vis-brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Your brand" required />
        </div>
        <div className="field">
          <label htmlFor="vis-category">Category</label>
          <input
            id="vis-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. project management software for small teams"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="vis-vp">Value proposition (optional)</label>
          <textarea id="vis-vp" rows={2} value={valueProposition} onChange={(e) => setValueProposition(e.target.value)} />
        </div>
        <div className="field">
          <label>Competitors (up to 3)</label>
          {competitors.map((c, i) => (
            <input
              key={i}
              value={c}
              onChange={(e) =>
                setCompetitors((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
              }
              placeholder={`Competitor ${i + 1} name`}
              style={{ marginBottom: 6 }}
            />
          ))}
        </div>
        {error && <div className="form-error">{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="submit" className="btn-solid" disabled={submitting}>
            {submitting ? "Running probes…" : "Run report"}
          </button>
        </div>
      </form>

      {result && (
        <div className="content-card">
          <h3>
            {result.brand_name} vs. {result.competitors.length ? result.competitors.join(", ") : "no named competitors"}
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Category: {result.category}</p>

          <div style={{ marginTop: 16 }}>
            <BarRow label={result.brand_name} value={result.own_result.mention_rate} variant="you" />
            {result.competitor_results.map((c) => (
              <BarRow key={c.name} label={c.name} value={c.result?.mention_rate ?? 0} variant="competitor" />
            ))}
          </div>

          <h3 style={{ marginTop: 20 }}>Per-judge breakdown for {result.brand_name}</h3>
          {Object.entries(judgeBreakdown(result.own_result.sample_responses)).map(([judge, stats]) => (
            <p key={judge} style={{ fontSize: 13 }}>
              <strong>{JUDGE_LABELS[judge] ?? judge}:</strong> mentioned in {stats.mentioned}/{stats.total} probes
              {stats.bestPosition != null ? `, best position #${stats.bestPosition}` : ""}
            </p>
          ))}

          <h3 style={{ marginTop: 20 }}>Sample probe questions</h3>
          {result.own_result.sample_responses.slice(0, 5).map((s, i) => (
            <p key={i} style={{ fontSize: 13 }}>
              <strong>&ldquo;{s.probe}&rdquo;</strong> ({JUDGE_LABELS[s.llm] ?? s.llm}): {s.mentioned ? `mentioned, position #${s.position}` : "not mentioned"}
              {s.raw_excerpt ? ` · ${s.raw_excerpt}` : ""}
            </p>
          ))}

          <div className="dash-disclaimer" style={{ marginTop: 16, marginBottom: 0 }}>
            <Radar size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{CAVEAT}</span>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: 32, fontSize: 16 }}>Past reports</h2>
      {history === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
        </div>
      ) : history.length === 0 ? (
        <div className="dash-empty">
          <p>No reports yet. Run one above.</p>
        </div>
      ) : (
        <div className="dash-list">
          {history.map((r) => (
            <div className="dash-row" key={r.id}>
              <div>
                <div className="dash-row-title">
                  {r.brand_name} · {r.category}
                </div>
                <div className="dash-row-sub">
                  {new Date(r.created_at).toLocaleDateString()} · {r.competitors.length} competitor{r.competitors.length === 1 ? "" : "s"}
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.own_result.score}/100</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AiVisibilityPage() {
  // useSearchParams requires a Suspense boundary in the app router, same
  // pattern as src/app/tools/score/page.tsx.
  return (
    <Suspense fallback={null}>
      <AiVisibilityPageInner />
    </Suspense>
  );
}
