"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { useReducedMotion } from "@/components/marketing/useReducedMotion";
import { ChartShowcase } from "@/components/marketing/ChartShowcase";
import "../../landing-e.css";

const VISITOR_KEY = "bdc_score_visitor_id";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

type ScoreResult = {
  shareSlug: string;
};

type ApiError = {
  error?: string;
  upgrade?: boolean;
  ctaHref?: string;
};

const LOADING_STEPS = [
  "Mapping your category and value proposition…",
  "Checking originality against known AI tools…",
  "Simulating how AI assistants would recommend you…",
  "Scoring technical feasibility and white space…",
  "Still working, some scores just take longer…",
];

function ScoreFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    // localStorage is only readable client-side; this is a legitimate
    // client-only sync, not something a lazy initializer can do safely.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitorId(getOrCreateVisitorId());

    // Deep-link prefill from the homepage hero's lightweight capture (see
    // HeroScoreForm) — those two fields only, nothing else in the schema.
    const prefillName = searchParams.get("name");
    const prefillDescription = searchParams.get("description");
    if (prefillName) setName(prefillName.slice(0, 80));
    if (prefillDescription) setDescription(prefillDescription.slice(0, 2000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setLoadingStep(i), i * 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  async function scoreOnce() {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, competitors, url, visitorId, email }),
    });

    if (res.status === 402) {
      setLimitReached(true);
      return null;
    }

    if (!res.ok) {
      const body: ApiError = await res.json().catch(() => ({}));
      throw new Error(body.error || `Score failed (${res.status})`);
    }

    const result: ScoreResult = await res.json();
    return result;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLimitReached(false);
    setLoadingStep(0);

    // Ollama Cloud latency varies enough that the pipeline occasionally
    // times out even though it would have succeeded on a plain retry -- one
    // silent retry before surfacing an error to the visitor avoids punishing
    // them for infrastructure variance rather than a real failure.
    const MAX_ATTEMPTS = 2;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await scoreOnce();
        if (result) {
          router.push(`/tools/score/${result.shareSlug}`);
        } else {
          setLoading(false);
        }
        return;
      } catch (err: unknown) {
        if (attempt < MAX_ATTEMPTS) continue;
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setLoading(false);
      }
    }
  }

  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 32px" }}>
          <div className="fs-hero-inner">
            <Eyebrow>Free tool · Cre8tive Score</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["How good is your idea,", "honestly?"]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Submit an idea, product, or tool and get an honest 0-100 score across originality,
              technical feasibility, AI-visibility, competition, and white space. Three free scores,
              no credit card, no sales call.
            </p>
          </div>
        </section>

        <section className="section section-bg">
          <div className="reveal">
            <ChartShowcase />
          </div>
        </section>

        <section className="section section-bg-alt">
          {loading ? (
            <div
              className="form-shell reveal"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "56px 30px" }}
            >
              <div
                aria-hidden="true"
                className="bdc-score-spinner"
                style={reducedMotion ? { animation: "none" } : undefined}
              />
              <p style={{ marginTop: 24, fontWeight: 600, fontSize: 15 }}>
                {LOADING_STEPS[loadingStep]}
              </p>
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", maxWidth: 380 }}>
                We run your submission through five analysis stages. This usually takes 15-30
                seconds.
              </p>
            </div>
          ) : limitReached ? (
            <div className="form-shell reveal" style={{ textAlign: "center", padding: "48px 30px" }}>
              <h2 style={{ fontSize: 20, marginBottom: 10 }}>You&apos;ve used your 3 free scores</h2>
              <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
                Create a free account to keep scoring ideas and save your results.
              </p>
              <Pill href="/signup" variant="dark" trailing="arrow">
                Create a free account
              </Pill>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="form-shell reveal">
              <div className="field">
                <label htmlFor="email">Your email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  Used to track your free credits. We never spam.
                </p>
              </div>

              <div className="field">
                <label htmlFor="name">Idea / tool name</label>
                <input
                  id="name"
                  placeholder="e.g. Cre8tive Score"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={80}
                />
              </div>

              <div className="field">
                <label htmlFor="description">What does it do? (be specific)</label>
                <textarea
                  id="description"
                  style={{ minHeight: 140 }}
                  placeholder="e.g. Free AI-powered idea scorer for founders, checks originality against known tools, simulates whether AI assistants would recommend it, and flags the competitive white space."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  maxLength={2000}
                />
                <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  {description.length} / 2000 — be specific, the AI reads every word.
                </p>
              </div>

              <div className="field">
                <label htmlFor="url">URL (optional)</label>
                <input
                  id="url"
                  type="url"
                  placeholder="https://"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  We probe your landing page for technical signals.
                </p>
              </div>

              <div className="field">
                <label htmlFor="competitors">Known competitors (comma-separated, optional)</label>
                <input
                  id="competitors"
                  placeholder="e.g. Competitor A, Competitor B"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
                <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  Helps us map your category. We&apos;ll also flag competitors you didn&apos;t list.
                </p>
              </div>

              {error && <p className="form-error">Couldn&apos;t score that. {error}</p>}

              <Pill type="submit" variant="dark" trailing="arrow">
                Get my score
              </Pill>

              <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                By submitting you agree this is your own idea or you have permission to score it.
                See our{" "}
                <a href="/disclaimer" style={{ color: "var(--accent)" }}>
                  AI disclaimer
                </a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "var(--accent)" }}>
                  privacy policy
                </a>
                .
              </p>
            </form>
          )}
        </section>
      </>
    </MarketingShell>
  );
}

export default function ScorePage() {
  // useSearchParams requires a Suspense boundary in the app router; the
  // form itself has no meaningful "loading" state before params resolve,
  // so an empty fallback avoids a layout flash.
  return (
    <Suspense fallback={null}>
      <ScoreFormInner />
    </Suspense>
  );
}
