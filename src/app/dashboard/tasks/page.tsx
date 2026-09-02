"use client";

import { useEffect, useState } from "react";
import { TaskBoard } from "@/components/dashboard/TaskBoard";

export default function TasksPage() {
  const [projectOptions, setProjectOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/projects");
      if (res.ok) {
        const { projects } = await res.json();
        setProjectOptions((projects ?? []).map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Tasks</h1>
          <p>Assign real marketing work to your AI team and track it through to done.</p>
        </div>
      </div>
      <TaskBoard projectOptions={projectOptions} />
    </div>
  );
}
