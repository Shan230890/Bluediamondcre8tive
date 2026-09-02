"use client";

import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { ListTodo, Plus, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { PERSONA_SLUGS, PERSONAS, type PersonaSlug } from "@/lib/personas/blue-diamond";
import { DraggableCard, DroppableColumn } from "@/components/dashboard/Kanban";
import { PersonaAvatar } from "@/components/dashboard/PersonaAvatar";
import { FormattedAiText } from "@/lib/format/render-ai-text";
import { formatRelativeTime } from "@/lib/format";

/**
 * Shared kanban board, factored out of the original standalone
 * src/app/dashboard/tasks/page.tsx so /dashboard/tasks (all tasks) and
 * /dashboard/projects/[id] (a single project's board) render the same
 * primitives instead of two forks. `projectId` filters the fetched tasks
 * and is attached to anything created here; `projectOptions` (when passed)
 * adds a project picker to the new-task form for the unfiltered board.
 */

export type TaskStatus = "open" | "done" | "dismissed";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  assignee_persona_key: PersonaSlug | null;
  auto_run: boolean;
  ai_reply: string | null;
  ai_replied_at: string | null;
  project_id: string | null;
  outcome_note: string | null;
  created_at: string;
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "open", label: "To do" },
  { id: "done", label: "Done" },
  { id: "dismissed", label: "Dismissed" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium" as Priority,
  dueDate: "",
  assigneePersonaKey: "" as PersonaSlug | "",
  projectId: "" as string,
};

