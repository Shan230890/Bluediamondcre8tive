import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { PainProductRows } from "@/components/marketing/PainProductRows";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "For growth managers — Blue Diamond Cre8tive",
  description: "One task board and one team across every channel, instead of a different tool and a different tab for each one.",
};

const PAIN_ROWS = [
  {
    pain: "You're running SEO, paid, email, and social at once, each in a different tool with its own login and its own half-finished doc.",
    product: "One project holds the brief. Every channel's work becomes a task on the same board, not a separate system to check.",
  },
  {
    pain: "There's no single place that shows what's been tried already, so the same idea gets re-tested every few months.",
    product: "Execution Memory keeps a record of every closed task and what it taught you, across every project, so past work isn't lost.",
  },
  {
    pain: "Reporting on what actually moved the needle means pulling numbers from four places and writing the summary yourself.",
    product: "Assign a reporting task to your CMO agent and get a written performance summary back, not a spreadsheet you still have to interpret.",
  },
  {
    pain: "Handing off work to a specialist, whether that's copy, design, or legal review, means a whole new briefing conversation.",
    product: "The task board carries the context. Assign a task to the right team member and they already have the project brief.",
  },
];

export default function GrowthManagersPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="MANAGERS" />
          <div className="fs-hero-inner">
            <Eyebrow>For · Growth managers</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Every channel,", "one board."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              You&apos;re not short on channels to run, you&apos;re short on a single place that shows what&apos;s
              been tried, what worked, and what&apos;s still open. That&apos;s what a shared project and task
              board actually solves.
            </p>
            <div className="ctas">
              <Pill href="/dashboard/projects/new" variant="dark" trailing="arrow">
                Start a project
              </Pill>
              <Pill href="/dashboard/templates" variant="outline">
                Browse templates
              </Pill>
            </div>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>The day-to-day</Eyebrow>
            <LineReveal as="h2" lines={["What's actually eating", "your week."]} />
          </div>
          <PainProductRows rows={PAIN_ROWS} />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["A few templates", "built for this."]} />
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["Reporting & analytics", "SEO & AEO strategy", "Paid media planning"]} limit={3} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>What changes</Eyebrow>
          <LineReveal as="h2" lines={["Less time reassembling context.", "More time deciding what's next."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            One project brief, one task board, and a record of what already happened. The channels
            don&apos;t shrink, but the overhead of tracking them does.
          </p>
          <Pill href="/dashboard/projects/new" variant="dark" trailing="arrow">
            Start a project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
