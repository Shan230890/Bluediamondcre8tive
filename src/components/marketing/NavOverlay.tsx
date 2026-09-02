"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { useScrollLock } from "./useScrollLock";
import { useRequestModal } from "./RequestModalContext";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/tools/score", label: "Cre8tive Score (free)" },
  { href: "/tools/vault", label: "Vault preview" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Log in" },
];

function formatClock(d: Date) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
}

/** Full-screen dark nav overlay. Stacked links stagger in on open; closes on
 * Escape, backdrop, or link click. Locks scroll while open. */
export function NavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openModal } = useRequestModal();
  const [now, setNow] = useState<Date | null>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    // Sets the clock immediately on open instead of waiting for the first
    // interval tick; `now` starts null so SSR/first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="bdc-nav-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="bdc-nav-overlay-top">
        <Link href="/" className="fs-wordmark bdc-header-brand" onClick={onClose}>
          <LogoMark size="md" surface="dark" />
        </Link>
        <button type="button" className="bdc-nav-overlay-close" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="bdc-nav-overlay-links">
        {LINKS.map((link, i) => (
          <Link href={link.href} key={link.href} onClick={onClose} style={{ animationDelay: `${i * 45}ms` }}>
            <span className="bdc-nav-overlay-index">{String(i + 1).padStart(2, "0")}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="bdc-nav-overlay-bottom">
        <span>{now ? formatClock(now) : ""}</span>
        <button
          type="button"
          className="bdc-nav-overlay-cta"
          onClick={() => {
            onClose();
            openModal("services");
          }}
        >
          Start a conversation
        </button>
      </div>
    </div>
  );
}
