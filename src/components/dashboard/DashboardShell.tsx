"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeftOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import "@/app/dashboard/dashboard.css";

const COLLAPSED_KEY = "bdc-sidebar-collapsed";

/**
 * Mobile off-canvas drawer + collapsible desktop sidebar, mirroring Opsara's
 * DashboardShell/Sidebar interaction quality (restyled to Pattern E tokens
 * on dashboard.css, a stylesheet scoped separately from the marketing
 * site's landing-e.css). Collapse state persists to localStorage so it
 * survives reloads, same as Opsara's `opsara-sidebar-collapsed`.
 */
export function DashboardShell({
  email,
  profile,
  children,
}: {
  email: string;
  profile: { name: string | null; company: string | null } | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so the true collapsed state
    // is unknown until after mount; this correction can't be a lazy
    // initializer without risking a hydration mismatch.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="dashboard-e">
      <div className="dash-topbar">
        <button
          type="button"
          className="dash-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Blue Diamond Cre8tive</span>
        <span style={{ width: 22 }} />
      </div>

      <div className="dash-shell">
        {mobileOpen && <div className="dash-scrim" onClick={() => setMobileOpen(false)} />}
        <Sidebar
          open={mobileOpen}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          onNavigate={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />

        {collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Show sidebar"
            title="Show sidebar"
            className="dash-rail-expand"
            style={{
              position: "fixed",
              left: 10,
              top: 14,
              zIndex: 40,
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--body-c)",
              cursor: "pointer",
            }}
          >
            <PanelLeftOpen size={15} />
          </button>
        )}

        <main className="dash-main">
          <div style={{ marginBottom: 8, fontSize: 12.5, color: "var(--muted)" }}>
            Signed in as {profile?.name || email}
            {profile?.company ? ` — ${profile.company}` : ""}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
