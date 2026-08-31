import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ACADEMY_PRODUCTS } from "@/lib/academy-products";
import "../../landing-e.css";

export function generateStaticParams() {
  return ACADEMY_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = ACADEMY_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product not found — Blue Diamond Cre8tive" };
  return { title: `${product.title} — Blue Diamond Cre8tive Academy`, description: product.description };
}

export default async function AcademyProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = ACADEMY_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 32px", textAlign: "left" }}>
        <div className="fs-hero-inner" style={{ maxWidth: 720 }}>
          <span className="mono-tag">{product.tier} tier</span>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 40px)" }}>{product.title}</h1>
          <p className="lead" style={{ margin: "16px 0 0", textAlign: "left" }}>{product.longDescription}</p>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="reveal">
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>What you get</h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
              {product.outcomes.map((outcome) => (
                <li key={outcome} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--body-c)" }}>
                  <Check size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="price-card reveal featured" style={{ position: "sticky", top: 100 }}>
            <span className="tier-name">{product.tier}</span>
            <div className="tier-price">${product.price}</div>
            <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)" }}>One-time purchase, lifetime access.</p>
            <Link href="/contact" className="btn-solid">
              Get started <ArrowRight size={16} />
            </Link>
            <p className="payments-note text-center" style={{ display: "flex", marginTop: 16, justifyContent: "center" }}>
              Payments launching soon.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-bg reveal text-center">
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)" }}>Browse the rest of the Academy</h2>
        <div className="ctas" style={{ marginTop: 20 }}>
          <Link href="/academy" className="btn-outline">
            See all products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
