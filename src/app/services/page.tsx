import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import { QualifyGrid } from "@/components/marketing/QualifyGrid";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { PrincipalReviewShowcase } from "@/components/marketing/ShowcaseCards";
import { TestimonialStats } from "@/components/marketing/TestimonialStats";
import { ScheduleCallSection } from "@/components/marketing/ScheduleCallSection";
import { Guardrails } from "@/components/marketing/Guardrails";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Services — Blue Diamond Cre8tive",
  description: "AI-native marketing services for busy personal and business brands: content, campaigns, and fractional-CMO strategy, led by our principal.",
};

export default function ServicesPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="SERVICES" />
          <div className="fs-hero-inner">
            <Eyebrow>Services · Principal-led</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["A marketing department,", "without the department."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              This is a done-for-you tier, overseen by a real person, not a self-serve product. Our
              principal accountably owns your strategy and signs off on quality before anything
              ships. Every engagement starts with a short onboarding call, not an instant sign-up.
            </p>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="reveal" style={{ marginBottom: 44 }}>
            <PrincipalBio />
          </div>
          <div className="reveal" style={{ marginBottom: 44 }}>
            <PrincipalReviewShowcase />
          </div>
          <div className="reveal">
            <TestimonialStats />
          </div>
          <div className="text-center reveal" style={{ marginTop: 40 }}>
            <Pill href="/pricing" variant="dark" trailing="arrow">
              See full pricing
            </Pill>
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>How it works</Eyebrow>
            <LineReveal as="h2" lines={["Delivery, not just", "deliverables."]} />
            <p>
              Every tier is fulfilled by the same AI-assisted production pipeline: our principal
              scopes the work, our production team builds it, and our legal counsel reviews anything
              that touches a contract or a claim before it goes out.
            </p>
          </div>
          <div>
            {[
              { step: "01", title: "Discovery", body: "We map your brand, audience, and goals on an onboarding call before a single asset gets made." },
              { step: "02", title: "Production", body: "Copy, design, and campaigns move through our production pipeline on a fixed monthly cadence." },
              { step: "03", title: "Review", body: "Our principal signs off on everything before it ships, with a monthly report showing what moved and why." },
            ].map((item) => (
              <div className="bdc-service-row reveal" key={item.step}>
                <span className="bdc-service-row-index">{item.step}</span>
                <span className="bdc-service-row-title">{item.title}</span>
                <span className="bdc-service-row-desc">{item.body}</span>
                <span className="bdc-service-row-arrow"><ArrowRight size={16} /></span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Before you book a call</Eyebrow>
            <LineReveal as="h2" lines={["Is this actually", "the right fit?"]} />
            <p>
              Services works best for a specific kind of brand. Check the list below before you
              reach out, it saves everyone a call.
            </p>
          </div>
          <QualifyGrid />
          <div className="reveal" style={{ marginTop: 40 }}>
            <Guardrails />
          </div>
        </section>

        <section className="section section-bg-dark reveal" id="schedule-call">
          <ScheduleCallSection />
        </section>
      </>
    </MarketingShell>
  );
}
