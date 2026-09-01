import type { Metadata } from "next";
import { ArrowRight, Trophy, Radar } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LiquidHero } from "@/components/marketing/LiquidHero";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroScoreForm } from "@/components/marketing/HeroScoreForm";
import { StatsPanel } from "@/components/marketing/StatsPanel";
import { PillarGrid } from "@/components/marketing/PillarGrid";
import { TestimonialStats } from "@/components/marketing/TestimonialStats";
import { QualityChecklist } from "@/components/marketing/QualityChecklist";
import {
  ScoreShowcase,
  VaultShowcase,
  AcademyShowcase,
  PrincipalReviewShowcase,
} from "@/components/marketing/ShowcaseCards";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import { LineReveal, WordReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import "./landing-e.css";

export const metadata: Metadata = {
  title: "Blue Diamond Cre8tive — AI-native marketing, tools, and courses",
};

export default function HomePage() {
  return (
    <MarketingShell>
      <>
        <section className="bdc-hero">
          <LiquidHero />
          <div className="bdc-hero-vignette" aria-hidden="true" />
          <span className="bdc-hero-watermark" aria-hidden="true">CRE8TIVE</span>

          <div className="bdc-hero-inner">
            <div>
              <Eyebrow>AI-native marketing, built with finesse</Eyebrow>
              <LineReveal
                as="h1"
                gateOnReady
                className="bdc-hero-h1"
                lines={["Marketing that runs itself,", "built by a team that doesn't", "sleep on your deadlines."]}
              />
              <p className="bdc-hero-lead">
                Blue Diamond Cre8tive is two different ways to work with us: a done-for-you,
                principal-led marketing service, and a self-serve platform of tools and courses.
                Try the platform free below, no sign-up required.
              </p>
              <HeroScoreForm />
              <div className="bdc-hero-ctas">
                <Pill href="/services" variant="dark" trailing="arrow">
                  Explore Services
                </Pill>
                <Pill href="/work" variant="outline">
                  See the work
                </Pill>
              </div>
            </div>

            <div>
              <HeroCarousel />
              <div className="bdc-partner-grid">
                <span className="bdc-partner-chip">Blue Diamond Capital</span>
                <span className="bdc-partner-chip">One Hub Automation</span>
                <span className="bdc-partner-chip">Mauritius-licensed</span>
              </div>
            </div>
          </div>
        </section>

        <div className="bdc-hero-status-bar">
          <span>Working since <strong>2025</strong></span>
          <span>Services, tools, and courses, one account.</span>
          <span className="bdc-scroll-cue">
            Scroll to explore <ArrowRight size={13} />
          </span>
        </div>

        <section className="section section-bg-alt reveal">
          <div className="marquee">
            <div className="marquee-track">
              {[...Array(2)].flatMap((_, i) =>
                [
                  "Content calendars",
                  "Paid campaigns",
                  "Email flows",
                  "Landing pages",
                  "Brand design",
                  "Competitor tracking",
                  "Course templates",
                  "Monthly reporting",
                ].map((item, j) => (
                  <span className="marquee-item" key={`${i}-${j}`}>
                    {item}
                  </span>
                )),
              )}
            </div>
          </div>
        </section>

        {/* ================= SERVICES — dark, agency-pitch treatment ================= */}
        <section className="section bdc-section-services reveal" id="services">
          <div className="section-head reveal">
            <Eyebrow tone="light">Silo 1 — Services</Eyebrow>
            <LineReveal as="h2" lines={["A marketing department,", "without the department."]} />
            <p>
              Done-for-you and led by a real person. Every engagement starts with an onboarding
              call, and every deliverable is reviewed by our principal before it ships.
            </p>
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <PrincipalBio />
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <PillarGrid />
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <PrincipalReviewShowcase />
          </div>

          <div className="reveal">
            <TestimonialStats />
          </div>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/services" variant="light" trailing="arrow">
              See Services tiers
            </Pill>
            <Pill href="/contact" variant="outline">
              Talk to us
            </Pill>
          </div>
        </section>

        <div className="bdc-silo-divider">
          <span className="bdc-silo-divider-label">Two different ways to work with us</span>
        </div>

        {/* ================= PLATFORM — light, self-serve product treatment ================= */}
        <section className="section bdc-section-platform" id="platform">
          <div className="section-head reveal">
            <Eyebrow>Silo 2 &amp; 3 — Platform</Eyebrow>
            <LineReveal as="h2" lines={["Self-serve products.", "Start in minutes."]} />
            <p>
              No onboarding call, no sales conversation. Sign up and get instant access to the
              Competitor Intelligence Vault and the Marketing Academy, or try Cre8tive Score free
              right now.
            </p>
          </div>

          <div className="reveal" style={{ marginBottom: 8 }}>
            <ScoreShowcase />
            <VaultShowcase />
            <AcademyShowcase />
          </div>

          <div className="grid grid-2 reveal" style={{ marginTop: 44, alignItems: "start" }}>
            <QualityChecklist
              title="Every Vault entry, checked before it counts"
              items={[
                { label: "Sourced from a named, dated competitor scan", state: "pass" },
                { label: "Speculative claims flagged, not stated as fact", state: "pass" },
                { label: "Automated scraping (pending legal review)", state: "fail" },
                { label: "Human review of anything you act on commercially", state: "pending" },
              ]}
            />
            <div className="bdc-ink-card">
              <div className="bdc-ink-card-meta">
                <span>Free tool</span>
                <span className="bdc-ink-card-arrow"><ArrowRight size={16} /></span>
              </div>
              <div className="bdc-ink-card-watermark"><Radar size={64} /></div>
              <h3>Not ready to commit to either?</h3>
              <p>Cre8tive Score is free, no account required, and the fastest way to see what our platform can do.</p>
              <div className="bdc-ink-card-tags">
                <TagChip>Free</TagChip>
                <TagChip>30 seconds</TagChip>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 44, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/signup" variant="dark" trailing="arrow">
              Start free
            </Pill>
            <Pill href="/pricing" variant="outline">
              View pricing
            </Pill>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Proof</Eyebrow>
            <LineReveal as="h2" lines={["We hold our own marketing", "to a client's top-tier standard."]} />
          </div>
          <div className="grid grid-2">
            <div className="bdc-ink-card reveal">
              <div className="bdc-ink-card-meta">
                <span>Case study · 2026</span>
                <span className="bdc-ink-card-arrow"><ArrowRight size={16} /></span>
              </div>
              <div className="bdc-ink-card-watermark"><Trophy size={64} /></div>
              <h3>See the results we&apos;ve shipped</h3>
              <p>Every case study on /work was built using the same pipeline and review we run for paying clients.</p>
              <div className="bdc-ink-card-tags">
                <TagChip>Content</TagChip>
                <TagChip>Campaigns</TagChip>
                <TagChip>Vault</TagChip>
              </div>
            </div>
            <div className="bdc-ink-card reveal">
              <div className="bdc-ink-card-meta">
                <span>Cadence · Weekly</span>
                <span className="bdc-ink-card-arrow"><ArrowRight size={16} /></span>
              </div>
              <div className="bdc-ink-card-watermark"><Radar size={64} /></div>
              <h3>Built on our own Vault</h3>
              <p>We run our own competitor tracking on ourselves first. If it&apos;s not good enough for us, it doesn&apos;t ship to clients.</p>
              <div className="bdc-ink-card-tags">
                <TagChip>Positioning</TagChip>
                <TagChip>White space</TagChip>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-bg-dark">
          <StatsPanel />
        </section>

        <section className="section section-bg" style={{ maxWidth: 900 }}>
          <div className="reveal">
            <Eyebrow>The studio</Eyebrow>
            <WordReveal
              text="Blue Diamond Cre8tive exists because most busy brands don't need another vendor, they need one accountable system that plans, builds, and ships the work."
              mutedWords={["another", "vendor,", "they", "need", "one", "accountable", "system", "that", "plans,", "builds,", "and", "ships", "the", "work."]}
              className="bdc-about-statement"
              key="about"
            />
          </div>
        </section>

        <section className="section section-bg-dark reveal text-center">
          <LineReveal as="h2" lines={["Ready to hand off", "your marketing?"]} className="bdc-hero-h1" style={{ fontSize: "clamp(26px, 4vw, 36px)" } as React.CSSProperties} />
          <p className="muted-on-dark" style={{ maxWidth: 480, margin: "16px auto 0", fontSize: 15 }}>
            Tell us about your brand and we&apos;ll come back with a plan, not a sales call.
          </p>
          <div className="ctas" style={{ marginTop: 28, justifyContent: "center", display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/signup" variant="light" trailing="arrow">
              Get started
            </Pill>
            <Pill href="/pricing" variant="outline">
              View pricing
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
