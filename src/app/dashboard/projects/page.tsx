"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";

interface ProjectRow {
  id: string;
  name: string;
  status: "discovery" | "active" | "review" | "complete";
  task_count: number;
  done_count: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/projects");
      if (res.ok) {
        const { projects: data } = await res.json();
        setProjects(data);
      } else {
        setProjects([]);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Projects</h1>
          <p>Brief a project once, get a starter task list back, then work it on the board.</p>
        </div>
        <Link href="/dashboard/projects/new" className="btn-solid">
          <Plus size={15} style={{ marginRight: 4 }} />
          New project
        </Link>
      </div>

      {projects === null ? (
        <div className="dash-list">
          <div className="skel skel-row" />
          <div className="skel skel-row" />
          <div className="skel skel-row" />
        </div>
      ) : projects.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <FolderKanban size={20} />
          </div>
          <div className="dash-empty-title">No projects yet</div>
          <p>Create a project brief and your team will draft a starter task list.</p>
          <Link href="/dashboard/projects/new" className="btn-solid">
            New project
          </Link>
        </div>
      ) : (
        <div className="dash-list">
          {projects.map((p) => (
            <Link href={`/dashboard/projects/${p.id}`} className="dash-row" key={p.id} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="dash-row-icon">
                  <FolderKanban size={16} />
                </div>
                <div>
                  <div className="dash-row-title">{p.name}</div>
                  <div className="dash-row-sub">
                    {p.task_count} task{p.task_count === 1 ? "" : "s"} · {p.done_count} done
                  </div>
                </div>
              </div>
              <span className={`pill pill-${p.status}`}>{p.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
