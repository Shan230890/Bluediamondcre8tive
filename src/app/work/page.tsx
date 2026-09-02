import type { Metadata } from "next";
import { TrendingUp, ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { GalleryScroll } from "@/components/marketing/GalleryScroll";
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
    tags: ["Content", "Design"],
  },
  {
    title: "Launching a new offer from zero",
    summary: "A Signature-tier client needed a full campaign, landing page, and email flow built around a new offer in under three weeks.",
    metric: "41",
    metricLabel: "qualified leads in the first 30 days",
    tags: ["Campaigns", "Email"],
  },
  {
    title: "Turning competitor tracking into a content strategy",
    summary: "Using our own Competitor Intelligence Vault process, we identified a positioning gap for a client's market and built a content strategy around it.",
    metric: "2.1x",
    metricLabel: "growth in share of voice",
    tags: ["Vault", "Strategy"],
  },
];

export default function WorkPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
          <SectionBackground watermark="WORK" />
          <div className="fs-hero-inner">
            <Eyebrow>Our work</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["We hold our own marketing", "to a client's Signature-tier standard."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Every case study below was built using the same process, pipeline, and review we run
              for paying clients, signed off by our principal. This is the proof, not a pitch deck.
            </p>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="grid grid-3">
            {cases.map((c) => (
              <div className="bdc-ink-card reveal" key={c.title}>
                <div className="bdc-ink-card-meta">
                  <span>Case study</span>
                  <span className="bdc-ink-card-arrow"><ArrowRight size={16} /></span>
                </div>
                <div className="bdc-ink-card-watermark"><TrendingUp size={56} /></div>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>{c.metric}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>{c.metricLabel}</div>
                </div>
                <div className="bdc-ink-card-tags">
                  {c.tags.map((t) => (
                    <TagChip key={t}>{t}</TagChip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-bg" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="section-head reveal" style={{ padding: "0 24px" }}>
            <h2>Drafted from something real, not a blank prompt.</h2>
            <p>A sample of the review queue behind the work above.</p>
          </div>
          <div className="reveal">
            <GalleryScroll />
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="reveal">
            <PrincipalBio />
          </div>
        </section>

        <section className="section section-bg reveal text-center">
          <LineReveal as="h2" lines={["Want results like these?"]} style={{ fontSize: "clamp(24px, 4vw, 32px)" } as React.CSSProperties} />
          <div className="ctas" style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <Pill href="/services" variant="dark" trailing="arrow">
              See services
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
