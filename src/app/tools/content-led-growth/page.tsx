import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { OldWayNewWay } from "@/components/marketing/OldWayNewWay";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import { VisibilityShowcase } from "@/components/marketing/ShowcaseCards";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "Content-led growth — Blue Diamond Cre8tive",
  description: "Own your category's search and AI-answer visibility with a task board built for compounding content work, not another chat tab.",
};

export default function ContentLedGrowthPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="CONTENT" />
          <div className="fs-hero-inner">
            <Eyebrow>Use case · Content-led growth</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Own your category's search,", "and its AI answers too."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Ranking on Google is half the job now. The other half is being the answer ChatGPT,
              Claude, and Perplexity actually cite. Content-led growth means building a body of
              content deliberate enough to win both, tracked on one board instead of scattered
              across docs and old chat threads.
            </p>
            <div className="ctas">
              <Pill href="/dashboard/projects/new?focus=seo_content" variant="dark" trailing="arrow">
                Start a content project
              </Pill>
              <Pill href="/signup" variant="outline">
                Sign up free
              </Pill>
            </div>
          </div>
        </section>

        <section className="section section-bg">
          <div className="reveal">
            <VisibilityShowcase />
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Old way vs. our way</Eyebrow>
            <LineReveal as="h2" lines={["Stop losing content decisions", "to old chat history."]} />
          </div>
          <div className="reveal">
            <OldWayNewWay />
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>How it works</Eyebrow>
            <LineReveal as="h2" lines={["From brief", "to a content engine."]} />
          </div>
          <HowItWorks />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["Pick a task,", "your team runs it."]} />
            <p>A sample of the content and SEO/AEO templates in the library. Sign up to run any of them, or write your own from scratch.</p>
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["SEO & AEO strategy", "Content & copywriting"]} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>Get started</Eyebrow>
          <LineReveal as="h2" lines={["Brief it once,", "let your team build the content engine."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            Tell us your goals, industry, and audience. Your team drafts a starter task list
            focused on content and search from day one.
          </p>
          <Pill href="/dashboard/projects/new?focus=seo_content" variant="dark" trailing="arrow">
            Start a content project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
