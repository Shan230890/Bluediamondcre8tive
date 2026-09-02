import Link from "next/link";
import { TASK_TEMPLATES, type TemplateCategory } from "@/lib/task-templates/catalog";
import { PERSONAS } from "@/lib/personas/blue-diamond";

/**
 * Public-page teaser grid pulled live from the Part 1 curated catalog,
 * filtered to the categories a given /tools or /for page is about. No
 * persona first names here (marketing-page rule) — shows the persona's
 * role/department label instead, e.g. "Copywriter", not "Ray".
 *
 * Signed-out visitors can't reach /dashboard (middleware redirects to
 * /login), so each card links to /signup rather than the template itself.
 */
export function TemplateTeasers({ categories, limit = 4 }: { categories: TemplateCategory[]; limit?: number }) {
  const templates = TASK_TEMPLATES.filter((t) => categories.includes(t.category)).slice(0, limit);

  return (
    <div className="grid grid-2">
      {templates.map((t) => {
        const persona = PERSONAS[t.suggestedPersonaKey];
        return (
          <Link href="/signup" className="card reveal template-teaser-card" key={t.slug}>
            <span className="bdc-tag-chip">{t.category}</span>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <span className="template-teaser-role">Runs with your {persona.role}</span>
          </Link>
        );
      })}
    </div>
  );
}
