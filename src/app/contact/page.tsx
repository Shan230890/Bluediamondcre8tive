"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { LineReveal } from "@/components/marketing/TextReveal";
import "../landing-e.css";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      interest: String(form.get("interest") || ""),
      message: String(form.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed.");
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Email us directly at hello@bluediamondcre8tive.com.");
    }
  }

  return (
    <MarketingShell>
      <>
        <section className="fs-hero" style={{ padding: "56px 24px 32px" }}>
          <div className="fs-hero-inner">
            <LineReveal
              as="h1"
              className="bdc-hero-h1"
              lines={["Get started"]}
              style={{ fontSize: "clamp(28px, 4.5vw, 38px)" } as React.CSSProperties}
            />
            <p className="lead">
              Tell us about your brand. This is not live checkout, an inquiry, we&apos;ll follow up
              with a plan.
            </p>
          </div>
        </section>

        <section className="section section-bg-alt">
          <div className="form-shell reveal">
            {status === "sent" ? (
              <div className="form-success">
                Thanks, we&apos;ve got your inquiry. We&apos;ll follow up by email shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="company">Company (optional)</label>
                  <input id="company" name="company" />
                </div>
                <div className="field">
                  <label htmlFor="interest">What are you interested in?</label>
                  <select id="interest" name="interest" defaultValue="services">
                    <option value="services">Marketing services</option>
                    <option value="vault">Competitor Intelligence Vault</option>
                    <option value="academy">Academy course or template</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4} required />
                </div>
                {status === "error" && <p className="form-error">{errorMsg}</p>}
                <button type="submit" className="btn-solid" style={{ width: "100%", border: "none" }} disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send inquiry"}
                </button>
                <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                  Prefer email? <a href="mailto:hello@bluediamondcre8tive.com" style={{ color: "var(--accent)", fontWeight: 600 }}>hello@bluediamondcre8tive.com</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section className="section section-bg text-center reveal">
          <Link href="/pricing" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--accent)" }}>
            ← Back to pricing
          </Link>
        </section>
      </>
    </MarketingShell>
  );
}
