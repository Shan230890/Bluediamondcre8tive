import type { Metadata } from "next";
import { Radar, Target, ListTodo, Megaphone, Send, History, FolderKanban } from "lucide-react";
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

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Projects</Eyebrow>
            <LineReveal as="h2" lines={["Brief it once,", "your team drafts the tasks."]} />
            <p>Create a project from a brief, get a starter task list back, then work it on the same task board, through discovery, active, review, and complete.</p>
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <FolderKanban size={22} />
            </div>
            <div>
              <h3>Projects</h3>
              <p>Goals, industry, audience, and channels of interest in, a first task list assigned to the right team member out.</p>
            </div>
            <Pill href="/dashboard/projects" variant="dark" trailing="arrow">
              Open projects
            </Pill>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Deeper AEO</Eyebrow>
            <LineReveal as="h2" lines={["Cre8tive Score is a snapshot.", "AI Visibility Report is the deep dive."]} />
            <p>
              Cre8tive Score gives your idea one number across 5 axes, including a quick AI-visibility
              check. The AI Visibility Report goes further: it runs the same probe-based simulation
              against your named competitors and shows the comparison, per simulated engine, with
              sample questions. Both are honestly labeled as simulations, not live queries against the
              real ChatGPT, Claude, Perplexity, or Google systems.
            </p>
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <Radar size={22} />
            </div>
            <div>
              <h3>AI Visibility Report</h3>
              <p>Compare how often AI assistants mention your brand against up to 3 named competitors.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <TagChip>Simulation, clearly labeled</TagChip>
                <TagChip>3 reports per day</TagChip>
              </div>
            </div>
            <Pill href="/dashboard/ai-visibility" variant="dark" trailing="arrow">
              Run a report
            </Pill>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Paid media</Eyebrow>
            <LineReveal as="h2" lines={["Creative and budget planning.", "Not ad-account management."]} />
            <p>
              Your CMO agent drafts a channel-by-channel creative angle and recommended budget split
              for a goal you give it. You, or your media buyer, run the accounts. We never spend on
              your behalf.
            </p>
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <Megaphone size={22} />
            </div>
            <div>
              <h3>Paid Media Plan</h3>
              <p>Recommended budget split, creative angle, and audience notes per channel.</p>
            </div>
            <Pill href="/dashboard/paid-media-plan" variant="dark" trailing="arrow">
              Generate a plan
            </Pill>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Outbound</Eyebrow>
            <LineReveal as="h2" lines={["Signal-based messaging drafts.", "Not a contact database."]} />
            <p>
              Describe your ICP and your copywriter agent drafts cold email and LinkedIn opener
              templates with placeholder tokens for you to personalize. We don&apos;t source real
              contact data, scrape prospects, or send anything on your behalf.
            </p>
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <Send size={22} />
            </div>
            <div>
              <h3>Outbound Drafts</h3>
              <p>Cold email and LinkedIn opener templates, drafted from a described ICP.</p>
            </div>
            <Pill href="/dashboard/outbound" variant="dark" trailing="arrow">
              Draft messaging
            </Pill>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>Compounding history</Eyebrow>
            <LineReveal as="h2" lines={["What worked, kept.", "Not lost in an old chat."]} />
            <p>Every closed task keeps its result and what you learned from it, a running record across every project so decisions compound instead of resetting.</p>
          </div>
          <div className="card reveal" style={{ maxWidth: 720, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
            <div className="icon-badge" style={{ marginBottom: 0 }}>
              <History size={22} />
            </div>
            <div>
              <h3>Execution Memory</h3>
              <p>A chronological record of closed work and what it taught you, across every project.</p>
            </div>
            <Pill href="/dashboard/memory" variant="dark" trailing="arrow">
              View memory
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
