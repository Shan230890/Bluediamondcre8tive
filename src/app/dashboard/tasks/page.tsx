"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { getTemplate } from "@/lib/task-templates/catalog";
import type { PersonaSlug } from "@/lib/personas/blue-diamond";

type Prefill = { title: string; description: string; assigneePersonaKey?: PersonaSlug } | undefined;

/**
 * Reads ?template=<curated-slug> or ?customTemplateId=<uuid> and turns it
 * into a prefill for TaskBoard's new-task form — the single wiring point
 * for "use this template" links from /dashboard/templates. Wrapped in
 * Suspense because useSearchParams requires it even in a client page.
 */
function TasksPageInner() {
  const searchParams = useSearchParams();
  const [projectOptions, setProjectOptions] = useState<{ id: string; name: string }[]>([]);
  const [prefill, setPrefill] = useState<Prefill>(undefined);
  const [prefillReady, setPrefillReady] = useState(false);

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

  useEffect(() => {
    async function resolvePrefill() {
      const templateSlug = searchParams.get("template");
      const customTemplateId = searchParams.get("customTemplateId");

      if (templateSlug) {
        const template = getTemplate(templateSlug);
        if (template) {
          setPrefill({ title: template.title, description: template.description, assigneePersonaKey: template.suggestedPersonaKey });
        }
      } else if (customTemplateId) {
        const res = await fetch("/api/dashboard/task-templates");
        if (res.ok) {
          const { templates } = await res.json();
          const match = (templates ?? []).find((t: { id: string }) => t.id === customTemplateId);
          if (match) {
            setPrefill({
              title: match.name,
              description: match.instructions,
              assigneePersonaKey: match.assignee_persona_key ?? undefined,
            });
          }
        }
      }
      setPrefillReady(true);
    }
    resolvePrefill();
    // Only ever resolved once on mount — the query string is a one-shot
    // hand-off, not a live-bound value the form should keep syncing to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Tasks</h1>
          <p>Assign real marketing work to your AI team and track it through to done.</p>
        </div>
      </div>
      {prefillReady && <TaskBoard projectOptions={projectOptions} initialPrefill={prefill} />}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksPageInner />
    </Suspense>
  );
}