export function TaskBoard({
  projectId,
  projectOptions,
  initialPrefill,
}: {
  /** Filters fetched tasks to this project and attaches it to anything created here. */
  projectId?: string;
  /** When provided, the new-task form gets a project picker (used on the unfiltered /dashboard/tasks board). */
  projectOptions?: { id: string; name: string }[];
  /** Opens the new-task form pre-populated on mount — used by /dashboard/templates "use this template" links (?template=<slug>). */
  initialPrefill?: { title: string; description: string; assigneePersonaKey?: PersonaSlug };
}) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [showForm, setShowForm] = useState(!!initialPrefill);
  const [form, setForm] = useState(() =>
    initialPrefill
      ? {
          ...EMPTY_FORM,
          title: initialPrefill.title,
          description: initialPrefill.description,
          assigneePersonaKey: initialPrefill.assigneePersonaKey ?? "",
        }
      : EMPTY_FORM,
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedReply, setExpandedReply] = useState<Record<string, boolean>>({});
  const [assignState, setAssignState] = useState<Record<string, { persona: PersonaSlug | ""; autoRun: boolean; busy: boolean; error: string | null }>>({});

  useEffect(() => {
    async function load() {
      const url = projectId ? `/api/dashboard/tasks?projectId=${encodeURIComponent(projectId)}` : "/api/dashboard/tasks";
      const res = await fetch(url);
      if (res.ok) {
        const { tasks: data } = await res.json();
        setTasks(data);
      } else {
        setTasks([]);
      }
    }
    load();
  }, [projectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/dashboard/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          priority: form.priority,
          dueDate: form.dueDate || undefined,
          assigneePersonaKey: form.assigneePersonaKey || undefined,
          projectId: projectId || form.projectId || undefined,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to create task." }));
        setFormError(error);
        return;
      }
      const { task } = await res.json();
      setTasks((prev) => [task, ...(prev ?? [])]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;
    const current = tasks?.find((t) => t.id === taskId);
    if (!current || current.status === newStatus) return;

    setTasks((prev) => prev?.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)) ?? prev);

    const res = await fetch(`/api/dashboard/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setTasks((prev) => prev?.map((t) => (t.id === taskId ? { ...t, status: current.status } : t)) ?? prev);
    }
  }

  function getAssignState(taskId: string, task: Task) {
    return (
      assignState[taskId] ?? {
        persona: task.assignee_persona_key ?? "",
        autoRun: task.auto_run,
        busy: false,
        error: null,
      }
    );
  }

  async function handleAssign(task: Task) {
    const state = getAssignState(task.id, task);
    if (!state.persona) return;
    setAssignState((prev) => ({ ...prev, [task.id]: { ...state, busy: true, error: null } }));

    const res = await fetch(`/api/dashboard/tasks/${task.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaKey: state.persona, autoRun: state.autoRun }),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Assignment failed." }));
      setAssignState((prev) => ({ ...prev, [task.id]: { ...state, busy: false, error } }));
      return;
    }

    const { task: updated } = await res.json();
    setTasks((prev) => prev?.map((t) => (t.id === task.id ? updated : t)) ?? prev);
    setAssignState((prev) => ({ ...prev, [task.id]: { persona: state.persona, autoRun: state.autoRun, busy: false, error: null } }));
    setExpandedReply((prev) => ({ ...prev, [task.id]: true }));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button type="button" className="btn-solid" onClick={() => setShowForm((v) => !v)}>
          <Plus size={15} style={{ marginRight: 4 }} />
          New task
        </button>
      </div>

      {showForm && (
        <form className="kanban-new-task-panel" onSubmit={handleCreate}>
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Draft next week's email flow"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Give the assigned persona enough context to actually draft this."
            />
          </div>
          <div className="kanban-new-task-grid">
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="task-due">Due date</label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              value={form.assigneePersonaKey}
              onChange={(e) => setForm((f) => ({ ...f, assigneePersonaKey: e.target.value as PersonaSlug | "" }))}
            >
              <option value="">Unassigned</option>
              {PERSONA_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {PERSONAS[slug].name} — {PERSONAS[slug].role}
                </option>
              ))}
            </select>
          </div>
          {!projectId && projectOptions && projectOptions.length > 0 && (
            <div className="field">
              <label htmlFor="task-project">Project</label>
              <select
                id="task-project"
                value={form.projectId}
                onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
              >
                <option value="">No project</option>
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formError && <div className="form-error">{formError}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn-solid" disabled={submitting}>
              {submitting ? "Creating…" : "Create task"}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {tasks === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <ListTodo size={20} />
          </div>
          <div className="dash-empty-title">No tasks yet</div>
          <p>Create a task and hand it to a persona on your AI team to get a first draft.</p>
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <DroppableColumn key={col.id} id={col.id} label={col.label} count={colTasks.length}>
                  {colTasks.map((task) => {
                    const persona = task.assignee_persona_key ? PERSONAS[task.assignee_persona_key] : null;
                    const state = getAssignState(task.id, task);
                    const replyOpen = !!expandedReply[task.id];
                    return (
                      <DraggableCard key={task.id} id={task.id}>
                        <div className="kanban-card-top">
                          <span className="kanban-card-title">{task.title}</span>
                          <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
                        </div>
                        {task.description && <p className="kanban-card-desc">{task.description}</p>}
                        <div className="kanban-card-meta">
                          <span className="kanban-assignee">
                            {persona ? (
                              <PersonaAvatar slug={persona.slug} name={persona.name} className="kanban-assignee-avatar" />
                            ) : (
                              <span className="kanban-assignee-avatar">—</span>
                            )}
                            {persona ? persona.name : "Unassigned"}
                          </span>
                          {task.due_date && <span className="kanban-due">Due {new Date(task.due_date).toLocaleDateString()}</span>}
                        </div>

                        {task.ai_reply && (
                          <>
                            <button
                              type="button"
                              className="kanban-reply-toggle"
                              onClick={() => setExpandedReply((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                            >
                              <Sparkles size={12} />
                              Persona replied
                              {replyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                            {replyOpen && (
                              <div className="kanban-reply-card">
                                <div className="kanban-reply-card-header">
                                  {persona ? (
                                    <PersonaAvatar slug={persona.slug} name={persona.name} className="kanban-reply-card-avatar" />
                                  ) : (
                                    <span className="kanban-reply-card-avatar monogram">—</span>
                                  )}
                                  <span className="kanban-reply-card-name">{persona ? persona.name : "Unknown"}</span>
                                  <span className="kanban-reply-card-badge">Replied</span>
                                  {task.ai_replied_at && (
                                    <span className="kanban-reply-card-time">{formatRelativeTime(task.ai_replied_at)}</span>
                                  )}
                                </div>
                                <div className="kanban-reply-card-body">
                                  <FormattedAiText text={task.ai_reply} />
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {state.busy && state.persona && (
                          <div className="kanban-busy-row">
                            <PersonaAvatar
                              slug={PERSONAS[state.persona].slug}
                              name={PERSONAS[state.persona].name}
                              className="kanban-busy-avatar"
                            />
                            <span className="kanban-busy-label">{PERSONAS[state.persona].name} is working on this</span>
                          </div>
                        )}

                        <div className="kanban-assign-row" onPointerDown={(e) => e.stopPropagation()}>
                          <select
                            value={state.persona}
                            onChange={(e) =>
                              setAssignState((prev) => ({
                                ...prev,
                                [task.id]: { ...state, persona: e.target.value as PersonaSlug | "" },
                              }))
                            }
                          >
                            <option value="">Assign to…</option>
                            {PERSONA_SLUGS.map((slug) => (
                              <option key={slug} value={slug}>
                                {PERSONAS[slug].name}
                              </option>
                            ))}
                          </select>
                          <label className="kanban-auto-run-label">
                            <input
                              type="checkbox"
                              checked={state.autoRun}
                              onChange={(e) =>
                                setAssignState((prev) => ({ ...prev, [task.id]: { ...state, autoRun: e.target.checked } }))
                              }
                            />
                            Auto-run
                          </label>
                          <button
                            type="button"
                            className="btn-solid kanban-assign-btn"
                            disabled={!state.persona || state.busy}
                            onClick={() => handleAssign(task)}
                          >
                            {state.busy ? "Running…" : "Run"}
                          </button>
                        </div>
                        {state.error && <div className="kanban-card-error">{state.error}</div>}
                      </DraggableCard>
                    );
                  })}
                </DroppableColumn>
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}
