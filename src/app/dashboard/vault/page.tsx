"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getCompetitorLimit } from "@/lib/vault/tier-limits";
import { WeeklyScanEntrySchema } from "@/lib/vault/schema";

interface VaultEntry {
  id: string;
  competitor_name: string;
  entry_type: "weekly_scan" | "monthly_review";
  content: string | null;
  white_space_notes: string | null;
  created_at: string;
}

/**
 * IMPORTANT — legal guardrail (see also README.md "Competitor Intelligence
 * Vault — legal note"): entries below are added by hand through the form on
 * this page, NOT scraped automatically. Automated scraping of competitor
 * websites has an unresolved legal question — target sites' ToS may
 * prohibit it — pending Harvey/legal review. Do not wire this page or its
 * API up to a live scraper before that review clears.
 */
export default function VaultPage() {
  const [entries, setEntries] = useState<VaultEntry[] | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [competitorName, setCompetitorName] = useState("");
  const [content, setContent] = useState("");
  const [whiteSpaceNotes, setWhiteSpaceNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [{ data: sub }, { data: vaultEntries }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("tier")
          .eq("client_id", user.id)
          .eq("silo", "vault")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("competitor_vault_entries")
          .select("id, competitor_name, entry_type, content, white_space_notes, created_at")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      setTier(sub?.tier ?? null);
      setEntries(vaultEntries ?? []);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, VaultEntry[]>();
    for (const entry of entries ?? []) {
      const list = map.get(entry.competitor_name) ?? [];
      list.push(entry);
      map.set(entry.competitor_name, list);
    }
    return map;
  }, [entries]);

  const competitorNames = useMemo(() => Array.from(grouped.keys()), [grouped]);
  const limit = tier ? getCompetitorLimit(tier) : 0;
  const atLimit =
    limit !== null &&
    limit !== undefined &&
    !competitorNames.includes(competitorName.trim()) &&
    competitorNames.length >= limit;

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsed = WeeklyScanEntrySchema.safeParse({
      competitor_name: competitorName.trim(),
      content,
      white_space_notes: whiteSpaceNotes || undefined,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid entry.");
      return;
    }
    if (!userId) return;
    if (atLimit) {
      setFormError(`Your ${tier ?? "current"} tier tracks up to ${limit} competitor${limit === 1 ? "" : "s"}. Upgrade to add another.`);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    // Manual entry, by design — see the legal note above and in README.md.
    const { data, error } = await supabase
      .from("competitor_vault_entries")
      .insert({
        client_id: userId,
        competitor_name: parsed.data.competitor_name,
        entry_type: "weekly_scan",
        content: parsed.data.content,
        white_space_notes: parsed.data.white_space_notes ?? null,
      })
      .select("id, competitor_name, entry_type, content, white_space_notes, created_at")
      .single();

    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setEntries((prev) => [data as VaultEntry, ...(prev ?? [])]);
    setCompetitorName("");
    setContent("");
    setWhiteSpaceNotes("");
  }

  return (
    <div>
      <div className="dash-page-head">
        <h1>Competitor Intelligence Vault</h1>
        <p>
          Tracked competitors and weekly/monthly intelligence.{" "}
          {tier && (
            <>
              Your tier: <strong style={{ textTransform: "capitalize" }}>{tier}</strong> ({limit === null ? "unlimited" : limit} competitor{limit === 1 ? "" : "s"}).
            </>
          )}
        </p>
      </div>

      <div className="form-note" style={{ marginBottom: 24 }}>
        Entries in the Vault are added manually by our team, not scraped automatically. Automated
        scraping of competitor sites has an unresolved legal question (target ToS may prohibit it)
        pending legal review — until that clears, everything here is sourced by hand.
      </div>

      {entries === null ? (
        <div className="dash-list" style={{ marginBottom: 24 }}>
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : competitorNames.length === 0 ? (
        <div className="dash-empty" style={{ marginBottom: 24 }}>
          <div className="dash-empty-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="dash-empty-title">No competitors tracked yet</div>
          <p>Add your first weekly scan below.</p>
        </div>
      ) : (
        <div style={{ marginBottom: 32 }}>
          {competitorNames.map((name) => {
            const rows = grouped.get(name) ?? [];
            return (
              <div key={name} style={{ marginBottom: 22 }}>
                <h3 style={{ fontSize: 15, marginBottom: 10 }}>{name}</h3>
                <div className="dash-list">
                  {rows.map((row) => (
                    <div className="dash-row" key={row.id} style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="pill pill-due">{row.entry_type === "weekly_scan" ? "Weekly scan" : "Monthly review"}</span>
                        <span className="dash-row-sub">{new Date(row.created_at).toLocaleDateString()}</span>
                      </div>
                      {row.content && <p style={{ fontSize: 13, marginTop: 4 }}>{row.content}</p>}
                      {row.white_space_notes && (
                        <p style={{ fontSize: 12.5, color: "var(--muted)" }}>White space: {row.white_space_notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Add a weekly scan entry</h3>
      <form onSubmit={handleAddEntry} style={{ maxWidth: 480 }}>
        <div className="field">
          <label htmlFor="competitor_name">Competitor name</label>
          <input
            id="competitor_name"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="content">What did you find</label>
          <textarea id="content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="white_space_notes">White space notes (optional)</label>
          <textarea
            id="white_space_notes"
            rows={3}
            value={whiteSpaceNotes}
            onChange={(e) => setWhiteSpaceNotes(e.target.value)}
          />
        </div>
        {formError && <p className="form-error">{formError}</p>}
        {atLimit && (
          <p className="form-error">
            Your {tier ?? "current"} tier tracks up to {limit} competitor{limit === 1 ? "" : "s"}. Upgrade to add another.
          </p>
        )}
        <button type="submit" className="btn-solid" disabled={saving} style={{ marginTop: 6 }}>
          {saving ? "Saving..." : "Add entry"}
        </button>
      </form>
    </div>
  );
}
