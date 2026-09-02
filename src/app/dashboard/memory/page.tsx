"use client";

import { useEffect, useState } from "react";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { PERSONAS, type PersonaSlug } from "@/lib/personas/blue-diamond";
import { PersonaAvatar } from "@/components/dashboard/PersonaAvatar";
import { FormattedAiText } from "@/lib/format/render-ai-text";

interface Task {
  id: string;
  title: string;
  status: "open" | "done" | "dismissed";
  assignee_persona_key: PersonaSlug | null;
  ai_reply: string | null;
  outcome_note: string | null;
  project_id: string | null;
  updated_at: string;
}

interface ProjectLite {
  id: string;
  name: string;
}

export default function ExecutionMemoryPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const [taskRes, projectRes] = await Promise.all([
        fetch("/api/dashboard/tasks"),
        fetch("/api/dashboard/projects"),
      ]);
      if (taskRes.ok) {
        const { tasks: data } = await taskRes.json();
        setTasks((data as Task[]).filter((t) => t.status === "done" || t.status === "dismissed"));
      } else {
        setTasks([]);
      }
      if (projectRes.ok) {
        const { projects: data } = await projectRes.json();
        const map: Record<string, string> = {};
        for (const p of data as ProjectLite[]) map[p.id] = p.name;
        setProjects(map);
      }
    }
    load();
  }, []);

  async function saveNote(taskId: string) {
    const note = noteDrafts[taskId]?.trim();
    if (!note) return;
    setSavingNote((prev) => ({ ...prev, [taskId]: true }));
    const res = await fetch(`/api/dashboard/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcomeNote: note }),
    });
    if (res.ok) {
      const { task: updated } = await res.json();
      setTasks((prev) => prev?.map((t) => (t.id === taskId ? { ...t, outcome_note: updated.outcome_note } : t)) ?? prev);
    }
    setSavingNote((prev) => ({ ...prev, [taskId]: false }));
  }

  const sorted = tasks ? [...tasks].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) : null;

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Execution Memory</h1>
          <p>A chronological record of closed work, what got done and what you learned from it.</p>
        </div>
      </div>

      {sorted === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <History size={20} />
          </div>
          <div className="dash-empty-title">Nothing closed yet</div>
          <p>Once you mark tasks done or dismissed, they&apos;ll build a record here.</p>
        </div>
      ) : (
        sorted.map((task) => {
          const persona = task.assignee_persona_key ? PERSONAS[task.assignee_persona_key] : null;
          const projectName = task.project_id ? projects[task.project_id] ?? "Project" : "No project";
          const isOpen = !!expanded[task.id];
          return (
            <div className="memory-entry" key={task.id}>
              <div className="memory-entry-head">
                <span className="memory-entry-title">{task.title}</span>
                <div className="memory-entry-badges">
                  <span className="memory-badge">{projectName}</span>
                  <span className="memory-badge">
                    {persona ? (
                      <>
                        <PersonaAvatar slug={persona.slug} name={persona.name} className="badge-avatar" />
                        {persona.name}
                      </>
                    ) : (
                      "Unassigned"
                    )}
                  </span>
                  <span className="memory-badge">{task.status}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 8px" }}>
                {new Date(task.updated_at).toLocaleString()}
              </p>

              {task.ai_reply && (
                <>
                  <button
                    type="button"
                    className="kanban-reply-toggle"
                    onClick={() => setExpanded((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                  >
                    {isOpen ? "Hide reply" : "Show reply"}
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {isOpen && (
                    <div className="kanban-reply-card">
                      <div className="kanban-reply-card-body">
                        <FormattedAiText text={task.ai_reply} />
                      </div>
                    </div>
                  )}
                  {!isOpen && <p style={{ fontSize: 13, color: "var(--muted)" }}>{task.ai_reply.slice(0, 140)}{task.ai_reply.length > 140 ? "…" : ""}</p>}
                </>
              )}

              {task.outcome_note ? (
                <div className="content-card" style={{ marginTop: 10, marginBottom: 0, background: "rgba(var(--accent-rgb), 0.05)" }}>
                  <strong style={{ fontSize: 12.5 }}>Result / learning</strong>
                  <p style={{ marginTop: 4 }}>{task.outcome_note}</p>
                </div>
              ) : (
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <input
                    value={noteDrafts[task.id] ?? ""}
                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [task.id]: e.target.value }))}
                    placeholder="Add a result/learning note"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={!noteDrafts[task.id]?.trim() || savingNote[task.id]}
                    onClick={() => saveNote(task.id)}
                  >
                    {savingNote[task.id] ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
