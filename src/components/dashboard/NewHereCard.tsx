"use client";

import { useEffect, useState } from "react";
import { X, Compass } from "lucide-react";
import { StartTourButton } from "@/components/dashboard/StartTourButton";

const DISMISSED_KEY = "bdc-tour-card-dismissed";

/**
 * Dismissible "New to the Platform?" card shown once on the dashboard home
 * page, prompting a first-time user to take the guided tour. Dismissal is
 * remembered per browser via localStorage — no per-account progress tracker,
 * this is a one-time nudge, not onboarding state.
 */
export function NewHereCard() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      // One-time read of a client-only localStorage flag on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      // localStorage unavailable — default to dismissed rather than risk
      // showing the card on every load with no way to remember it was seen.
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore — card will just show again next session
    }
  }

  if (dismissed) return null;

  return (
    <div className="content-card new-here-card" style={{ marginBottom: 24 }}>
      <button type="button" className="new-here-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
      <div className="new-here-icon">
        <Compass size={18} />
      </div>
      <div>
        <h3>New to the Platform?</h3>
        <p>Take a two-minute tour of the sidebar, projects, tasks, and your AI team.</p>
      </div>
      <StartTourButton label="Take the tour" className="btn-solid" />
    </div>
  );
}
