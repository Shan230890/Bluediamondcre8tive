import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { DecorativeShapes } from "@/components/marketing/DecorativeShapes";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Guardrails } from "@/components/marketing/Guardrails";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Pricing — Blue Diamond Cre8tive",
  description: "All Blue Diamond Cre8tive pricing in one place: principal-led marketing services, and the self-serve Platform.",
};

const FAQ_ENTRIES = [
  {
    question: "What happens after I sign up?",
    answer:
      "For Services, we start with a short onboarding call to map your brand, audience, and goals before any asset gets made. For the Platform, you get instant access as soon as you sign up, no call required.",
  },
  {
    question: "How does billing and cancellation work?",
    answer: (
      <>
        Services are billed monthly, and the Platform renews on the cycle you pick at sign-up. You can
        cancel either at any time. Full terms are in our{" "}
        <Link href="/refund-cancellation">Refund &amp; Cancellation policy</Link>.
      </>
    ),
  },
  {
    question: "What's included at each tier?",
    answer:
      "Every tier's full feature list is in the comparison table above, Starter through Signature for Services, and Starter through Agency for the Platform. Reach out if you're not sure which one fits.",
  },
  {
    question: "Can I switch between Services and the Platform?",
    answer:
      "Yes. They run on separate billing since they're different products, so you can run one, both, or move between them as your needs change.",
  },
  {
    question: "Is the Academy available?",
    answer:
      "The Academy is paused, not gone. We pulled it while we focus on Services and the Platform. Reach out through our contact page and we'll notify you when it reopens.",
  },
  {
    question: "What if I'm not ready to commit to either?",
    answer: (
      <>
        Start with <Link href="/tools/score">Cre8tive Score</Link>, a free idea and positioning
        scorer with no account required. It&apos;s the fastest way to see what our platform can do.
      </>
    ),
  },
];

type Tier = {
  name: string;
  price: string;
  pitch: string;
  audience: string;
  includes: string[];
  details: string[];
  featured?: boolean;
  cta: string;
  ctaHref: string;
  trust: string;
};

const serviceTiers: Tier[] = [
  {
    name: "Starter",
    price: "$697–$997/mo",
    pitch: "Consistent content and design, on a monthly cadence.",
    audience: "For a brand that needs a steady drumbeat of content without hiring in-house.",
    includes: ["Content calendar, copy & design", "Monthly performance report"],
    details: [
      "Onboarding call to map brand, audience, and goals",
      "Copywriting for social, email, and web",
      "Brand-consistent design assets each month",
      "A monthly report showing what shipped and why",
    ],
    cta: "Talk to us",
    ctaHref: "/services#schedule-call",
    trust: "We'll follow up personally, no card required yet.",
  },
  {
    name: "Growth",
    price: "$1,997–$2,997/mo",
    pitch: "Full campaigns and distribution beyond search.",
    audience: "For a brand ready to run real campaigns, not just keep the calendar full.",
    includes: [
      "Everything in Starter",
      "Campaigns, email flows & landing pages",
      "Reddit & digital PR",
      "Quarterly strategy session",
    ],
    details: [
      "Everything in Starter",
      "Full campaign builds: creative, copy, and landing pages",
      "Email flow design and lifecycle copy",
      "Reddit and digital PR distribution",
      "A quarterly strategy session with our principal",
    ],
    featured: true,
    cta: "Talk to us",
    ctaHref: "/services#schedule-call",
    trust: "We'll follow up personally, no card required yet.",
  },
  {
    name: "Signature",
    price: "$5,000+/mo",
    pitch: "A fractional CMO, not a freelancer roster.",
    audience: "For a brand that wants one accountable principal owning strategy end to end.",
    includes: [
      "Fractional-CMO engagement",
      "Full production team output",
      "Executive thought leadership",
      "Priority turnaround",
    ],
    details: [
      "Everything in Growth",
      "A fractional-CMO engagement, strategy owned end to end",
      "Full production team output across every channel",
      "Founder-facing executive thought leadership",
      "Priority turnaround on every deliverable",
      "Limited seats",
    ],
    cta: "Talk to us",
    ctaHref: "/services#schedule-call",
    trust: "We'll follow up personally, no card required yet.",
  },
];

