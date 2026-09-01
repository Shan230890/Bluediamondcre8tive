import type { ReactNode } from "react";

/**
 * Card shell with a hover treatment only — no rotation. Marketing cards use
 * the default (border/shadow "blend then reveal", defined in landing-e.css
 * on .tilt-card.tilt-hover); the dashboard app (a later phase) uses
 * `tilt="flat"` for a glow-only hover, no movement.
 */
export function TiltCard({
  children,
  tilt = "default",
  glow = false,
  className = "",
}: {
  children: ReactNode;
  tilt?: "default" | "flat";
  /** Breathing glow shadow — use for a single hero/showcase card, not every card. */
  glow?: boolean;
  className?: string;
}) {
  const isFlat = tilt === "flat";

  return (
    <div
      className={`tilt-card rounded-[20px] border border-black/10 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
        isFlat ? "tilt-flat" : "tilt-hover"
      } ${className}`}
      style={glow ? { animation: "landing-e-breathe 4s ease-in-out infinite" } : undefined}
    >
      {children}
    </div>
  );
}
