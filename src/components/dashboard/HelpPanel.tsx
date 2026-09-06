"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

/**
 * Per-page "?" help panel — adapted from Opsara's src/components/HelpPanel.tsx
 * pattern (fixed toggle button, floating panel, no backdrop, no first-visit
 * auto-show, no keyboard shortcut) restyled onto this app's own dashboard.css
 * token set. Content is hardcoded per call site: a `title` plus JSX children
 * describing what that specific page actually does, never generic filler.
 */
export function HelpPanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="help-panel-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close help" : "Help for this page"}
        title="Help for this page"
      >
        {open ? <X size={16} /> : <HelpCircle size={16} />}
      </button>
      {open && (
        <div className="help-panel" role="dialog" aria-label={`${title} help`}>
          <div className="help-panel-head">
            <span className="help-panel-title">{title}</span>
            <button
              type="button"
              className="help-panel-close"
              onClick={() => setOpen(false)}
              aria-label="Close help"
            >
              <X size={14} />
            </button>
          </div>
          <div className="help-panel-body">{children}</div>
        </div>
      )}
    </>
  );
}
