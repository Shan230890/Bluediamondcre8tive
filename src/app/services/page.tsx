import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Services — Blue Diamond Cre8tive",
  description: "AI-native marketing services for busy personal and business brands: content, campaigns, and fractional-CMO strategy, led by our principal.",
};

const tiers = [
  {
    name: "Starter",
    price: "$697–$997",
    period: "/mo",
    includes: [
      "Monthly social content calendar",
      "Copywriting for every post",
      "Design for every post",
      "Monthly performance report",
    ],
    cta: "Get started",
  },
  {
    name: "Growth",
    price: "$1,997–$2,997",
    period: "/mo",
    featured: true,
    badge: "Most popular",
    includes: [
      "Everything in Starter",
      "Paid and organic campaigns",
      "Email marketing flows",
      "Landing page builds",
      "Quarterly strategy session",
    ],
    cta: "Get started",
  },
  {
    name: "Signature",
    price: "$5,000+",
    period: "/mo",
    note: "Limited seats",
    includes: [
      "Fractional-CMO engagement",
      "Full team output across every channel",
      "Priority turnaround on every request",
      "Direct access to our principal",
    ],
    cta: "Apply for a seat",
  },
];

export default function ServicesPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <div className="hero-bg" aria-hidden="true">
            <span className="glow" />
          </div>
          <div className="fs-hero-inner">
            <Eyebrow>Silo 1 — Services · Principal-led</Eyebrow>
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
          <div className="grid grid-3">
            {tiers.map((tier) => (
              <div className={`price-card reveal ${tier.featured ? "featured" : ""}`} key={tier.name}>
                {tier.badge && <span className="badge">{tier.badge}</span>}
                <span className="tier-name">{tier.name}</span>
                <div className="tier-price">
                  {tier.price}
                  <span>{tier.period}</span>
                </div>
                {tier.note && <div className="tier-note">{tier.note}</div>}
                <ul>
                  {tier.includes.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Pill href="/contact" variant={tier.featured ? "dark" : "outline"} className="bdc-full-width">
                  {tier.cta}
                </Pill>
              </div>
            ))}
          </div>
          <p className="payments-note text-center" style={{ display: "flex", margin: "28px auto 0", justifyContent: "center" }}>
            Payments launching soon. Inquiries route to our team for now.
          </p>
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

        <section className="section section-bg-dark reveal text-center">
          <LineReveal as="h2" lines={["Not sure which tier fits?"]} style={{ fontSize: "clamp(24px, 4vw, 32px)" } as React.CSSProperties} />
          <p className="muted-on-dark" style={{ maxWidth: 460, margin: "14px auto 0", fontSize: 15 }}>
            Tell us about your brand and we&apos;ll recommend a starting point, no obligation.
          </p>
          <div className="ctas" style={{ marginTop: 24, justifyContent: "center", display: "flex" }}>
            <Pill href="/contact" variant="light" trailing="arrow">
              Talk to us
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
