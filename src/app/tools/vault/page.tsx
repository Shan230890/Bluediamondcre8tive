import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LandingNav } from "@/components/LandingNav";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "../../landing-e.css";

export const metadata: Metadata = {
  title: "Vault Preview — Blue Diamond Cre8tive",
  description: "An illustrative preview of the Competitor Intelligence Vault product experience.",
};

const mockRows = [
  { name: "Acme Growth Co.", change: "Dropped entry tier from $79 to $59/mo", trend: "down" as const, date: "3 days ago" },
  { name: "Northwind Studio", change: "Launched a new landing page for their flagship offer", trend: "up" as const, date: "5 days ago" },
  { name: "Bright Signal Agency", change: "No pricing or positioning changes this week", trend: "flat" as const, date: "6 days ago" },
  { name: "Acme Growth Co.", change: "New case study published, repositioning toward enterprise", trend: "up" as const, date: "1 week ago" },
];

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };

export default function VaultPreviewPage() {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <ScrollReveal />
      <LandingNav />

      <section className="fs-hero" style={{ padding: "56px 24px 32px" }}>
        <div className="fs-hero-inner">
          <span className="mono-tag">Vault preview</span>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 38px)" }}>
            What the Vault looks like once you&apos;re inside
          </h1>
          <p className="lead">
            This is an illustrative preview of the dashboard experience. The real, authenticated
            Vault UI ships with the client dashboard in a later phase.
          </p>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="fake-browser reveal" style={{ maxWidth: 780, margin: "0 auto" }}>
          <div className="fake-browser-bar">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="url">app.bluediamondcre8tive.com/dashboard/vault</span>
          </div>
          <div style={{ padding: 28 }}>
            <h3 style={{ fontSize: 17, marginBottom: 4 }}>This week&apos;s scan</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>3 competitors tracked · Pro tier</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockRows.map((row, i) => {
                const Icon = trendIcon[row.trend];
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      background: "var(--card-alt)",
                    }}
                  >
                    <Icon size={18} color="var(--accent)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{row.name}</div>
                      <div style={{ fontSize: 13, color: "var(--body-c)" }}>{row.change}</div>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{row.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-center" style={{ marginTop: 20, fontSize: 12.5, color: "var(--muted)" }}>
          Illustrative preview. Data shown is example content, not real client data.
        </p>
      </section>

      <section className="section section-bg reveal text-center">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>Want this running for your brand?</h2>
        <div className="ctas" style={{ marginTop: 20 }}>
          <Link href="/tools" className="btn-solid">
            See pricing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
