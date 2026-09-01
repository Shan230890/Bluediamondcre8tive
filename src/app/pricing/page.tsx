import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import { SectionBackground } from "@/components/marketing/SectionBackground";
import { DecorativeShapes } from "@/components/marketing/DecorativeShapes";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Pricing — Blue Diamond Cre8tive",
  description: "All Blue Diamond Cre8tive pricing in one place: principal-led marketing services, and the self-serve Vault platform.",
};

const FAQ_ENTRIES = [
  {
    question: "What happens after I sign up?",
    answer:
      "For Services, we start with a short onboarding call to map your brand, audience, and goals before any asset gets made. For the Vault, you get instant access as soon as you sign up, no call required.",
  },
  {
    question: "How does billing and cancellation work?",
    answer: (
      <>
        Services are billed monthly, and the Vault renews on the cycle you pick at sign-up. You can
        cancel either at any time. Full terms are in our{" "}
        <Link href="/refund-cancellation">Refund &amp; Cancellation policy</Link>.
      </>
    ),
  },
  {
    question: "What's included at each tier?",
    answer:
      "Every tier's full feature list is on the tier cards above, Starter through Signature for Services, and Starter through Agency for the Vault. Reach out if you're not sure which one fits.",
  },
  {
    question: "Can I switch between Services and the Vault?",
    answer:
      "Yes. They run on separate billing since they're different products, so you can run one, both, or move between them as your needs change.",
  },
  {
    question: "Is the Academy available?",
    answer:
      "The Academy is paused, not gone. We pulled it while we focus on Services and the Vault. Reach out through our contact page and we'll notify you when it reopens.",
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

const serviceGroup = {
  label: "Services — principal-led",
  note: "Done-for-you. Onboarding call required.",
  name: "Services",
  href: "/services",
  tiers: [
    { name: "Starter", price: "$697–$997/mo", includes: ["Content calendar, copy, design", "Monthly report"] },
    { name: "Growth", price: "$1,997–$2,997/mo", featured: true, includes: ["Everything in Starter", "Campaigns, email, landing pages", "Reddit and digital PR", "Quarterly strategy session"] },
    { name: "Signature", price: "$5,000+/mo", includes: ["Fractional-CMO engagement", "Full team output", "Executive thought leadership", "Priority turnaround", "Limited seats"] },
  ],
};

const platformGroups = [
  {
    name: "Competitor Intelligence Vault",
    href: "/tools",
    tiers: [
      { name: "Starter", price: "$49/mo", includes: ["1 competitor tracked"] },
      { name: "Pro", price: "$99/mo", featured: true, includes: ["5 competitors", "Alerts"] },
      { name: "Agency", price: "$249/mo", includes: ["Unlimited competitors", "White-label export"] },
    ],
  },
];

function TierGrid({ tiers, href }: { tiers: typeof serviceGroup.tiers; href: string }) {
  return (
    <div className="grid grid-3">
      {tiers.map((tier) => (
        <div className={`price-card reveal ${tier.featured ? "featured" : ""}`} key={tier.name}>
          <span className="tier-name">{tier.name}</span>
          <div className="tier-price" style={{ fontSize: 22 }}>{tier.price}</div>
          <ul>
            {tier.includes.map((item) => (
              <li key={item}>
                <Check size={16} />
                {item}
              </li>
            ))}
          </ul>
          <Pill href={href} variant={tier.featured ? "dark" : "outline"}>
            Learn more
          </Pill>
        </div>
      ))}
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
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Pricing, all in one place."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">Services are principal-led and done-for-you. The Vault is a self-serve platform product.</p>
          </div>
        </section>

        <section className="section bdc-section-services">
          <div className="bdc-silo-group-head" style={{ marginBottom: 22 }}>
            <Eyebrow tone="light">{serviceGroup.label}</Eyebrow>
            <span className="bdc-silo-group-note" style={{ color: "rgba(255,255,255,0.55)" }}>{serviceGroup.note}</span>
          </div>
          <TierGrid tiers={serviceGroup.tiers} href={serviceGroup.href} />
        </section>

        <div className="bdc-silo-divider">
          <span className="bdc-silo-divider-label">Two different ways to work with us</span>
        </div>

        <section className="section bdc-section-platform">
          <div className="section-head reveal" style={{ marginBottom: 12 }}>
            <Eyebrow>Platform — self-serve</Eyebrow>
            <LineReveal as="h2" lines={["Sign up and get instant access."]} />
            <p>
              No onboarding call needed. Not ready to commit yet?{" "}
              <Link href="/tools/score" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Cre8tive Score
              </Link>{" "}
              is a free idea and positioning scorer, no account required, and the fastest way to see
              what our platform can do.
            </p>
          </div>
          {platformGroups.map((group) => (
            <div className="bdc-silo-group" key={group.name} style={{ marginTop: 36 }}>
              <div className="bdc-silo-group-head">
                <h3>{group.name}</h3>
              </div>
              <TierGrid tiers={group.tiers} href={group.href} />
            </div>
          ))}
        </section>

        <section className="section section-bg-dark text-center">
          <p className="payments-note" style={{ display: "inline-flex" }}>
            Payments launching soon. Every CTA above routes to our team for now.
          </p>
        </section>

        <section className="section section-bg" style={{ position: "relative" }}>
          <DecorativeShapes corner="tr" />
          <div className="section-head reveal">
            <Eyebrow>FAQ</Eyebrow>
            <LineReveal as="h2" lines={["Questions before", "you sign up."]} />
          </div>
          <FaqAccordion entries={FAQ_ENTRIES} />
        </section>
      </>
    </MarketingShell>
  );
}
