import type { ReactNode } from "react";

/**
 * Tilted, physical-feeling card (±0.6°–1.4°, alternating direction) that
 * settles flat + lifts on hover — the marketing-tilt treatment. Dashboard
 * cards (a later phase) use `tilt="flat"` for a glow-only hover, no
 * movement — same split as Opsara's TiltCard, restyled to Pattern E.
 *
 * Tilt is a fixed enum (not a raw degree prop) so Tailwind's JIT scanner can
 * statically see every rotate-[...] class it needs to generate.
 */
const TILT_CLASSES = {
  "lg-left": "rotate-[-1.4deg]",
  "lg-right": "rotate-[1.4deg]",
  "sm-left": "rotate-[-0.6deg]",
  "sm-right": "rotate-[0.6deg]",
  /** No rotation — reserved for the dashboard app in a later phase. */
  flat: "",
} as const;

export function TiltCard({
  children,
  tilt = "lg-left",
  glow = false,
  className = "",
}: {
  children: ReactNode;
  tilt?: keyof typeof TILT_CLASSES;
  /** Breathing glow shadow — use for a single hero/showcase card, not every card. */
  glow?: boolean;
  className?: string;
}) {
  const isFlat = tilt === "flat";

  return (
    <div
      className={`tilt-card rounded-[20px] border border-black/10 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
        isFlat ? "tilt-flat" : "tilt-hover"
      } ${TILT_CLASSES[tilt]} ${className}`}
      style={glow ? { animation: "landing-e-breathe 4s ease-in-out infinite" } : undefined}
    >
      {children}
    </div>
  );
}
