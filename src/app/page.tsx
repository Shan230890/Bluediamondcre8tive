import type { Metadata } from "next";
import { ArrowRight, TrendingUp, Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LiquidHero } from "@/components/marketing/LiquidHero";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroScoreForm } from "@/components/marketing/HeroScoreForm";
import { StatsPanel } from "@/components/marketing/StatsPanel";
import { PillarGrid } from "@/components/marketing/PillarGrid";
import { QualityChecklist } from "@/components/marketing/QualityChecklist";
import { ScoreShowcase, VaultShowcase } from "@/components/marketing/ShowcaseCards";
import { PrincipalBio } from "@/components/marketing/PrincipalBio";
import { DecorativeShapes } from "@/components/marketing/DecorativeShapes";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import { SignalTicker } from "@/components/marketing/SignalTicker";
import { ChannelGrid } from "@/components/marketing/ChannelGrid";
import { ChartShowcase } from "@/components/marketing/ChartShowcase";
import { GalleryScroll } from "@/components/marketing/GalleryScroll";
import { QueuePanel } from "@/components/marketing/QueuePanel";
import { Guardrails } from "@/components/marketing/Guardrails";
import { TestimonialStats } from "@/components/marketing/TestimonialStats";
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
                principal-led marketing service, and a self-serve platform of tools. Try the
                platform free below, no sign-up required.
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

        {/* ================= 2b. THIN STATUS + MARQUEE STRIP ================= */}
        <div className="section-bg-alt reveal">
          <div className="bdc-hero-status-bar" style={{ maxWidth: 1120, padding: "16px 24px" }}>
            <span>Working since <strong>2025</strong></span>
            <div className="marquee" style={{ flex: "1 1 320px", minWidth: 0 }}>
              <div className="marquee-track">
                {[...Array(2)].flatMap((_, i) =>
                  [
                    "Content calendars",
                    "Paid campaigns",
                    "Email flows",
                    "Landing pages",
                    "Brand design",
                    "Competitor tracking",
                    "Monthly reporting",
                  ].map((item, j) => (
                    <span className="marquee-item" key={`${i}-${j}`}>
                      {item}
                    </span>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. SERVICES — dark, agency-pitch treatment ================= */}
        <section className="section bdc-section-services reveal" id="services">
          <div className="section-head reveal">
            <Eyebrow tone="light">Services</Eyebrow>
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
            <Pill href="/services" variant="light" trailing="arrow">
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
            <LineReveal as="h2" lines={["Self-serve products.", "Start in minutes."]} />
            <p>
              No onboarding call, no sales conversation. Sign up and get instant access to the
              Competitor Intelligence Vault, or try Cre8tive Score free right now.
            </p>
          </div>

          <div className="reveal" style={{ marginBottom: 44 }}>
            <ScoreShowcase />
            <VaultShowcase />
          </div>

          <div className="reveal" style={{ maxWidth: 420, margin: "0 auto" }}>
            <QualityChecklist
              title="Every Vault entry, checked before it counts"
              items={[
                { label: "Sourced from a named, dated competitor scan", state: "pass" },
                { label: "Speculative claims flagged, not stated as fact", state: "pass" },
                { label: "Automated scraping (pending legal review)", state: "fail" },
                { label: "Human review of anything you act on commercially", state: "pending" },
              ]}
            />
          </div>

          <div style={{ marginTop: 44, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/signup" variant="dark" trailing="arrow">
              Start free
            </Pill>
          </div>
        </section>

        {/* ================= 5. CHANNEL COVERAGE ================= */}
        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Full coverage</Eyebrow>
            <LineReveal as="h2" lines={["Every channel worth", "being deliberate about."]} />
            <p>Services and Platform draw from the same channel skillset, whether our principal is running it or you are.</p>
          </div>
          <div className="reveal">
            <ChannelGrid />
          </div>
        </section>

        {/* ================= 6. CRE8TIVE SCORE CHART ================= */}
        <section className="section section-bg">
          <div className="reveal">
            <ChartShowcase />
          </div>
        </section>

        {/* ================= 7. HORIZONTAL GALLERY ================= */}
        <section className="section section-bg-alt" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="section-head reveal" style={{ padding: "0 24px" }}>
            <h2>Drafted from something real, not a blank prompt.</h2>
            <p>Every item in your review queue traces back to an actual source.</p>
          </div>
          <div className="reveal">
            <GalleryScroll />
          </div>
        </section>

        {/* ================= 8. APPROVAL QUEUE ================= */}
        <section className="section section-bg">
          <div className="section-head reveal">
            <h2>What&apos;s waiting on you right now.</h2>
          </div>
          <div className="reveal">
            <QueuePanel />
          </div>
        </section>

        {/* ================= 9. GUARDRAILS ================= */}
        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <h2>Nothing reaches you without a check first.</h2>
          </div>
          <div className="reveal">
            <Guardrails />
          </div>
        </section>

        {/* ================= 10. TESTIMONIAL + STATS ================= */}
        <section className="section section-bg">
          <div className="reveal">
            <TestimonialStats />
          </div>
        </section>

        {/* ================= 11. PROOF + STATS + FINAL CTA ================= */}
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

        {/* ================= 12. PRICING STRIP TEASER ================= */}
        <section className="section section-bg text-center">
          <div className="section-head reveal">
            <Eyebrow>Pricing</Eyebrow>
            <LineReveal as="h2" lines={["Two ways in,", "one account."]} />
          </div>
          <div className="grid grid-3 reveal" style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="price-card">
              <span className="tier-name">Starter</span>
              <div className="tier-price" style={{ fontSize: 20 }}>$697&ndash;$997/mo</div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                <Check size={13} style={{ verticalAlign: -2, marginRight: 4, color: "var(--accent)" }} />
                Content calendar, copy, design
              </p>
            </div>
            <div className="price-card featured">
              <span className="tier-name">Growth</span>
              <div className="tier-price" style={{ fontSize: 20 }}>$1,997&ndash;$2,997/mo</div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                <Check size={13} style={{ verticalAlign: -2, marginRight: 4, color: "var(--accent)" }} />
                Campaigns, Reddit, digital PR
              </p>
            </div>
            <div className="price-card">
              <span className="tier-name">Vault Pro</span>
              <div className="tier-price" style={{ fontSize: 20 }}>$99/mo</div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                <Check size={13} style={{ verticalAlign: -2, marginRight: 4, color: "var(--accent)" }} />
                5 competitors tracked
              </p>
            </div>
          </div>
          <div style={{ marginTop: 28 }} className="reveal">
            <Pill href="/pricing" variant="dark" trailing="arrow">
              See full pricing
            </Pill>
          </div>
        </section>

        {/* ================= 13. FOOTER (unchanged, new lockup applied there) ================= */}
      </>
    </MarketingShell>
  );
}
