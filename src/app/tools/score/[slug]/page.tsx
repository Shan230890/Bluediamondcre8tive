import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { ScoreShareRow } from "@/components/marketing/ScoreShareRow";
import { createAdminClient } from "@/lib/supabase/admin";
import { AXIS_LABELS, AXIS_DESCRIPTIONS, type IdeaAssessment, type ScoreAxes } from "@/lib/score/types";
import "../../../landing-e.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadAssessment(slug: string): Promise<IdeaAssessment | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("idea_assessments")
    .select("*")
    .eq("share_slug", slug)
    .single();
  if (error || !data) return null;
  return data as IdeaAssessment;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await loadAssessment(slug);
  if (!a) return { title: "Cre8tive Score — Blue Diamond Cre8tive" };
  return {
    title: `${a.idea_name} scored ${a.score_overall}/100 on Cre8tive Score`,
    description: a.brutal_truth,
  };
}

function scoreTone(score: number): string {
  if (score >= 70) return "#1a7a3c";
  if (score >= 40) return "var(--dark)";
  return "#b3261e";
}

export default async function ScoreResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await loadAssessment(slug);
  if (!a) notFound();

  const axes: ScoreAxes = {
    originality: a.score_originality,
    technical: a.score_technical,
    geoAeo: a.score_geo_aeo,
    competition: a.score_competition,
    gap: a.score_gap,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bluediamondcre8tive.com";
  const shareUrl = `${appUrl}/tools/score/${a.share_slug}`;

  // Route toward /services when the idea's white space is thin; otherwise
  // toward /signup so people save results / keep scoring.
  const suggestServices = axes.gap < 45 || axes.competition < 35;

  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "48px 24px 24px" }}>
          <div className="fs-hero-inner" style={{ maxWidth: 760 }}>
            <Eyebrow>Cre8tive Score result</Eyebrow>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 14,
              }}
            >
              <h1 className="bdc-hero-h1" style={{ fontSize: "clamp(26px, 4.5vw, 38px)", margin: 0, textAlign: "left" }}>
                {a.idea_name}
              </h1>
              <span style={{ fontSize: 44, fontWeight: 700, color: scoreTone(a.score_overall), lineHeight: 1 }}>
                {a.score_overall}
                <span style={{ fontSize: 18, fontWeight: 500, color: "var(--muted)" }}>/100</span>
              </span>
            </div>
            <p className="lead" style={{ textAlign: "left", margin: "12px 0 0" }}>{a.idea_description}</p>
            {a.idea_url && (
              <a href={a.idea_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13.5, color: "var(--accent)" }}>
                {a.idea_url} ↗
              </a>
            )}
          </div>
        </section>

        <section className="section section-bg-alt">
          <div
            className="card reveal"
            style={{ maxWidth: 720, margin: "0 auto", borderColor: "var(--accent)" }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
              The brutal truth
            </span>
            <p style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginTop: 10 }}>
              &ldquo;{a.brutal_truth}&rdquo;
            </p>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal" style={{ marginBottom: 12 }}>
            <Eyebrow>Breakdown</Eyebrow>
          </div>
          <div className="grid grid-2" style={{ maxWidth: 780, margin: "0 auto" }}>
            {(Object.keys(axes) as Array<keyof ScoreAxes>).map((key) => {
              const ci = a.confidence_intervals?.[key];
              return (
                <div key={key} className="card reveal" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{AXIS_LABELS[key]}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
                      {axes[key]}
                      {ci !== undefined && ci > 0 && (
                        <span style={{ marginLeft: 4, fontSize: 12, fontWeight: 400, color: "var(--muted)" }}>±{ci}</span>
                      )}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{AXIS_DESCRIPTIONS[key]}</p>
                </div>
              );
            })}
          </div>
        </section>

        {(a.originality_evidence || a.geo_aeo_evidence || a.competition_evidence || a.gap_evidence || a.technical_evidence) && (
          <section className="section section-bg-alt">
            <div className="section-head reveal" style={{ marginBottom: 12 }}>
              <Eyebrow>Evidence</Eyebrow>
            </div>
            <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {a.originality_evidence && (
                <div className="card reveal">
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>Originality</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                    {a.originality_evidence.top_matches && a.originality_evidence.top_matches.length > 0
                      ? `Closest match: ${a.originality_evidence.top_matches[0].tool} (${Math.round((a.originality_evidence.top_matches[0].similarity ?? 0) * 100)}% similarity).`
                      : "No close match found in our comparison set."}
                    {a.originality_evidence.source === "deterministic" && (
                      <> Semantic embeddings were unavailable for this run, so this comparison used a lower-fidelity fallback method.</>
                    )}
                  </p>
                </div>
              )}
              {a.geo_aeo_evidence && (
                <div className="card reveal">
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>GEO / AEO (AI-visibility)</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                    {a.geo_aeo_evidence.mention_rate !== undefined
                      ? `Mentioned in ${Math.round(a.geo_aeo_evidence.mention_rate * 100)}% of simulated AI-assistant queries in this category.`
                      : "AI-visibility probe unavailable for this run."}{" "}
                    This is a simulation, one model role-playing how ChatGPT, Claude, Perplexity, and Google AI Overviews might answer, not a live check against their real APIs.
                  </p>
                </div>
              )}
              {a.competition_evidence && (
                <div className="card reveal">
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>Competition</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                    {a.competition_evidence.funded_competitor_count !== undefined
                      ? `${a.competition_evidence.funded_competitor_count} funded competitor(s) detected in this category.${a.competition_evidence.red_ocean ? " This looks like a red ocean." : ""}`
                      : "Competition evidence unavailable."}
                  </p>
                </div>
              )}
              {a.gap_evidence && (
                <div className="card reveal">
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>Gap / White Space</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                    {a.gap_evidence.reasoning || "No detailed reasoning available for this run."}
                  </p>
                </div>
              )}
              {a.technical_evidence && (
                <div className="card reveal">
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>Technical</h3>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 4 }}>
                    {a.technical_evidence.url_probed
                      ? "Your landing page URL was probed successfully for technical signals."
                      : "No URL was probed — this score is based on your description alone."}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section section-bg">
          <div className="card reveal" style={{ maxWidth: 780, margin: "0 auto", fontSize: 12.5, color: "var(--muted)" }}>
            <strong style={{ color: "var(--text-dark)" }}>AI disclaimer.</strong> Artificial intelligence can
            make errors. Always verify with a qualified professional before taking action. See our full{" "}
            <Link href="/disclaimer" style={{ color: "var(--accent)" }}>
              Disclaimer &amp; Indemnity
            </Link>{" "}
            for the terms that apply to every Cre8tive Score result.
          </div>
        </section>

        <section className="section section-bg-dark text-center reveal">
          <h2 className="bdc-hero-h1" style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}>
            {suggestServices ? "Thin white space? Let's find the real gap." : "Want to save this and keep scoring?"}
          </h2>
          <p className="muted-on-dark" style={{ maxWidth: 480, margin: "14px auto 0", fontSize: 14.5 }}>
            {suggestServices
              ? "Our principal-led team can help you find real white space and reposition around it."
              : "Create a free account to save your results and keep your remaining free scores."}
          </p>
          <div className="ctas" style={{ marginTop: 24, justifyContent: "center", display: "flex", gap: 12, flexWrap: "wrap" }}>
            {suggestServices ? (
              <Pill href="/services" variant="light" trailing="arrow">
                Talk to our team
              </Pill>
            ) : (
              <Pill href="/signup" variant="light" trailing="arrow">
                Create a free account
              </Pill>
            )}
            <Pill href="/tools/score" variant="outline">
              Score another idea
            </Pill>
          </div>
        </section>

        <section className="section section-bg-alt text-center">
          <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Think this is fair? Think we&apos;re wrong?</p>
          <div style={{ marginTop: 12 }}>
            <ScoreShareRow toolName={a.idea_name} score={a.score_overall} brutalTruth={a.brutal_truth} shareUrl={shareUrl} />
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", wordBreak: "break-all" }}>{shareUrl}</p>
        </section>
      </>
    </MarketingShell>
  );
}
