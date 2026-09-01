"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, Layers, FolderOpen, ShieldCheck, GraduationCap, Users, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TiltCard } from "@/components/motion/TiltCard";

interface Stats {
  openInvoices: number;
  activeTier: string | null;
  recentDeliverables: { id: string; title: string; type: string | null }[];
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const email = user.email;
      if (email) {
        const local = email.split("@")[0].split(/[._-]/)[0];
        setFirstName(local.charAt(0).toUpperCase() + local.slice(1));
      }

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
      <p className="dash-eyebrow">{WEEKDAY_FORMAT.format(new Date())}</p>
      <div className="dash-page-head" style={{ marginBottom: 28 }}>
        <div>
          <h1>
            {greetingForHour(new Date().getHours())}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p>Here&apos;s a quick look at where things stand.</p>
        </div>
      </div>

      {loading ? (
        <>
          <div className="dash-grid dash-grid-3" style={{ marginBottom: 28 }}>
            <div className="skel skel-card" />
            <div className="skel skel-card" />
            <div className="skel skel-card" />
          </div>
          <div className="dash-grid dash-grid-2">
            <div className="skel skel-row" />
            <div className="skel skel-row" />
          </div>
        </>
      ) : (
        <>
          <div className="dash-grid dash-grid-3" style={{ marginBottom: 28 }}>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-top">
                <div className="dash-stat-label">Open invoices</div>
                <div className="dash-stat-icon">
                  <Receipt size={16} />
                </div>
              </div>
              <div className="dash-stat-value">{stats?.openInvoices ?? 0}</div>
            </TiltCard>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-top">
                <div className="dash-stat-label">Active services tier</div>
                <div className="dash-stat-icon">
                  <Layers size={16} />
                </div>
              </div>
              <div className="dash-stat-value" style={{ fontSize: 20, textTransform: "capitalize" }}>
                {stats?.activeTier ?? "None"}
              </div>
            </TiltCard>
            <TiltCard tilt="flat" className="dash-card">
              <div className="dash-stat-top">
                <div className="dash-stat-label">Recent deliverables</div>
                <div className="dash-stat-icon">
                  <FolderOpen size={16} />
                </div>
              </div>
              <div className="dash-stat-value">{stats?.recentDeliverables.length ?? 0}</div>
            </TiltCard>
          </div>

          <div className="dash-grid dash-grid-2">
            <div>
              <div className="dash-section-head">
                <h3>Recent deliverables</h3>
              </div>
              {stats && stats.recentDeliverables.length > 0 ? (
                <div className="dash-list">
                  {stats.recentDeliverables.map((d) => (
                    <div className="dash-row" key={d.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="dash-row-icon">
                          <FolderOpen size={16} />
                        </div>
                        <div>
                          <div className="dash-row-title">{d.title}</div>
                          {d.type && <div className="dash-row-sub">{d.type}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dash-empty">
                  <div className="dash-empty-icon">
                    <FolderOpen size={20} />
                  </div>
                  <div className="dash-empty-title">No deliverables yet</div>
                  <p>Your team&apos;s work will show up here as it&apos;s delivered.</p>
                </div>
              )}
              <Link href="/dashboard/deliverables" className="btn-outline" style={{ marginTop: 14, display: "inline-flex" }}>
                View all deliverables <ArrowRight size={14} style={{ marginLeft: 6 }} />
              </Link>
            </div>

            <div>
              <div className="dash-section-head">
                <h3>Quick links</h3>
              </div>
              <div className="dash-list">
                <Link href="/dashboard/invoices" className="dash-row">
                  <span className="dash-quick-link">
                    <span className="dash-row-icon">
                      <Receipt size={16} />
                    </span>
                    <span className="dash-row-title">Invoices</span>
                  </span>
                </Link>
                <Link href="/dashboard/vault" className="dash-row">
                  <span className="dash-quick-link">
                    <span className="dash-row-icon">
                      <ShieldCheck size={16} />
                    </span>
                    <span className="dash-row-title">Competitor Intelligence Vault</span>
                  </span>
                </Link>
                <Link href="/dashboard/academy" className="dash-row">
                  <span className="dash-quick-link">
                    <span className="dash-row-icon">
                      <GraduationCap size={16} />
                    </span>
                    <span className="dash-row-title">Academy library</span>
                  </span>
                </Link>
                <Link href="/dashboard/team" className="dash-row">
                  <span className="dash-quick-link">
                    <span className="dash-row-icon">
                      <Users size={16} />
                    </span>
                    <span className="dash-row-title">Your Cre8tive Team</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