const platformTiers: Tier[] = [
  {
    name: "Starter",
    price: "$49/mo",
    pitch: "Your full AI marketing team, with one competitor tracked.",
    audience: "For a solo founder or small team dipping into competitor tracking for the first time.",
    includes: ["AI task board + your full AI team", "1 competitor tracked"],
    details: [
      "Task board across copy, design, video, legal review, and code",
      "Projects: brief once, get a starter task list back",
      "Cre8tive Score and the AI Visibility Report",
      "Paid Media Plan and Outbound Drafts",
      "Execution Memory across every project",
      "Competitor Intelligence Vault, 1 competitor tracked",
    ],
    cta: "Start free",
    ctaHref: "/signup",
    trust: "Free to start, no card required.",
  },
  {
    name: "Pro",
    price: "$99/mo",
    pitch: "Everything in Starter, with real competitive coverage.",
    audience: "For a team that wants a weekly read on more than one competitor.",
    includes: ["AI task board + your full AI team", "5 competitors tracked", "Weekly scan alerts"],
    details: [
      "Everything in Starter",
      "Competitor Intelligence Vault, 5 competitors tracked",
      "Weekly scan alerts on competitor moves",
    ],
    featured: true,
    cta: "Start free",
    ctaHref: "/signup",
    trust: "Free to start, no card required.",
  },
  {
    name: "Agency",
    price: "$249/mo",
    pitch: "Unlimited competitor tracking, ready to hand to clients.",
    audience: "For an agency or larger team running the Vault across many accounts.",
    includes: ["AI task board + your full AI team", "Unlimited competitors", "White-label export"],
    details: [
      "Everything in Pro",
      "Unlimited competitors tracked in the Vault",
      "White-label export for client-facing reports",
    ],
    cta: "Start free",
    ctaHref: "/signup",
    trust: "Free to start, no card required.",
  },
];

const servicesComparison: { feature: string; values: [boolean, boolean, boolean] }[] = [
  { feature: "Content calendar, copy & design", values: [true, true, true] },
  { feature: "Monthly performance report", values: [true, true, true] },
  { feature: "Campaigns, email flows & landing pages", values: [false, true, true] },
  { feature: "Reddit & digital PR", values: [false, true, true] },
  { feature: "Quarterly strategy session", values: [false, true, true] },
  { feature: "Fractional-CMO engagement", values: [false, false, true] },
  { feature: "Full production team output", values: [false, false, true] },
  { feature: "Executive thought leadership", values: [false, false, true] },
  { feature: "Priority turnaround", values: [false, false, true] },
];

const platformComparison: { feature: string; values: [string, string, string] | [boolean, boolean, boolean] }[] = [
  { feature: "CMO strategy agent", values: [true, true, true] },
  { feature: "Copywriting agent", values: [true, true, true] },
  { feature: "Graphic design agent", values: [true, true, true] },
  { feature: "Video & podcast production agent", values: [true, true, true] },
  { feature: "Legal review agent", values: [true, true, true] },
  { feature: "App, web & code agent", values: [true, true, true] },
  { feature: "Task board", values: [true, true, true] },
  { feature: "Projects", values: [true, true, true] },
  { feature: "Cre8tive Score", values: [true, true, true] },
  { feature: "AI Visibility Report", values: [true, true, true] },
  { feature: "Paid Media Plan", values: [true, true, true] },
  { feature: "Outbound Drafts", values: [true, true, true] },
  { feature: "Execution Memory", values: [true, true, true] },
  { feature: "Templates", values: [true, true, true] },
  { feature: "Competitor Intelligence Vault", values: ["1 competitor", "5 competitors", "Unlimited"] },
  { feature: "Weekly scan alerts", values: [false, true, true] },
  { feature: "White-label export", values: [false, false, true] },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <td className="bdc-compare-cell">{value}</td>;
  }
  return (
    <td className="bdc-compare-cell">
      {value ? (
        <Check size={16} className="bdc-compare-yes" aria-label="Included" />
      ) : (
        <span className="bdc-compare-no" aria-label="Not included">
          —
        </span>
      )}
    </td>
  );
}

