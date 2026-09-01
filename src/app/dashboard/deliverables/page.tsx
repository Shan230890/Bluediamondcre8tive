"use client";

import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Deliverable {
  id: string;
  title: string;
  type: string | null;
  file_url: string | null;
  created_at: string;
}

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[] | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("deliverables")
        .select("id, title, type, file_url, created_at")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      if (active) setDeliverables(data ?? []);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <h1>Deliverables</h1>
        <p>Content calendars, campaign assets, and reports from your team.</p>
      </div>

      {deliverables === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : deliverables.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <FolderOpen size={20} />
          </div>
          <div className="dash-empty-title">No deliverables yet</div>
          <p>Content calendars, campaign assets, and reports will land here.</p>
        </div>
      ) : (
        <div className="dash-list">
          {deliverables.map((d) => (
            <div className="dash-row" key={d.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="dash-row-icon">
                  <FolderOpen size={16} />
                </div>
                <div>
                  <div className="dash-row-title">{d.title}</div>
                  <div className="dash-row-sub">{d.type ?? "Deliverable"}</div>
                </div>
              </div>
              {d.file_url ? (
                <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Open
                </a>
              ) : (
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Pending upload</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
