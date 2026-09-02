/* eslint-disable @next/next/no-img-element -- hero watermark reuses the raw
   brand icon file at giant display size, same as LogoMark's iconOnly path,
   not a next/image-optimizable content image. */
import type { Metadata } from "next";
import { ArrowRight, TrendingUp } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LiquidHero } from "@/components/marketing/LiquidHero";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroScoreForm } from "@/components/marketing/HeroScoreForm";
import { StatsPanel } from "@/components/marketing/StatsPanel";
import { PillarGrid } from "@/components/marketing/PillarGrid";
import { ScoreShowcase, VaultShowcase, TaskBoardShowcase } from "@/components/marketing/ShowcaseCards";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import { DecorativeShapes } from "@/components/marketing/DecorativeShapes";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import { SignalTicker } from "@/components/marketing/SignalTicker";
import "./landing-e.css";

export const metadata: Metadata = {
  title: "Blue Diamond Cre8tive — AI-native marketing, tools, and courses",
};

export default function HomePage() {
  return (
    <MarketingShell>
      <>
        {/* ================= 1. HERO ================= */}
        <section className="bdc-hero">
          <LiquidHero />
          <div className="bdc-hero-vignette" aria-hidden="true" />
          <span className="bdc-hero-watermark" aria-hidden="true">
            CRE
            <img src="/brand/icon-light.svg" alt="" className="bdc-hero-watermark-icon" />
            TIVE
          </span>

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
                principal-led marketing service, and a self-serve Platform where you run the same
                AI marketing team yourself. Try the platform free below, no sign-up required.
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
            </div>
          </div>
        </section>

        {/* ================= 2. LIVE SIGNAL TICKER ================= */}
        <SignalTicker />

        {/* ================= 3. SERVICES — dark, agency-pitch treatment ================= */}
        <section className="section bdc-section-services reveal" id="services">
          <div className="section-head reveal">
            <Eyebrow>Services</Eyebrow>
            <LineReveal as="h2" lines={["A marketing department,", "without the department."]} />
            <p>
              Done-for-you and led by a real person. Every engagement starts with an onboarding
              call, and every deliverable is reviewed by our principal before it ships.
            </p>
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <PrincipalBio />
          </div>

          <div className="reveal">
            <PillarGrid />
          </div>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/services" variant="dark" trailing="arrow">
              See Services tiers
            </Pill>
            <Pill href="/services#schedule-call" variant="outline">
              Talk to us
            </Pill>
          </div>
        </section>

        <div className="bdc-silo-divider">
          <span className="bdc-silo-divider-label">Two different ways to work with us</span>
        </div>

        {/* ================= 4. PLATFORM — light, self-serve product treatment ================= */}
        <section className="section bdc-section-platform" id="platform" style={{ position: "relative" }}>
          <DecorativeShapes corner="tr" />
          <div className="section-head reveal">
            <Eyebrow>Platform</Eyebrow>
            <LineReveal as="h2" lines={["A full marketing team,", "that you run yourself."]} />
            <p>
              No onboarding call, no sales conversation. Sign up and get the same AI-native
              marketing team behind our Services silo, copywriting, design, video, legal, and code,
              now covering SEO and AI-search strategy, paid-media creative and budget planning,
              email lifecycle copy, and signal-based outbound drafts, working for you on a project
              workflow and task board you control. Plus the Competitor Intelligence Vault, a free
              Cre8tive Score, a deeper AI Visibility Report, and execution memory that keeps a
              record of what worked.
            </p>
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <TaskBoardShowcase />
            <ScoreShowcase />
            <VaultShowcase />
          </div>

          <div style={{ marginTop: 44, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/signup" variant="dark" trailing="arrow">
              Start free
            </Pill>
          </div>
        </section>

        {/* ================= 5. PROOF + STATS + FINAL CTA ================= */}
        <section className="section section-bg-dark">
          <StatsPanel />
        </section>

        <section className="section section-bg-alt">
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            <div className="bdc-ink-card reveal">
              <div className="bdc-ink-card-meta">
                <span>Case study · 2026</span>
                <span className="bdc-ink-card-arrow"><ArrowRight size={16} /></span>
              </div>
              <div className="bdc-ink-card-watermark"><TrendingUp size={64} /></div>
              <h3>See the results we&apos;ve shipped</h3>
              <p>Every case study on /work was built using the same pipeline and review we run for paying clients.</p>
              <div className="bdc-ink-card-tags">
                <TagChip>Content</TagChip>
                <TagChip>Campaigns</TagChip>
                <TagChip>Vault</TagChip>
              </div>
              <div style={{ marginTop: 20 }}>
                <Pill href="/work" variant="light" trailing="arrow" className="bdc-full-width">
                  See the work
                </Pill>
              </div>
            </div>
            <div className="reveal text-center">
              <LineReveal as="h2" lines={["Ready to hand off", "your marketing?"]} />
              <p style={{ maxWidth: 420, margin: "16px auto 0", fontSize: 15, color: "var(--body-c)" }}>
                Tell us about your brand and we&apos;ll come back with a plan, not a sales call.
              </p>
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <Pill href="/signup" variant="dark" trailing="arrow">
                  Get started
                </Pill>
                <Pill href="/pricing" variant="outline">
                  View pricing
                </Pill>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER (unchanged, new lockup applied there) ================= */}
      </>
    </MarketingShell>
  );
}
