"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import "@/app/dashboard/dashboard.css";

/**
 * Mobile off-canvas drawer + static desktop sidebar, mirroring Opsara's
 * DashboardShell/Sidebar collapse pattern (restyled to Pattern E tokens on
 * dashboard.css, a stylesheet scoped separately from the marketing site's
 * landing-e.css).
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
        <Sidebar open={mobileOpen} onNavigate={() => setMobileOpen(false)} onSignOut={handleSignOut} />

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
