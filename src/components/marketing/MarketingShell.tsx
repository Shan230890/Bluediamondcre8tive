"use client";

import { MarketingHeader } from "./MarketingHeader";
import { RequestModal } from "./RequestModal";
import { RequestModalProvider } from "./RequestModalContext";
import { ReadyContext } from "./ReadyContext";
import { LandingFooter } from "@/components/LandingFooter";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * Top-level chrome shared by every marketing page: fixed header + full-
 * screen nav overlay -> page content -> footer -> shared request modal.
 * The intro loader screen was removed per Shan's request; `ReadyContext` is
 * now always true so hero text-reveals play immediately on scroll-into-view
 * instead of waiting on a loader that no longer exists.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  // Everything -- header, nav overlay, page body, footer, modal -- lives
  // inside a single `.landing-e` wrapper. Every Pattern E style added for
  // the motion-tier upgrade is scoped under `.landing-e`, so the header and
  // the shared modal/nav-overlay (which render as siblings of the page
  // content, not descendants of it) still need that ancestor class to pick
  // up their styling. Individual pages no longer render their own
  // `.landing-e` div -- this is the only one.
  return (
    <div className="landing-e" style={{ minHeight: "100vh" }}>
      <RequestModalProvider>
        <ReadyContext.Provider value={true}>
          <ScrollReveal />
          <MarketingHeader />
          <div className="bdc-page-body">{children}</div>
          <LandingFooter />
          <RequestModal />
        </ReadyContext.Provider>
      </RequestModalProvider>
    </div>
  );
}
