import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ACADEMY_PRODUCTS } from "@/lib/academy-products";
import "../landing-e.css";

export const metadata: Metadata = {
  title: "Academy — Blue Diamond Cre8tive",
  description: "Courses, templates, and cohorts teaching the exact marketing playbooks we run for clients.",
};

const tiers = [
  { name: "Entry", price: "$97–$197", includes: ["Template packs", "Mini-courses", "Lifetime access"] },
  { name: "Flagship", price: "~$497", featured: true, badge: "Best value", includes: ["Full course, start to finish", "Worksheets and templates", "Lifetime access and updates"] },
  { name: "Premium", price: "$1,497–$4,997", includes: ["Cohort or 1:1 feedback", "Direct review of your work", "Priority support"] },
];

export default function AcademyPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 40px" }}>
        <div className="hero-bg" aria-hidden="true">
          <span className="glow" />
        </div>
        <div className="fs-hero-inner">
          <span className="mono-tag">Silo 3 — Academy</span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
            Learn the playbooks, run them yourself.
          </h1>
          <p className="lead">
            Courses, templates, and 1:1 cohorts covering the exact systems we use to run marketing
            for paying clients.
          </p>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="grid grid-3">
          {tiers.map((tier) => (
            <div className={`price-card reveal ${tier.featured ? "featured" : ""}`} key={tier.name}>
              {tier.badge && <span className="badge">{tier.badge}</span>}
              <span className="tier-name">{tier.name}</span>
              <div className="tier-price">{tier.price}</div>
              <ul>
                {tier.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-bg">
        <div className="section-head reveal">
          <span className="eyebrow">Catalogue</span>
          <h2>Products available now</h2>
        </div>
        <div className="grid grid-2">
          {ACADEMY_PRODUCTS.map((product) => (
            <Link href={`/academy/${product.slug}`} key={product.slug} className="card reveal" style={{ display: "block" }}>
              <span className="mono-tag">{product.tier}</span>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>${product.price}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                  View <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="payments-note text-center" style={{ display: "flex", margin: "28px auto 0", justifyContent: "center" }}>
          Payments launching soon. Inquiries route to our team for now.
        </p>
      </section>

      <LandingFooter />
    </div>
  );
}
