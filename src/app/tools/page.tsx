import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Radar } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Competitor Intelligence Vault — Blue Diamond Cre8tive",
  description: "Track competitor pricing, positioning, and content moves on a weekly cadence, with a monthly white-space review.",
};

const tiers = [
  { name: "Starter", price: "$49", period: "/mo", includes: ["1 competitor tracked", "Weekly scan entries", "Email summary"] },
  { name: "Pro", price: "$99", period: "/mo", featured: true, badge: "Most popular", includes: ["5 competitors tracked", "Weekly scan entries", "Change alerts", "Monthly white-space review"] },
  { name: "Agency", price: "$249", period: "/mo", includes: ["Unlimited competitors", "Weekly scan entries", "Change alerts", "Monthly white-space review", "White-label report export"] },
];

export default function ToolsPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
        <div className="hero-bg" aria-hidden="true">
          <span className="glow" />
        </div>
        <div className="fs-hero-inner">
          <span className="mono-tag">Silo 2 — Tools</span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
            Know what your competitors moved before your next planning meeting.
          </h1>
          <p className="lead">
            The Competitor Intelligence Vault logs a weekly scan of pricing, positioning, and
            content moves, then rolls each month into a white-space review that tells you where the
            gap is.
          </p>
          <div className="ctas">
            <Link href="/tools/vault" className="btn-outline">
              See a preview <ArrowRight size={16} />
            </Link>
          </div>
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
              <ul>
                {tier.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={tier.featured ? "btn-solid" : "btn-outline"}>
                Get started
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
          <span className="eyebrow">Cadence</span>
          <h2>Two jobs, run every month</h2>
        </div>
        <div className="grid grid-2">
          <div className="card reveal">
            <div className="icon-badge">
              <Radar size={20} />
            </div>
            <h3>Weekly scan</h3>
            <p>
              A lightweight log of competitor pricing, positioning, and content changes, entered
              every week so nothing sits stale.
            </p>
          </div>
          <div className="card reveal">
            <div className="icon-badge">
              <Radar size={20} />
            </div>
            <h3>Monthly review</h3>
            <p>
              The month&apos;s scans roll up into a white-space analysis: where competitors are
              clustered, and where the open ground is for your next move.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 32, fontSize: 13, color: "var(--muted)", maxWidth: 640, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          Entries are currently sourced from manual, internal research rather than automated
          scraping, while we complete a legal review of target sites&apos; terms of service.
          Automated collection is a planned backend change once that review clears.
        </p>
      </section>

      <LandingFooter />
    </div>
  );
}
