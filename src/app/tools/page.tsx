import type { Metadata } from "next";
import { Radar, Target } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Competitor Intelligence Vault — Blue Diamond Cre8tive",
  description: "Track competitor pricing, positioning, and content moves on a weekly cadence, with a monthly white-space review. Self-serve, instant access.",
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="TOOLS" />
          <div className="fs-hero-inner">
            <Eyebrow>Tools · Self-serve platform</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Know what your competitors moved", "before your next planning meeting."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              This is a self-serve platform product. Sign up and get instant access, no onboarding
              call required. The Competitor Intelligence Vault logs a weekly scan of pricing,
              positioning, and content moves, then rolls each month into a white-space review that
              tells you where the gap is.
            </p>
            <div className="ctas">
              <Pill href="/tools/vault" variant="outline" trailing="arrow">
                See a preview
              </Pill>
            </div>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Free tool</Eyebrow>
            <LineReveal as="h2" lines={["Not ready for the Vault?", "Start with a free score."]} />
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <Target size={22} />
            </div>
            <div>
              <h3>Cre8tive Score</h3>
              <p>
                Submit your idea or tool and get an honest 0-100 score across originality, technical
                feasibility, AI-visibility (will ChatGPT and Claude recommend you), competition, and
                white space, in about 30 seconds. No account required.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <TagChip>Free</TagChip>
                <TagChip>3 lifetime scores</TagChip>
              </div>
            </div>
            <Pill href="/tools/score" variant="dark" trailing="arrow">
              Score my idea
            </Pill>
          </div>
        </section>

        <section className="section section-bg-alt text-center reveal">
          <Pill href="/pricing" variant="dark" trailing="arrow">
            See Vault pricing
          </Pill>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Cadence</Eyebrow>
            <LineReveal as="h2" lines={["Two jobs, run", "every month."]} />
          </div>
          <div className="grid grid-2">
            <div className="card reveal">
              <div className="icon-badge">
                <Radar size={20} />
              </div>
              <h3>Weekly scan</h3>
              <p>
                A lightweight log of competitor pricing, positioning, and content changes, entered
                every week so nothing sits stale.
              </p>
            </div>
            <div className="card reveal">
              <div className="icon-badge">
                <Radar size={20} />
              </div>
              <h3>Monthly review</h3>
              <p>
                The month&apos;s scans roll up into a white-space analysis: where competitors are
                clustered, and where the open ground is for your next move.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 32, fontSize: 13, color: "var(--muted)", maxWidth: 640, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            Entries are currently sourced from manual, internal research rather than automated
            scraping, while we complete a legal review of target sites&apos; terms of service.
            Automated collection is a planned backend change once that review clears.
          </p>
        </section>
      </>
    </MarketingShell>
  );
}
