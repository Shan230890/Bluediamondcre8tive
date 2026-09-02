"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, LayoutTemplate, Trash2, Plus } from "lucide-react";
import { TASK_TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/lib/task-templates/catalog";
import { PERSONA_SLUGS, PERSONAS, type PersonaSlug } from "@/lib/personas/blue-diamond";
import { PersonaAvatar } from "@/components/dashboard/PersonaAvatar";

/**
 * /dashboard/templates — searchable, filterable gallery of the curated task
 * template catalog (src/lib/task-templates/catalog.ts), plus a "Your
 * templates" section for the client's own saved custom templates (Part 4).
 * "Use this template" on either kind hands off to the existing new-task
 * form on /dashboard/tasks via a query param — no second task-creation UI.
 */

interface CustomTemplate {
  id: string;
  name: string;
  instructions: string;
  assignee_persona_key: PersonaSlug | null;
  created_at: string;
}

const EMPTY_CUSTOM_FORM = {
  name: "",
  instructions: "",
  assigneePersonaKey: "" as PersonaSlug | "",
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");

  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[] | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState(EMPTY_CUSTOM_FORM);
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/task-templates");
      if (res.ok) {
        const { templates } = await res.json();
        setCustomTemplates(templates ?? []);
      } else {
        setCustomTemplates([]);
      }
    }
    load();
  }, []);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TASK_TEMPLATES.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      const matchesSearch =
        !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  async function handleCreateCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customForm.name.trim() || !customForm.instructions.trim()) return;
    setCustomSubmitting(true);
    setCustomError(null);
    try {
      const res = await fetch("/api/dashboard/task-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customForm.name,
          instructions: customForm.instructions,
          assigneePersonaKey: customForm.assigneePersonaKey || undefined,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to save template." }));
        setCustomError(error);
        return;
      }
      const { template } = await res.json();
      setCustomTemplates((prev) => [template, ...(prev ?? [])]);
      setCustomForm(EMPTY_CUSTOM_FORM);
      setShowCustomForm(false);
    } finally {
      setCustomSubmitting(false);
    }
  }

  async function handleDeleteCustom(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/dashboard/task-templates/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCustomTemplates((prev) => (prev ?? []).filter((t) => t.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Templates</h1>
          <p>Start a task from a ready-made template, or save your own for the work you repeat most.</p>
        </div>
      </div>

      <div className="template-search-row">
        <div className="template-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search templates"
          />
        </div>
      </div>

      <div className="template-tabs" role="tablist" aria-label="Template categories">
        <button
          type="button"
          className={`template-tab ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`template-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <LayoutTemplate size={20} />
          </div>
          <div className="dash-empty-title">No templates match</div>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="dash-grid dash-grid-3" style={{ marginBottom: 40 }}>
          {filteredTemplates.map((t) => {
            const persona = PERSONAS[t.suggestedPersonaKey];
            return (
              <div className="content-card template-card" key={t.slug}>
                <div className="template-card-top">
                  <span className="template-category-tag">{t.category}</span>
                </div>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="template-card-bottom">
                  <span className="kanban-assignee">
                    <PersonaAvatar slug={persona.slug} name={persona.name} className="kanban-assignee-avatar" />
                    {persona.name}
                  </span>
                  <Link href={`/dashboard/tasks?template=${t.slug}`} className="btn-solid template-use-btn">
                    Use this template
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="dash-section-head" style={{ marginTop: 8 }}>
        <h3>Your templates</h3>
        <button type="button" className="btn-outline" onClick={() => setShowCustomForm((v) => !v)}>
          <Plus size={14} style={{ marginRight: 4 }} />
          Save a template
        </button>
      </div>
      <p className="form-note" style={{ marginTop: -8, marginBottom: 16 }}>
        Save your own reusable task templates, private to your account. This saves a template of
        instructions for your team to run, it does not create a new autonomous agent.
      </p>

      {showCustomForm && (
        <form className="kanban-new-task-panel" onSubmit={handleCreateCustom} style={{ maxWidth: 640 }}>
          <div className="field">
            <label htmlFor="custom-template-name">Name</label>
            <input
              id="custom-template-name"
              value={customForm.name}
              onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Weekly LinkedIn post from our blog"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="custom-template-instructions">Instructions</label>
            <textarea
              id="custom-template-instructions"
              rows={4}
              value={customForm.instructions}
              onChange={(e) => setCustomForm((f) => ({ ...f, instructions: e.target.value }))}
              placeholder="What should the assigned team member do every time this template is used?"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="custom-template-persona">Assignee</label>
            <select
              id="custom-template-persona"
              value={customForm.assigneePersonaKey}
              onChange={(e) => setCustomForm((f) => ({ ...f, assigneePersonaKey: e.target.value as PersonaSlug | "" }))}
            >
              <option value="">Unassigned</option>
              {PERSONA_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {PERSONAS[slug].name} — {PERSONAS[slug].role}
                </option>
              ))}
            </select>
          </div>
          {customError && <div className="form-error">{customError}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn-solid" disabled={customSubmitting}>
              {customSubmitting ? "Saving…" : "Save template"}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowCustomForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {customTemplates === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : customTemplates.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <LayoutTemplate size={20} />
          </div>
          <div className="dash-empty-title">No saved templates yet</div>
          <p>Save a template for a task you find yourself creating over and over.</p>
        </div>
      ) : (
        <div className="dash-grid dash-grid-3">
          {customTemplates.map((t) => {
            const persona = t.assignee_persona_key ? PERSONAS[t.assignee_persona_key] : null;
            return (
              <div className="content-card template-card" key={t.id}>
                <div className="template-card-top">
                  <span className="template-category-tag template-category-tag-custom">Your template</span>
                  <button
                    type="button"
                    className="template-delete-btn"
                    onClick={() => handleDeleteCustom(t.id)}
                    disabled={deletingId === t.id}
                    aria-label={`Delete ${t.name}`}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3>{t.name}</h3>
                <p>{t.instructions}</p>
                <div className="template-card-bottom">
                  <span className="kanban-assignee">
                    {persona ? (
                      <PersonaAvatar slug={persona.slug} name={persona.name} className="kanban-assignee-avatar" />
                    ) : (
                      <span className="kanban-assignee-avatar">—</span>
                    )}
                    {persona ? persona.name : "Unassigned"}
                  </span>
                  <Link href={`/dashboard/tasks?customTemplateId=${t.id}`} className="btn-solid template-use-btn">
                    Use this template
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
