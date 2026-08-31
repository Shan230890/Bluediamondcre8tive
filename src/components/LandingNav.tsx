"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

/** Shared frosted-glass nav for every Pattern E marketing page. Below 640px
 * the link row collapses behind a hamburger toggle that expands as a
 * full-width dropdown (not a slide-in drawer). */
export function LandingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={`fs-nav ${open ? "open" : ""}`}>
      <Link href="/" className="fs-wordmark" onClick={close}>
        <LogoMark size="sm" />
        <span>Blue Diamond Cre8tive</span>
      </Link>
      <button
        type="button"
        className="fs-nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>
      <div className="right">
        <Link href="/services" onClick={close}>Services</Link>
        <Link href="/tools" onClick={close}>Tools</Link>
        <Link href="/academy" onClick={close}>Academy</Link>
        <Link href="/work" onClick={close}>Work</Link>
        <Link href="/pricing" onClick={close}>Pricing</Link>
        <Link href="/login" onClick={close}>Log in</Link>
        <Link href="/signup" className="cta" onClick={close}>Get started</Link>
      </div>
    </nav>
  );
}
