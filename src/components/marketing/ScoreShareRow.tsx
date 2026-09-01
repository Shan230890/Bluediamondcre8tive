"use client";

import { useState } from "react";
import { Pill } from "./Pill";

/** Native Web Share API when available, clipboard-copy fallback otherwise.
 * No dynamic OG image generation — the share text carries the headline. */
export function ScoreShareRow({
  toolName,
  score,
  brutalTruth,
  shareUrl,
}: {
  toolName: string;
  score: number;
  brutalTruth: string;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `${toolName} scored ${score}/100 on Cre8tive Score. "${brutalTruth}"`;

  async function onShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Cre8tive Score", text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Pill onClick={onShare} variant="outline">
        {copied ? "Link copied" : "Share this score"}
      </Pill>
    </div>
  );
}
