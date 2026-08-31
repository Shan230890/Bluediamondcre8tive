import Link from "next/link";
import "@/app/landing-e.css";

/** Shared shell for the legal suite (Terms/Privacy/Disclaimer/Refund &
 * Cancellation and the standalone agreement documents) so it reads as one
 * consistent system, not bespoke per page. Ported from the Opsara pattern. */
export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 64px" }}>
        <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
          ← Back to Blue Diamond Cre8tive
        </Link>

        <h1 style={{ marginTop: 24, fontSize: 32 }}>{title}</h1>
        <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)" }}>
          Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation.
        </p>
        <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>Last updated: {lastUpdated}</p>

        <div className="legal-body" style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20, fontSize: 14.5, lineHeight: 1.7, color: "var(--body-c)" }}>
          {children}
        </div>

        <div style={{ marginTop: 56, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
            ← Back to Blue Diamond Cre8tive
          </Link>
          <p style={{ marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
            Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation.
          </p>
          <p style={{ marginTop: 8, maxWidth: 560, fontSize: 12, color: "var(--muted)" }}>
            Blue Diamond Cre8tive&apos;s outputs are provided for informational and decision-support purposes only.
            Artificial intelligence can make errors. Always verify with a qualified professional before taking
            action.{" "}
            <Link href="/disclaimer" style={{ fontWeight: 600, color: "var(--accent)" }}>
              Full disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
