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
    // Reading matchMedia can only happen client-side, so the true value is
    // necessarily unknown until after mount -- this correction is required,
    // not an effect that could be replaced by a lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
