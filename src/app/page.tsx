import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Radar, GraduationCap, Trophy, ArrowRight, Check, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LiquidHero } from "@/components/marketing/LiquidHero";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { StatsPanel } from "@/components/marketing/StatsPanel";
import { LineReveal, WordReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow, TagChip } from "@/components/marketing/Pill";
import "./landing-e.css";

export const metadata: Metadata = {
  title: "Blue Diamond Cre8tive — AI-native marketing, tools, and courses",
};

const serviceSilo = {
  icon: Megaphone,
  title: "Marketing services",
  body: "A full marketing team's output, led by our principal and delivered on a subscription, for busy brands who don't have time to run their own department.",
  href: "/services",
  cta: "See services",
  tags: ["Onboarding call", "Principal-reviewed"],
};

const platformSilos = [
  {
    icon: Radar,
    title: "Competitor Intelligence Vault",
    body: "Track competitors' pricing, positioning, and content moves on a weekly cadence, with a monthly white-space review that tells you where to move next.",
    href: "/tools",
    cta: "See the Vault",
    tags: ["Instant access", "Self-serve"],
  },
  {
    icon: GraduationCap,
    title: "Marketing Academy",
    body: "Courses, templates, and cohorts that teach the exact playbooks we use for clients, for founders who'd rather learn the system than outsource it.",
    href: "/academy",
    cta: "Browse Academy",
    tags: ["Instant access", "Self-serve"],
  },
];

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
                Blue Diamond Cre8tive combines a done-for-you, principal-led marketing service with a
                self-serve competitor intelligence tool and academy, so busy brands get the output
                without hiring an in-house department.
              </p>
              <div className="bdc-hero-proof">
                <Sparkles size={15} color="var(--accent)" />
                <span><strong>Every</strong> Services deliverable is reviewed by our principal before it ships.</span>
              </div>
              <div className="bdc-hero-ctas">
                <Pill href="/signup" variant="dark" trailing="arrow">
                  Get started
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

        <section className="section section-bg">
          <div className="section-head reveal">
            <Eyebrow>What we do</Eyebrow>
            <LineReveal as="h2" lines={["Services, or a platform.", "You choose."]} />
            <p>
              Silo 1 is done-for-you and led by a real person. Silos 2 and 3 are self-serve products
              you can start using in minutes. Most clients start with one and grow into more than one
              as the results compound.
            </p>
          </div>

          <div className="bdc-silo-group">
            <div className="bdc-silo-group-head">
              <h3>Services — principal-led</h3>
              <span className="bdc-silo-group-note">Done-for-you. Onboarding call required before work begins.</span>
            </div>
            <div className="card reveal" style={{ border: "none", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
              <div className="icon-badge" style={{ marginBottom: 0 }}>
                <serviceSilo.icon size={22} />
              </div>
              <div>
                <h3>{serviceSilo.title}</h3>
                <p>{serviceSilo.body}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {serviceSilo.tags.map((t) => (
                    <TagChip key={t}>{t}</TagChip>
                  ))}
                </div>
              </div>
              <Link
                href={serviceSilo.href}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap" }}
              >
                {serviceSilo.cta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bdc-silo-group">
            <div className="bdc-silo-group-head">
              <h3>Platform — self-serve</h3>
              <span className="bdc-silo-group-note">Sign up and get instant access. No onboarding call.</span>
            </div>
            <div className="grid grid-2">
              {platformSilos.map((silo) => (
                <div className="card reveal" key={silo.title}>
                  <div className="icon-badge">
                    <silo.icon size={22} />
                  </div>
                  <h3>{silo.title}</h3>
                  <p>{silo.body}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {silo.tags.map((t) => (
                      <TagChip key={t}>{t}</TagChip>
                    ))}
                  </div>
                  <Link
                    href={silo.href}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 13.5, fontWeight: 600, color: "var(--accent)" }}
                  >
                    {silo.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Why it works</Eyebrow>
            <LineReveal as="h2" lines={["A real team,", "an AI-native process."]} />
          </div>
          <div className="grid grid-3">
            {[
              {
                title: "Principal led, not template led",
                body: "Every Services engagement starts with our principal mapping your brand and market before a single asset gets made.",
              },
              {
                title: "Production at AI speed",
                body: "Copy, design, and video move through an AI-assisted production pipeline, reviewed by our team before it ever reaches you.",
              },
              {
                title: "Legally sound, always",
                body: "Every contract, disclosure, and data practice is reviewed by our legal counsel before it ships. No shortcuts on compliance.",
              },
            ].map((item) => (
              <div className="card reveal" key={item.title}>
                <div className="icon-badge">
                  <Check size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-bg">
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
              <h3>See the results we've shipped</h3>
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
              <p>We run our own competitor tracking on ourselves first. If it's not good enough for us, it doesn't ship to clients.</p>
              <div className="bdc-ink-card-tags">
                <TagChip>Positioning</TagChip>
                <TagChip>White space</TagChip>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-bg-alt">
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
