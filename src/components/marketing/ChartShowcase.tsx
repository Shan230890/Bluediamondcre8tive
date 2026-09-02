"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Annotated multi-line chart card, structural pattern from the approved
 * mockup (`.chart-card`, conic-gradient glow border, two self-drawing
 * `<path>` lines). Shows an illustrative "score over time" concept for
 * Cre8tive Score — there is no real per-account score history yet, so this
 * stays clearly illustrative rather than claiming real numbers.
 */
export function ChartShowcase() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlay(true);
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlay(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className="bdc-chart-section">
      <div className="bdc-chart-copy">
        <span className="bdc-chart-tag">Cre8tive Score</span>
        <h3>See whether your positioning is actually holding.</h3>
        <p>
          Every score you run gets tracked against the same axis over time, so a rescore tells you
          whether what you shipped moved the number or not.
        </p>
      </div>
      <div ref={ref} className={`bdc-chart-card ${play ? "bdc-chart-in" : ""}`}>
        <div className="bdc-chart-card-inner">
          <div className="bdc-chart-card-head">
            <b>White-space score</b>
            <span className="bdc-chart-pill">6w window, illustrative</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>
            Indexed concept · not a real account&apos;s history
          </p>
          <svg viewBox="0 0 260 90" width="100%" height="90">
            <path
              className="bdc-chart-line"
              d="M0,70 C40,68 60,62 90,60 C120,58 140,55 170,50 C200,45 220,42 260,38"
              fill="none"
              stroke="#3d4a56"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              className="bdc-chart-line"
              d="M0,65 C40,55 60,58 90,45 C120,32 140,40 170,25 C200,10 220,18 260,8"
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </svg>
          <div className="bdc-chart-legend">
            <span>
              <i style={{ background: "var(--accent)" }} />
              Your score (illustrative)
            </span>
            <span>
              <i style={{ background: "#3d4a56" }} />
              Category average (illustrative)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
