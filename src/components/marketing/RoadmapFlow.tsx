"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface RoadmapStep {
  num: string;
  title: string;
  short: string;
  body: string;
}

const AUTO_ADVANCE_MS = 6000;

/**
 * Interactive step flow for /roadmap, replacing a static 2x2 card grid.
 * A connected line of numbered nodes sits above a single detail panel:
 * clicking a node swaps the panel with a crossfade and moves a progress
 * dot along the connector to that node's position. Auto-advances through
 * the steps on a timer until the visitor interacts, then stops, so it
 * reads as a real flow of information rather than four cards competing for
 * attention at once. Reduced-motion disables both the auto-advance timer
 * and the crossfade/dot transitions -- content still switches instantly.
 */
export function RoadmapFlow({ steps }: { steps: RoadmapStep[] }) {
  const [active, setActive] = useState(0);
  const [userDriven, setUserDriven] = useState(false);
  const reduced = useReducedMotion();
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (reduced || userDriven) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduced, userDriven, steps.length]);

  function select(index: number) {
    setUserDriven(true);
    setActive(index);
  }

  const step = steps[active];
  const percent = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <div className="bdc-flow">
      <div className="bdc-flow-track" role="tablist" aria-label="Roadmap steps">
        <div className="bdc-flow-line">
          <div className="bdc-flow-line-fill" style={{ width: `${percent}%` }} />
        </div>
        {steps.map((s, i) => (
          <button
            key={s.num}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`bdc-flow-panel-${i}`}
            className={`bdc-flow-node ${i === active ? "active" : ""} ${i < active ? "done" : ""}`}
            onClick={() => select(i)}
          >
            <span className="bdc-flow-node-num">{s.num}</span>
            <span className="bdc-flow-node-label">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="bdc-flow-panel-wrap">
        {steps.map((s, i) => (
          <div
            key={s.num}
            id={`bdc-flow-panel-${i}`}
            role="tabpanel"
            className={`bdc-flow-panel ${i === active ? "active" : ""}`}
            aria-hidden={i !== active}
          >
            <span className="bdc-flow-panel-eyebrow">
              Step {s.num} of {steps.length}
            </span>
            <h3>{s.title}</h3>
            <p className="bdc-flow-panel-short">{s.short}</p>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      <div className="bdc-flow-dots">
        {steps.map((s, i) => (
          <button
            key={s.num}
            type="button"
            aria-label={`Go to step ${s.num}: ${s.title}`}
            className={`bdc-flow-dot ${i === active ? "active" : ""}`}
            onClick={() => select(i)}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {`Step ${step.num}: ${step.title}`}
      </div>
    </div>
  );
}