function ComparisonTable({
  title,
  tierNames,
  rows,
}: {
  title: string;
  tierNames: [string, string, string];
  rows: { feature: string; values: [boolean, boolean, boolean] | [string, string, string] }[];
}) {
  return (
    <div className="bdc-compare-block">
      <h3 className="bdc-compare-title">{title}</h3>
      <div className="bdc-compare-wrap">
        <table className="bdc-compare-table">
          <thead>
            <tr>
              <th className="bdc-compare-feature-head">Feature</th>
              {tierNames.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td className="bdc-compare-feature">{row.feature}</td>
                {row.values.map((v, i) => (
                  <ComparisonCell key={`${row.feature}-${i}`} value={v} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div className={`price-card bdc-price-card-rich reveal ${tier.featured ? "featured" : ""}`}>
      {tier.featured && <span className="badge">Most popular</span>}
      <span className="tier-name">{tier.name}</span>
      <div className="tier-price" style={{ fontSize: 26 }}>{tier.price}</div>
      <p className="bdc-tier-pitch">{tier.pitch}</p>
      <p className="bdc-tier-audience">{tier.audience}</p>
      <Pill href={tier.ctaHref} variant={tier.featured ? "dark" : "outline"} className="bdc-full-width">
        {tier.cta}
      </Pill>
      <p className="bdc-tier-trust">{tier.trust}</p>
      <ul className="bdc-tier-includes">
        {tier.includes.map((item) => (
          <li key={item}>
            <Check size={16} />
            {item}
          </li>
        ))}
      </ul>
      <div className="bdc-tier-details">
        <span className="bdc-tier-details-label">Full details</span>
        <ul>
          {tier.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 32px" }}>
          <SectionBackground watermark="PRICING" />
          <div className="fs-hero-inner">
            <span className="payments-note" style={{ marginTop: 0, marginBottom: 18 }}>
              Two ways to work with us
            </span>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Simple, transparent pricing."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">
              Services are principal-led and done-for-you, billed monthly. The Platform is a
              self-serve product you run yourself, no onboarding call needed.
            </p>
            <p style={{ marginTop: 12, fontSize: 13.5, color: "var(--muted)" }}>
              Every deliverable, on either side, is reviewed before it ships.
            </p>
          </div>
        </section>

        <section className="section bdc-section-services">
          <div className="bdc-silo-group-head" style={{ marginBottom: 22 }}>
            <Eyebrow>Services — principal-led</Eyebrow>
            <span className="bdc-silo-group-note">Done-for-you. Onboarding call required.</span>
          </div>
          <div className="grid grid-3">
            {serviceTiers.map((tier) => (
              <TierCard tier={tier} key={tier.name} />
            ))}
          </div>
        </section>

        <div className="bdc-silo-divider">
          <span className="bdc-silo-divider-label">Two different ways to work with us</span>
        </div>

        <section className="section bdc-section-platform">
          <div className="section-head reveal" style={{ marginBottom: 12 }}>
            <Eyebrow>Platform — self-serve</Eyebrow>
            <LineReveal as="h2" lines={["Every tier includes the full", "AI marketing team."]} />
            <p>
              Every Platform tier below includes the task board and full AI team, copy, design,
              video, legal review, and code, on top of the Vault access it&apos;s billed for. No
              onboarding call needed. Not ready to commit yet?{" "}
              <Link href="/tools/score" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Cre8tive Score
              </Link>{" "}
              is a free idea and positioning scorer, no account required, and the fastest way to see
              what our platform can do.
            </p>
          </div>
          <div className="grid grid-3">
            {platformTiers.map((tier) => (
              <TierCard tier={tier} key={tier.name} />
            ))}
          </div>
        </section>

        <section className="section section-bg text-center">
          <span className="payments-note">Payments launching soon. Every CTA above routes to our team for now.</span>
        </section>

        <section className="section section-bg-alt">
          <div className="section-head reveal">
            <Eyebrow>Compare tiers</Eyebrow>
            <LineReveal as="h2" lines={["Every feature,", "mapped honestly."]} />
            <p>The exact same breakdown as the cards above, side by side.</p>
          </div>
          <ComparisonTable title="Services" tierNames={["Starter", "Growth", "Signature"]} rows={servicesComparison} />
          <div style={{ marginTop: 40 }}>
            <ComparisonTable title="Platform" tierNames={["Starter", "Pro", "Agency"]} rows={platformComparison} />
          </div>
        </section>

        <section className="section section-bg">
          <div className="section-head reveal">
            <h2>What you&apos;re actually paying for.</h2>
          </div>
          <div className="reveal">
            <Guardrails />
          </div>
        </section>

        <section className="section section-bg-alt" style={{ position: "relative" }}>
          <DecorativeShapes corner="tr" />
          <div className="section-head reveal">
            <Eyebrow>FAQ</Eyebrow>
            <LineReveal as="h2" lines={["Questions before", "you sign up."]} />
          </div>
          <FaqAccordion entries={FAQ_ENTRIES} />
        </section>

        <section className="section section-bg text-center reveal">
          <LineReveal as="h2" lines={["Ready to pick a side?"]} style={{ fontSize: "clamp(24px, 4vw, 32px)" } as React.CSSProperties} />
          <p style={{ maxWidth: 420, margin: "16px auto 0", fontSize: 15, color: "var(--body-c)" }}>
            Talk to us about Services, or start free on the Platform today.
          </p>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Pill href="/services#schedule-call" variant="dark" trailing="arrow">
              Talk to us
            </Pill>
            <Pill href="/signup" variant="outline">
              Start free
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
