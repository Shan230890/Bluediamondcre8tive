import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { PainProductRows } from "@/components/marketing/PainProductRows";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "For founders — Blue Diamond Cre8tive",
  description: "A full marketing team's worth of output without a full marketing team, run through one task board.",
};

const PAIN_ROWS = [
  {
    pain: "Marketing needs to happen, but you don't have the time to be the one writing it, designing it, and shipping it.",
    product: "Six team members cover copy, design, video, legal review, code, and CMO-level strategy. Assign a task and get a first draft back.",
  },
  {
    pain: "Hiring a full team before revenue justifies it is a real financial risk, but doing nothing means falling behind on content and outreach.",
    product: "One project brief turns into a starter task list across the channels you care about, without a single new hire.",
  },
  {
    pain: "You don't have the bandwidth to review every piece of legal risk in a contract, a landing page claim, or a piece of outbound copy.",
    product: "Legal review sits in the same task board as everything else. Assign a task to your legal team member before something risky ships.",
  },
  {
    pain: "You want to know what's been tried before green-lighting the same idea again.",
    product: "Execution Memory keeps a running record of closed tasks and outcomes, so you're not repeating a test that already failed.",
  },
];

export default function FoundersPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="FOUNDERS" />
          <div className="fs-hero-inner">
            <Eyebrow>For · Founders</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["A team's worth of output.", "No team to hire."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              You know marketing needs to happen. You don&apos;t have the hours, and hiring a full team
              before the revenue is there is a bet you&apos;re not ready to make. A project brief and a
              task board, backed by a team covering copy, design, video, legal, and code, closes
              that gap without a single new hire.
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
            <LineReveal as="h2" lines={["What's actually", "in the way."]} />
          </div>
          <PainProductRows rows={PAIN_ROWS} />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["A few templates", "built for this."]} />
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["Content & copywriting", "Brand & design", "Web & app"]} limit={3} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>What changes</Eyebrow>
          <LineReveal as="h2" lines={["Marketing keeps moving,", "without becoming your full-time job."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            You still make the calls. You stop being the one who has to write, design, and ship
            every piece of it yourself.
          </p>
          <Pill href="/dashboard/projects/new" variant="dark" trailing="arrow">
            Start a project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
