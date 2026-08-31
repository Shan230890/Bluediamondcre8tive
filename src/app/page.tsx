import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Radar, GraduationCap, Trophy, ArrowRight, Check } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TiltCard } from "@/components/motion/TiltCard";
import "./landing-e.css";

export const metadata: Metadata = {
  title: "Blue Diamond Cre8tive — AI-native marketing, tools, and courses",
};

const silos = [
  {
    icon: Megaphone,
    title: "AI-native marketing services",
    body: "A full marketing team's output, delivered on a subscription, for busy personal and business brands who don't have time to run their own.",
    href: "/services",
    cta: "See services",
  },
  {
    icon: Radar,
    title: "Competitor Intelligence Vault",
    body: "Track competitors' pricing, positioning, and content moves on a weekly cadence, with a monthly white-space review that tells you where to move next.",
    href: "/tools",
    cta: "See the Vault",
  },
  {
    icon: GraduationCap,
    title: "Marketing Academy",
    body: "Courses, templates, and cohorts that teach the exact playbooks we use for clients, for founders who'd rather learn the system than outsource it.",
    href: "/academy",
    cta: "Browse Academy",
  },
  {
    icon: Trophy,
    title: "Our own results",
    body: "We hold our own marketing to the same standard as a paying client's top-tier deliverable. See the work.",
    href: "/work",
    cta: "See the work",
  },
];

export default function HomePage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="glow" />
        </div>
        <div className="fs-hero-inner">
          <h1>
            Marketing that runs itself, built by a team that doesn&apos;t sleep on your deadlines.
          </h1>
          <p className="lead">
            Blue Diamond Cre8tive combines a done-for-you AI-native marketing team, a competitor
            intelligence tool, and a self-serve academy, so busy brands get the output without
            hiring an in-house department.
          </p>
          <div className="ctas">
            <Link href="/signup" className="btn-solid">
              Get started <ArrowRight size={16} />
            </Link>
            <Link href="/work" className="btn-outline">
              See the work
            </Link>
          </div>
        </div>
      </section>

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
          <span className="eyebrow">What we do</span>
          <h2>Four ways to move faster</h2>
          <p>
            Pick the silo that fits where you are today. Most clients start with one and grow
            into more than one as the results compound.
          </p>
        </div>
        <div className="grid grid-2">
          {silos.map((silo, i) => (
            <TiltCard key={silo.title} tilt={i % 2 === 0 ? "sm-left" : "sm-right"} className="reveal">
              <div className="card" style={{ border: "none" }}>
                <div className="icon-badge">
                  <silo.icon size={22} />
                </div>
                <h3>{silo.title}</h3>
                <p>{silo.body}</p>
                <Link
                  href={silo.href}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 13.5, fontWeight: 600, color: "var(--accent)" }}
                >
                  {silo.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="section-head reveal">
          <span className="eyebrow">Why it works</span>
          <h2>A real team, an AI-native process</h2>
        </div>
        <div className="grid grid-3">
          {[
            {
              title: "Strategy led, not template led",
              body: "Every engagement starts with a strategy lead mapping your brand and market before a single asset gets made.",
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

      <section className="section section-bg-dark reveal text-center">
        <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)" }}>Ready to hand off your marketing?</h2>
        <p className="muted-on-dark" style={{ maxWidth: 480, margin: "16px auto 0", fontSize: 15 }}>
          Tell us about your brand and we&apos;ll come back with a plan, not a sales call.
        </p>
        <div className="ctas" style={{ marginTop: 28 }}>
          <Link href="/signup" className="btn-solid">
            Get started <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" className="btn-outline">
            View pricing
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
