"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("name, company").eq("id", user.id).maybeSingle();
      if (active) {
        setName(data?.name ?? "");
        setCompany(data?.company ?? "");
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name, company })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <div>
      <div className="dash-page-head">
        <h1>Settings</h1>
        <p>Update your profile details.</p>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="company">Company</label>
            <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          {error && <p className="form-error">{error}</p>}
          {saved && <p style={{ fontSize: 13, color: "#1a7a3c", marginTop: 6 }}>Saved.</p>}
          <button type="submit" className="btn-solid" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
