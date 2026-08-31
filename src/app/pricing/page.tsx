import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Pricing — Blue Diamond Cre8tive",
  description: "All Blue Diamond Cre8tive pricing in one place: marketing services, the Competitor Intelligence Vault, and the Academy.",
};

const groups = [
  {
    name: "Services",
    href: "/services",
    tiers: [
      { name: "Starter", price: "$697–$997/mo", includes: ["Content calendar, copy, design", "Monthly report"] },
      { name: "Growth", price: "$1,997–$2,997/mo", featured: true, includes: ["Everything in Starter", "Campaigns, email, landing pages", "Quarterly strategy session"] },
      { name: "Signature", price: "$5,000+/mo", includes: ["Fractional-CMO engagement", "Full team output", "Priority turnaround", "Limited seats"] },
    ],
  },
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

export default function PricingPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 32px" }}>
        <div className="fs-hero-inner">
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>Pricing, all in one place</h1>
          <p className="lead">Every tier from every silo. Pick where you want to start.</p>
        </div>
      </section>

      {groups.map((group, i) => (
        <section className={`section ${i % 2 === 0 ? "section-bg-alt" : "section-bg"}`} key={group.name}>
          <div className="section-head reveal" style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 24 }}>{group.name}</h2>
          </div>
          <div className="grid grid-3">
            {group.tiers.map((tier) => (
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
                <Link href={group.href} className={tier.featured ? "btn-solid" : "btn-outline"}>
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="section section-bg-dark text-center">
        <p className="payments-note" style={{ display: "inline-flex" }}>
          Payments launching soon. Every CTA above routes to our team for now.
        </p>
      </section>

      <LandingFooter />
    </div>
  );
}
