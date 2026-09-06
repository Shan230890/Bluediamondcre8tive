import type { Metadata } from "next";
import { LayoutTemplate, Users } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { RoadmapFlow } from "@/components/marketing/RoadmapFlow";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Roadmap — Blue Diamond Cre8tive",
  description: "How the Blue Diamond Cre8tive Platform actually works, from a brief to a task board to a growing record of finished work.",
};

/**
 * Static, public conceptual page — same real 4-step flow already shipped in
 * src/components/marketing/HowItWorks.tsx (Brief -> AI drafts starter tasks
 * -> Task board -> Execution memory), same copy for every visitor, no
 * per-account progress tracker. Adapted from Opsara's /roadmap pattern:
 * a plain page explaining how the whole system fits together, not an
 * onboarding checklist.
 */
const STEPS = [
  {
    num: "01",
    title: "Brief",
    short: "Tell your team what you're trying to do, once.",
    body: "You tell your team what you're trying to do once: your goals, your industry, and who you're trying to reach, plus which channels you care about. That single brief becomes a project, and everything that follows works from it. Starting from a Template is the fastest way in, pick a ready-made brief close to what you need and adjust it instead of writing from a blank page.",
  },
  {
    num: "02",
    title: "AI drafts starter tasks",
    short: "Your team turns the brief into a real task list.",
    body: "Your six-person AI team reads the brief and turns it into a starter task list, ready to assign. Nothing ships from this step alone, it's a first draft of the work worth doing, scoped to your actual goals and audience rather than a generic checklist.",
  },
  {
    num: "03",
    title: "Task board",
    short: "Each task gets assigned to the right specialist.",
    body: "Each task moves across a kanban board from open to done. You assign a task to whichever specialist fits it, a Chief Marketing Officer, a Legal Representative, a Copywriter, a Graphic Designer, a Video Editor & Podcast Producer, or an App Designer, Web Builder & Coder, and that specialist does the work and posts a reply for you to review before you close it out.",
  },
  {
    num: "04",
    title: "Execution memory",
    short: "Every closed task compounds into the next brief.",
    body: "Every task you close, whether it's done or dismissed, keeps its result and any note you add about the outcome. The next brief you write builds on that record instead of starting from zero, so your team's context compounds project over project instead of resetting every time.",
  },
];

export default function RoadmapPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="ROADMAP" />
          <div className="fs-hero-inner">
            <Eyebrow>How it works</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["The real workflow,", "start to finish."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              No fictional pipeline, no invented tool names. This is the actual four-step flow the
              Platform runs on, the same one built into the product itself.
            </p>
          </div>
        </section>

        <section className="section section-bg">
          <RoadmapFlow steps={STEPS} />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Two shortcuts worth knowing</Eyebrow>
            <LineReveal as="h2" lines={["Skip the blank page,", "and know who's working."]} />
          </div>
          <div className="grid grid-2">
            <div className="card reveal">
              <span className="icon-badge" aria-hidden="true">
                <LayoutTemplate size={20} />
              </span>
              <h3>Templates shortcut step one</h3>
              <p>
                Instead of writing a brief from scratch, the template library holds ready-made task
                briefs across ten categories, from SEO strategy to outbound messaging to legal
                drafting. Pick one close to what you need, adjust it, and it drops straight into your
                task board.
              </p>
            </div>
            <div className="card reveal">
              <span className="icon-badge" aria-hidden="true">
                <Users size={20} />
              </span>
              <h3>A real team does step three</h3>
              <p>
                Step three isn&apos;t one generic assistant. It&apos;s a team of specialists, each scoped to a
                real function: marketing strategy, legal review, copywriting, graphic design, video
                and podcast production, and web/app building. You assign the right specialist to the
                right task, and review their work before it counts as done.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-bg text-center">
          <div className="reveal" style={{ maxWidth: 560, margin: "0 auto" }}>
            <LineReveal as="h2" lines={["That's the whole loop."]} />
            <p style={{ marginBottom: 28 }}>
              Brief once, get a starter task list, work it on the board, and keep the record of what
              happened. Every project after the first one builds on that record.
            </p>
            <Pill href="/signup" variant="dark" trailing="arrow">
              Start your first project
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
