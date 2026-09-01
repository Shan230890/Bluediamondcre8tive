import { Check, X, Minus } from "lucide-react";

type ChecklistItem = { label: string; state: "pass" | "fail" | "pending" };

const ICONS = { pass: Check, fail: X, pending: Minus };

/**
 * Quality-check checklist pattern (Metaflow's "Search intent matched /
 * Unsupported claims flagged / Human editor review required" card),
 * reskinned to Pattern E. Ties back to the site-wide AI-liability
 * disclaimer at /disclaimer — every AI-assisted draft is reviewed by a
 * person before it ships.
 */
export function QualityChecklist({ title, items }: { title: string; items: ChecklistItem[] }) {
  return (
    <div className="bdc-checklist-card">
      <h3>{title}</h3>
      <ul className="bdc-checklist">
        {items.map((item) => {
          const Icon = ICONS[item.state];
          return (
            <li key={item.label} className={`bdc-checklist-item bdc-checklist-${item.state}`}>
              <span className="bdc-checklist-icon">
                <Icon size={13} />
              </span>
              {item.label}
            </li>
          );
        })}
      </ul>
      <p className="bdc-checklist-footnote">
        See our <a href="/disclaimer">AI disclaimer</a> — every AI-assisted output is reviewed by a
        person, and errors are still possible.
      </p>
    </div>
  );
}
