import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { PainProductRows } from "@/components/marketing/PainProductRows";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "For growth engineers — Blue Diamond Cre8tive",
  description: "A real home for schema, tracking, and technical AEO readiness work, instead of it falling on whoever's free.",
};

const PAIN_ROWS = [
  {
    pain: "Structured data, tracking implementation, and technical AEO readiness don't belong to marketing or engineering, so they fall on whoever has time.",
    product: "A task assigned to your web/app team member covers exactly this kind of work, on the same board as everything else in the project.",
  },
  {
    pain: "Getting a page ready for an AI assistant to actually cite it takes more than good copy, it takes structure the model can parse.",
    product: "A structured-data plan task specifies which schema markup a page needs and what data populates it, written for search and AI-answer readability.",
  },
  {
    pain: "A performance or bug problem gets reported, but there's no clear owner or plan before someone starts changing code.",
    product: "A bug triage task lays out the likely cause and a fix plan before any code changes, so the work starts with a plan, not a guess.",
  },
  {
    pain: "Technical requests get buried in a chat thread instead of tracked like the rest of the marketing team's work.",
    product: "Technical tasks sit on the same kanban board as copy, design, and campaign tasks, tracked from open to done the same way.",
  },
];

export default function GrowthEngineersPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="ENGINEERS" />
          <div className="fs-hero-inner">
            <Eyebrow>For · Growth engineers</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Technical marketing work", "finally has a home."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Schema, tracking, and technical AEO readiness aren&apos;t quite marketing and aren&apos;t quite
              engineering, so they land on whoever&apos;s free. Putting that work on the same task board
              as everything else gives it an owner and a place to track it through to done.
            </p>
            <div className="ctas">
              <Pill href="/dashboard/projects/new?focus=web_app" variant="dark" trailing="arrow">
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
            <LineReveal as="h2" lines={["What's actually", "falling through the cracks."]} />
          </div>
          <PainProductRows rows={PAIN_ROWS} />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["A few templates", "built for this."]} />
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["Web & app", "SEO & AEO strategy"]} limit={4} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>What changes</Eyebrow>
          <LineReveal as="h2" lines={["Technical work gets tracked,", "not lost in a side channel."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            Schema, tracking, and readiness work moves through the same board, with the same
            visibility, as the rest of the project.
          </p>
          <Pill href="/dashboard/projects/new?focus=web_app" variant="dark" trailing="arrow">
            Start a project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
