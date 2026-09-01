"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { useReducedMotion } from "./useReducedMotion";
import { useScrollLock } from "./useScrollLock";

const FILL_MS = 1300;

/** easeInOutCubic */
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Full-screen intro loader: counts 000 -> 100 over ~1300ms, then slides the
 * whole panel up and hands control back via onDone(). On
 * prefers-reduced-motion it skips straight to onDone() with no delay at all
 * -- no counter, no slide, nothing rendered.
 */
export function PageLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(true);
  const doneRef = useRef(false);

  useScrollLock(mounted && !reduced);

  useEffect(() => {
    if (reduced) {
      // No need to also flip `mounted` here: the render guard below already
      // returns null whenever `reduced` is true.
      onDone();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FILL_MS);
      setCount(Math.round(ease(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setLeaving(true);
        onDone();
        window.setTimeout(() => setMounted(false), 750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (!mounted || reduced) return null;

  return (
    <div className={`bdc-loader ${leaving ? "bdc-loader-leave" : ""}`} aria-hidden="true">
      <div className="bdc-loader-center">
        <div className="bdc-loader-mark">
          <LogoMark size="md" />
          <span>Blue Diamond Cre8tive</span>
        </div>
        <p className="bdc-loader-tag">AI-native marketing, built with finesse.</p>
      </div>
      <div className="bdc-loader-progress">
        <span className="bdc-loader-label">Loading</span>
        <div className="bdc-loader-track">
          <div className="bdc-loader-fill" style={{ width: `${count}%` }} />
        </div>
        <span className="bdc-loader-count">{String(count).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
