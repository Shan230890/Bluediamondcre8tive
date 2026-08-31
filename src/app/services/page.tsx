import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Services — Blue Diamond Cre8tive",
  description: "AI-native marketing services for busy personal and business brands: content, campaigns, and fractional-CMO strategy.",
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
      "Direct access to your strategy lead",
    ],
    cta: "Apply for a seat",
  },
];

export default function ServicesPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
        <div className="hero-bg" aria-hidden="true">
          <span className="glow" />
        </div>
        <div className="fs-hero-inner">
          <span className="mono-tag">Silo 1 — Services</span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
            A marketing department, without the department.
          </h1>
          <p className="lead">
            Content, campaigns, and strategy delivered on a subscription. You get the output of a
            full marketing team, backed by a real strategy lead and reviewed by our legal counsel
            before anything ships.
          </p>
        </div>
      </section>

      <section className="section section-bg-alt">
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
              <Link href="/contact" className={tier.featured ? "btn-solid" : "btn-outline"}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="payments-note text-center" style={{ display: "flex", margin: "28px auto 0", justifyContent: "center" }}>
          Payments launching soon. Inquiries route to our team for now.
        </p>
      </section>

      <section className="section section-bg">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>Delivery, not just deliverables</h2>
          <p>
            Every tier is fulfilled by the same AI-assisted production pipeline: a strategy lead
            scopes the work, our production team builds it, and our legal counsel reviews anything
            that touches a contract or a claim before it goes out.
          </p>
        </div>
        <div className="grid grid-3">
          {[
            { step: "01", title: "Discovery", body: "We map your brand, audience, and goals before a single asset gets made." },
            { step: "02", title: "Production", body: "Copy, design, and campaigns move through our production pipeline on a fixed monthly cadence." },
            { step: "03", title: "Review", body: "You see everything before it ships, with a monthly report showing what moved and why." },
          ].map((item) => (
            <div className="card reveal" key={item.step}>
              <span className="mono-tag">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-bg-dark reveal text-center">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>Not sure which tier fits?</h2>
        <p className="muted-on-dark" style={{ maxWidth: 460, margin: "14px auto 0", fontSize: 15 }}>
          Tell us about your brand and we&apos;ll recommend a starting point, no obligation.
        </p>
        <div className="ctas" style={{ marginTop: 24 }}>
          <Link href="/contact" className="btn-solid">
            Talk to us <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
