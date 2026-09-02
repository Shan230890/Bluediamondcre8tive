import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { OldWayNewWay } from "@/components/marketing/OldWayNewWay";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import { PaidMediaShowcase } from "@/components/marketing/ShowcaseCards";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "Performance marketing — Blue Diamond Cre8tive",
  description: "Turn ad spend into a real, written plan instead of guesswork. Creative direction and budget planning, tracked on one task board.",
};

export default function PerformanceMarketingPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="PERFORMANCE" />
          <div className="fs-hero-inner">
            <Eyebrow>Use case · Performance marketing</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Turn ad spend into a plan.", "Not a guess."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Most paid budgets get decided in a five-minute meeting off a gut feeling. This use
              case is about having a written creative angle and a recommended budget split per
              channel before a single dollar moves, kept on a task board instead of a slide deck
              nobody opens again.
            </p>
            <div className="ctas">
              <Pill href="/dashboard/projects/new?focus=paid_media" variant="dark" trailing="arrow">
                Start a performance project
              </Pill>
              <Pill href="/signup" variant="outline">
                Sign up free
              </Pill>
            </div>
            <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)", maxWidth: 560 }}>
              This is creative direction and budget planning only. We do not run or manage a
              client&apos;s live ad account, and we never spend on a client&apos;s behalf. Execution
              stays with you or your media buyer.
            </p>
          </div>
        </section>

        <section className="section section-bg">
          <div className="reveal">
            <PaidMediaShowcase />
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Old way vs. our way</Eyebrow>
            <LineReveal as="h2" lines={["Stop rebuilding the plan", "from scratch every quarter."]} />
          </div>
          <div className="reveal">
            <OldWayNewWay />
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>How it works</Eyebrow>
            <LineReveal as="h2" lines={["From brief", "to a channel plan."]} />
          </div>
          <HowItWorks />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["Pick a task,", "your team runs it."]} />
            <p>A sample of the paid media and reporting templates in the library. Sign up to run any of them.</p>
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["Paid media planning", "Reporting & analytics"]} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>Get started</Eyebrow>
          <LineReveal as="h2" lines={["Brief it once,", "get a channel plan back."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            Tell us your goals, industry, and audience. Your team drafts a starter task list
            focused on paid media planning from day one.
          </p>
          <Pill href="/dashboard/projects/new?focus=paid_media" variant="dark" trailing="arrow">
            Start a performance project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
