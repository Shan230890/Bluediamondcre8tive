"use client";

/**
 * Dispatches the custom `bdc:start-tour` event that AppTour.tsx listens for.
 * Used both inside the help widget's guide tab and inside NewHereCard.
 */
export function StartTourButton({ label = "Take the tour", className = "btn-outline" }: { label?: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("bdc:start-tour"))}
    >
      {label}
    </button>
  );
}
