"use client";

import { useEffect, useState } from "react";

/** True when the visitor has requested reduced motion at the OS level.
 * Every piece of the new Pattern E motion system (loader delay, liquid-reveal
 * canvas, spring hovers, staggered reveals) checks this and either skips
 * straight to the settled state or falls back to an instant/no-op version. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
