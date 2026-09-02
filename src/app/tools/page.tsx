import type { Metadata } from "next";
import { Radar, Target, ListTodo } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { ChannelGrid } from "@/components/marketing/ChannelGrid";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Platform — Blue Diamond Cre8tive",
  description: "A self-serve AI marketing team you run yourself: a task board, agents for copy, design, video, legal, and code, the Competitor Intelligence Vault, and a free Cre8tive Score.",
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="PLATFORM" />
          <div className="fs-hero-inner">
            <Eyebrow>Platform · Self-serve</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["An AI marketing team,", "that you run yourself."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              This is a self-serve product, not a chat window. Sign up and get a task board backed
              by the same AI marketing team behind our Services silo, agents for copy, design,
              video, legal review, and code, plus the Competitor Intelligence Vault and a free
              Cre8tive Score. No onboarding call, instant access.
            </p>
            <div className="ctas">
              <Pill href="/signup" variant="dark" trailing="arrow">
                Start free
              </Pill>
              <Pill href="/tools/vault" variant="outline">
                See a Vault preview
              </Pill>
            </div>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>What&apos;s included</Eyebrow>
            <LineReveal as="h2" lines={["One account,", "four capabilities."]} />
          </div>
          <div className="reveal">
            <ChannelGrid />
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <ListTodo size={22} />
            </div>
            <div>
              <h3>Task board</h3>
              <p>
                Assign real marketing work to your AI team and track it from open to done on a
                kanban board. Every agent drafts a reply for you to review, or let a task auto-run
                straight through.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <TagChip>Copy, design, video, legal, code</TagChip>
                <TagChip>Auto-run available</TagChip>
              </div>
            </div>
            <Pill href="/dashboard/tasks" variant="dark" trailing="arrow">
              Open the task board
            </Pill>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Free tool</Eyebrow>
            <LineReveal as="h2" lines={["Not ready to sign up?", "Start with a free score."]} />
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
            See Platform pricing
          </Pill>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Competitor Intelligence Vault</Eyebrow>
            <LineReveal as="h2" lines={["Know what your competitors moved", "before your next planning meeting."]} />
            <p>
              The Vault logs a weekly scan of pricing, positioning, and content moves, then rolls
              each month into a white-space review that tells you where the gap is. Two jobs, run
              every month.
            </p>
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
