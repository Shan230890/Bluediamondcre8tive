import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import { Pill, Eyebrow } from "@/components/marketing/Pill";
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
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 32px", textAlign: "left" }}>
          <div className="fs-hero-inner" style={{ maxWidth: 720 }}>
            <Eyebrow>{product.tier} tier</Eyebrow>
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={[product.title]}
              style={{ fontSize: "clamp(28px, 4.5vw, 40px)" } as React.CSSProperties}
            />
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
              <Pill href="/contact" variant="dark">
                Get started
              </Pill>
              <p className="payments-note text-center" style={{ display: "flex", marginTop: 16, justifyContent: "center" }}>
                Payments launching soon.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-bg reveal text-center">
          <LineReveal as="h2" lines={["Browse the rest of the Academy"]} style={{ fontSize: "clamp(22px, 4vw, 30px)" } as React.CSSProperties} />
          <div className="ctas" style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <Pill href="/academy" variant="outline" trailing="arrow">
              See all products
            </Pill>
          </div>
        </section>
      </>
    </MarketingShell>
  );
}
