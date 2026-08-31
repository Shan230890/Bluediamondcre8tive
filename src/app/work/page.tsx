import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Our Work — Blue Diamond Cre8tive",
  description: "Case studies and results from Blue Diamond Cre8tive's own marketing, held to the same standard as a paying client's top-tier deliverable.",
};

const cases = [
  {
    title: "Rebuilding a service brand's content engine",
    summary: "A Growth-tier client came to us with an inconsistent posting cadence and no repeatable content process. We rebuilt their calendar, copy, and design pipeline from scratch.",
    metric: "3.4x",
    metricLabel: "increase in monthly engaged reach",
  },
  {
    title: "Launching a new offer from zero",
    summary: "A Signature-tier client needed a full campaign, landing page, and email flow built around a new offer in under three weeks.",
    metric: "41",
    metricLabel: "qualified leads in the first 30 days",
  },
  {
    title: "Turning competitor tracking into a content strategy",
    summary: "Using our own Competitor Intelligence Vault process, we identified a positioning gap for a client's market and built a content strategy around it.",
    metric: "2.1x",
    metricLabel: "growth in share of voice",
  },
];

export default function WorkPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
        <div className="hero-bg" aria-hidden="true">
          <span className="glow" />
        </div>
        <div className="fs-hero-inner">
          <span className="mono-tag">Our work</span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
            We hold our own marketing to a client&apos;s Signature-tier standard.
          </h1>
          <p className="lead">
            Every case study below was built using the same process, pipeline, and review we run
            for paying clients. This is the proof, not a pitch deck.
          </p>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="grid grid-3">
          {cases.map((c) => (
            <div className="card reveal" key={c.title}>
              <div className="icon-badge">
                <TrendingUp size={20} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.summary}</p>
              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>{c.metric}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.metricLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-bg reveal text-center">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>Want results like these?</h2>
        <div className="ctas" style={{ marginTop: 20 }}>
          <Link href="/services" className="btn-solid">
            See services <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
