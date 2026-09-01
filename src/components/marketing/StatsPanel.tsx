"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { LineReveal } from "./TextReveal";
import { Eyebrow } from "./Pill";

type Stat = { value: number; suffix: string; label: string };

const STATS: Stat[] = [
  { value: 2, suffix: "", label: "ways to work with us: done-for-you services, self-serve platform" },
  { value: 100, suffix: "%", label: "deliverables reviewed by our principal before they ship" },
  { value: 4, suffix: "wk", label: "weekly cadence on every Vault scan" },
  { value: 24, suffix: "hr", label: "typical response time on a new inquiry" },
];

function useProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    function onScroll() {
      const now = performance.now();
      if (now - last < 30) return;
      last = now;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when top hits viewport bottom, 1 when center hits viewport center.
      const start = vh;
      const end = vh / 2 - rect.height / 2;
      const current = rect.top;
      const p = (start - current) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    }
    function loop() {
      onScroll();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return progress;
}

function StatNumber({ stat, progress }: { stat: Stat; progress: number }) {
  const reduced = useReducedMotion();
  const displayed = reduced ? stat.value : Math.round(stat.value * progress);
  return (
    <div className="bdc-stat">
      <div className="bdc-stat-number">
        {displayed}
        <span>{stat.suffix}</span>
      </div>
      <div className="bdc-stat-label">{stat.label}</div>
    </div>
  );
}

/** Rounded dark panel with scroll-driven count-up stats. */
export function StatsPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const progress = useProgress(ref);

  return (
    <div className="bdc-stats-panel" ref={ref}>
      <Eyebrow tone="light">By the numbers</Eyebrow>
      <LineReveal as="h2" lines={["A small team,", "a real system."]} className="bdc-stats-heading" />
      <div className="bdc-stats-grid">
        {STATS.map((stat) => (
          <StatNumber key={stat.label} stat={stat} progress={progress} />
        ))}
      </div>
    </div>
  );
}
