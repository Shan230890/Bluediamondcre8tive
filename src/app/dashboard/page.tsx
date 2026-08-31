"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TiltCard } from "@/components/motion/TiltCard";

interface Stats {
  openInvoices: number;
  activeTier: string | null;
  recentDeliverables: { id: string; title: string; type: string | null }[];
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: invoices }, { data: subs }, { data: deliverables }] = await Promise.all([
        supabase.from("invoices").select("id, status").in("status", ["due", "overdue"]).eq("client_id", user.id),
        supabase
          .from("subscriptions")
          .select("tier, silo, status")
          .eq("client_id", user.id)
          .eq("silo", "services")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("deliverables")
          .select("id, title, type")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (!active) return;
      setStats({
        openInvoices: invoices?.length ?? 0,
        activeTier: subs?.[0]?.tier ?? null,
        recentDeliverables: deliverables ?? [],
      });
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <h1>Welcome back</h1>
        <p>Here&apos;s a quick look at where things stand.</p>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading...</p>
      ) : (
        <>
          <div className="dash-grid dash-grid-3" style={{ marginBottom: 28 }}>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-label">Open invoices</div>
              <div className="dash-stat-value">{stats?.openInvoices ?? 0}</div>
            </TiltCard>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-label">Active services tier</div>
              <div className="dash-stat-value" style={{ fontSize: 20, textTransform: "capitalize" }}>
                {stats?.activeTier ?? "None"}
              </div>
            </TiltCard>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-label">Recent deliverables</div>
              <div className="dash-stat-value">{stats?.recentDeliverables.length ?? 0}</div>
            </TiltCard>
          </div>

          <div className="dash-grid dash-grid-2">
            <div>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Recent deliverables</h3>
              {stats && stats.recentDeliverables.length > 0 ? (
                <div className="dash-list">
                  {stats.recentDeliverables.map((d) => (
                    <div className="dash-row" key={d.id}>
                      <div>
                        <div className="dash-row-title">{d.title}</div>
                        {d.type && <div className="dash-row-sub">{d.type}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dash-empty">No deliverables yet.</div>
              )}
              <Link href="/dashboard/deliverables" className="btn-outline" style={{ marginTop: 14, display: "inline-flex" }}>
                View all deliverables
              </Link>
            </div>

            <div>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Quick links</h3>
              <div className="dash-list">
                <Link href="/dashboard/invoices" className="dash-row">
                  <span className="dash-row-title">Invoices</span>
                </Link>
                <Link href="/dashboard/vault" className="dash-row">
                  <span className="dash-row-title">Competitor Intelligence Vault</span>
                </Link>
                <Link href="/dashboard/academy" className="dash-row">
                  <span className="dash-row-title">Academy library</span>
                </Link>
                <Link href="/dashboard/team" className="dash-row">
                  <span className="dash-row-title">Your Cre8tive Team</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
