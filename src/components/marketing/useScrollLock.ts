"use client";

import { useEffect } from "react";

let lockCount = 0;

/** Simple ref-counted scroll lock shared by the loader, nav overlay, and
 * request modal — any one of them locking keeps the page pinned even if
 * another unmounts first. No smooth-scroll library involved (Next's own
 * scroll restoration already fights hard enough with a full Lenis instance
 * bolted on top of App Router navigation), so this is a plain CSS lock. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    const html = document.documentElement;
    html.style.position = "relative";
    html.style.overflow = "hidden";
    html.style.height = "100%";
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        html.style.removeProperty("position");
        html.style.removeProperty("overflow");
        html.style.removeProperty("height");
      }
    };
  }, [locked]);
}
