"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { TaskBoard } from "@/components/dashboard/TaskBoard";

type ProjectStatus = "discovery" | "active" | "review" | "complete";

interface Project {
  id: string;
  name: string;
  brief: string;
  status: ProjectStatus;
  created_at: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ["discovery", "active", "review", "complete"];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/dashboard/projects/${id}`);
      if (res.ok) {
        const { project: data } = await res.json();
        setProject(data);
      } else {
        setProject(null);
      }
    }
    load();
  }, [id]);

  async function handleStatusChange(status: ProjectStatus) {
    if (!project) return;
    setStatusBusy(true);
    setStatusError(null);
    const res = await fetch(`/api/dashboard/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Failed to update status." }));
      setStatusError(error);
      setStatusBusy(false);
      return;
    }
    const { project: updated } = await res.json();
    setProject(updated);
    setStatusBusy(false);
  }

  if (project === undefined) {
    return (
      <div className="dash-list">
        <div className="skel skel-row" />
        <div className="skel skel-row" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="dash-empty">
        <div className="dash-empty-title">Project not found</div>
        <p>
          <Link href="/dashboard/projects">Back to projects</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>{project.name}</h1>
          <p>Created {new Date(project.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="content-card">
        <h3>Brief</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{project.brief}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Status</span>
          <select value={project.status} disabled={statusBusy} onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className={`pill pill-${project.status}`}>{project.status}</span>
        </div>
        {statusError && <div className="form-error">{statusError}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <Link href={`/dashboard/paid-media-plan?projectId=${project.id}`} className="btn-outline">
            Generate paid media plan
          </Link>
          <Link href={`/dashboard/outbound?projectId=${project.id}`} className="btn-outline">
            Draft outbound messaging
          </Link>
          <Link href={`/dashboard/ai-visibility?projectId=${project.id}`} className="btn-outline">
            Run AI visibility report
          </Link>
        </div>
      </div>

      <TaskBoard projectId={project.id} />
    </div>
  );
}
