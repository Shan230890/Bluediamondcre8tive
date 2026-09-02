"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Pencil, ArrowRight } from "lucide-react";

interface CustomAgent {
  id: string;
  slug: string;
  name: string;
  title: string;
  mission: string;
  system_prompt: string;
  created_at: string;
}

const EMPTY_FORM = { name: "", title: "", mission: "", systemPrompt: "" };

const SYSTEM_PROMPT_PLACEHOLDER =
  "e.g. You specialize in on-page and technical SEO for service businesses. When asked, audit copy for target keywords, suggest title tags and meta descriptions, and recommend internal linking. You always ask which page or keyword the client wants to focus on before giving a recommendation.";

/**
 * /dashboard/team/custom — list of the client's own custom marketing
 * agents, plus a create form. Generalizes the Opsara custom_agents pattern
 * for this single-tenant app, with the addition Shan required: every agent
 * built here is locked to marketing tasks only (enforced in the chat route,
 * not just stated here — see src/lib/custom-agents/prompt.ts).
 */
export default function CustomAgentsPage() {
  const [agents, setAgents] = useState<CustomAgent[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/custom-agents");
      if (res.ok) {
        const { agents: data } = await res.json();
        setAgents(data ?? []);
      } else {
        setAgents([]);
      }
    }
    load();
  }, []);

  function startEdit(agent: CustomAgent) {
    setEditingId(agent.id);
    setForm({
      name: agent.name,
      title: agent.title,
      mission: agent.mission,
      systemPrompt: agent.system_prompt,
    });
    setShowForm(true);
    setFormError(null);
  }

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.mission.trim() || !form.systemPrompt.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(editingId ? `/api/dashboard/custom-agents/${editingId}` : "/api/dashboard/custom-agents", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          mission: form.mission,
          systemPrompt: form.systemPrompt,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to save agent." }));
        setFormError(error);
        return;
      }
      const { agent } = await res.json();
      setAgents((prev) => {
        const list = prev ?? [];
        if (editingId) {
          return list.map((a) => (a.id === agent.id ? agent : a));
        }
        return [agent, ...list];
      });
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/dashboard/custom-agents/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAgents((prev) => (prev ?? []).filter((a) => a.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Custom agents</h1>
          <p>Build your own AI agent for the marketing work you do most.</p>
        </div>
      </div>

      <p className="form-note" style={{ marginBottom: 20 }}>
        Custom agents can only help with marketing work for your business. They&apos;ll decline anything
        outside that, no matter how the request is phrased.
      </p>

      <div className="dash-section-head">
        <h3>Your agents</h3>
        <button type="button" className="btn-outline" onClick={showForm && !editingId ? () => setShowForm(false) : startCreate}>
          <Plus size={14} style={{ marginRight: 4 }} />
          {showForm && !editingId ? "Cancel" : "Create a custom agent"}
        </button>
      </div>

      {showForm && (
        <form className="kanban-new-task-panel" onSubmit={handleSubmit} style={{ maxWidth: 640, marginBottom: 32 }}>
          <div className="field">
            <label htmlFor="agent-name">Name</label>
            <input
              id="agent-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Sienna"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="agent-title">Title</label>
            <input
              id="agent-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. SEO Specialist"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="agent-mission">Mission</label>
            <input
              id="agent-mission"
              value={form.mission}
              onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
              placeholder="One or two sentences on what this agent is for."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="agent-system-prompt">System prompt</label>
            <textarea
              id="agent-system-prompt"
              rows={6}
              maxLength={4000}
              value={form.systemPrompt}
              onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
              placeholder={SYSTEM_PROMPT_PLACEHOLDER}
              required
            />
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn-solid" disabled={submitting}>
              {submitting ? "Saving…" : editingId ? "Save changes" : "Create agent"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {agents === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : agents.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-title">No custom agents yet</div>
          <p>Create one for a marketing specialty your six-person team doesn&apos;t already cover.</p>
        </div>
      ) : (
        <div className="dash-grid dash-grid-3">
          {agents.map((agent) => (
            <div className="content-card template-card" key={agent.id}>
              <div className="template-card-top">
                <span className="template-category-tag template-category-tag-custom">Custom agent</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="template-delete-btn"
                    onClick={() => startEdit(agent)}
                    aria-label={`Edit ${agent.name}`}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="template-delete-btn"
                    onClick={() => handleDelete(agent.id)}
                    disabled={deletingId === agent.id}
                    aria-label={`Delete ${agent.name}`}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3>{agent.name}</h3>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{agent.title}</p>
              <p>{agent.mission}</p>
              <div className="template-card-bottom">
                <Link href={`/dashboard/team/custom/${agent.slug}`} className="btn-solid template-use-btn">
                  Chat <ArrowRight size={13} style={{ marginLeft: 4 }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
