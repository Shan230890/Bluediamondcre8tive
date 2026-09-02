import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { OldWayNewWay } from "@/components/marketing/OldWayNewWay";
import { TemplateTeasers } from "@/components/marketing/TemplateTeasers";
import { OutboundDraftsShowcase } from "@/components/marketing/ShowcaseCards";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "Outbound automation — Blue Diamond Cre8tive",
  description: "Reach buyers before they start searching. Drafted cold email and LinkedIn messaging, ready for you to personalize and send.",
};

export default function OutboundAutomationPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="OUTBOUND" />
          <div className="fs-hero-inner">
            <Eyebrow>Use case · Outbound automation</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Reach buyers", "before they start searching."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Inbound only reaches people already looking. Outbound automation is about having a
              standing set of cold email and LinkedIn message drafts ready for a described ICP, so
              your team can personalize and send the moment there&apos;s a reason to reach out,
              instead of writing from a blank page every time.
            </p>
            <div className="ctas">
              <Pill href="/dashboard/projects/new?focus=outbound" variant="dark" trailing="arrow">
                Start an outbound project
              </Pill>
              <Pill href="/signup" variant="outline">
                Sign up free
              </Pill>
            </div>
            <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)", maxWidth: 560 }}>
              This is message drafting only. We do not source real contact data, scrape prospects,
              or send anything on a client&apos;s behalf. You bring the list and hit send.
            </p>
          </div>
        </section>

        <section className="section section-bg">
          <div className="reveal">
            <OutboundDraftsShowcase />
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Old way vs. our way</Eyebrow>
            <LineReveal as="h2" lines={["Stop rewriting the same cold email", "for every new list."]} />
          </div>
          <div className="reveal">
            <OldWayNewWay />
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>How it works</Eyebrow>
            <LineReveal as="h2" lines={["From brief", "to outreach drafts."]} />
          </div>
          <HowItWorks />
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Start from a template</Eyebrow>
            <LineReveal as="h2" lines={["Pick a task,", "your team runs it."]} />
            <p>A sample of the outbound and lifecycle email templates in the library. Sign up to run any of them.</p>
          </div>
          <div className="reveal">
            <TemplateTeasers categories={["Signal-based outbound", "Email & lifecycle"]} />
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Eyebrow>Get started</Eyebrow>
          <LineReveal as="h2" lines={["Brief it once,", "get outreach drafts back."]} />
          <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
            Tell us your goals, industry, and audience. Your team drafts a starter task list
            focused on outbound messaging from day one.
          </p>
          <Pill href="/dashboard/projects/new?focus=outbound" variant="dark" trailing="arrow">
            Start an outbound project
          </Pill>
        </section>
      </>
    </MarketingShell>
  );
}
