"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { NavOverlay } from "./NavOverlay";
import { useReady } from "./ReadyContext";

/** Fixed-overlay header: brand lockup, primary nav (desktop), and a Menu
 * button that opens the full-screen NavOverlay. Slides down + fades in
 * shortly after the intro loader finishes. */
export function MarketingHeader() {
  const ready = useReady();
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    // Header condenses into a floating pill once the hero has scrolled past
    // -- same frosted-light styling throughout, just smaller/pill-shaped, per
    // Shan's correction (the mockup's dark floating pill was wrong, this
    // keeps the original frosted look at every scroll position).
    function onScroll() {
      setCondensed(window.scrollY > 160);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`bdc-header ${ready ? "bdc-header-in" : ""} ${condensed ? "bdc-header-condensed" : ""}`}>
        <Link href="/" className="fs-wordmark bdc-header-brand">
          <LogoMark size={condensed ? "sm" : "md"} iconOnly={condensed} />
        </Link>

        {!condensed && (
          <nav className="bdc-header-nav">
            <Link href="/services">Services</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/work">Work</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        )}

        <div className="bdc-header-right">
          <button type="button" className="bdc-menu-btn" onClick={() => setMenuOpen(true)} aria-haspopup="dialog">
            Menu
          </button>
        </div>
      </header>

      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
