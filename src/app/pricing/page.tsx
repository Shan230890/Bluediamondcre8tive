import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Pricing — Blue Diamond Cre8tive",
  description: "All Blue Diamond Cre8tive pricing in one place: principal-led marketing services, and the self-serve Vault and Academy platform.",
};

const serviceGroup = {
  label: "Services — principal-led",
  note: "Done-for-you. Onboarding call required.",
  name: "Services",
  href: "/services",
  tiers: [
    { name: "Starter", price: "$697–$997/mo", includes: ["Content calendar, copy, design", "Monthly report"] },
    { name: "Growth", price: "$1,997–$2,997/mo", featured: true, includes: ["Everything in Starter", "Campaigns, email, landing pages", "Reddit, YouTube, digital PR", "Quarterly strategy session"] },
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
  {
    name: "Academy",
    href: "/academy",
    tiers: [
      { name: "Entry", price: "$97–$197", includes: ["Template packs", "Mini-courses"] },
      { name: "Flagship", price: "~$497", featured: true, includes: ["Full course"] },
      { name: "Premium", price: "$1,497–$4,997", includes: ["Cohort or 1:1 feedback"] },
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
          <div className="fs-hero-inner">
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Pricing, all in one place."]}
              style={{ fontSize: "clamp(30px, 5vw, 44px)" } as React.CSSProperties}
            />
            <p className="lead">Services are principal-led and done-for-you. The Vault and Academy are self-serve platform products.</p>
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
              No onboarding call needed for either product below. Not ready to commit to either yet?{" "}
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
      </>
    </MarketingShell>
  );
}
