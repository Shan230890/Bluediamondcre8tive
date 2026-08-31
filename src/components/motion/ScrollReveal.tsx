"use client";

import { useEffect } from "react";

/**
 * Mounts once and wires every `.reveal` element on the page to an
 * IntersectionObserver that adds `.in` (see landing-e.css) the first time it
 * enters the viewport, then stops observing it — a one-shot fade+rise, not a
 * toggle. Falls back to revealing everything immediately if
 * IntersectionObserver isn't available.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
