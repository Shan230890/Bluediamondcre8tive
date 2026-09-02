import { Check } from "lucide-react";

/**
 * Guardrails checklist, structural pattern from the approved mockup
 * (`.guardrails` / `.guard-row`). The three claims are accurate to how this
 * product actually works: review-by-default, Vault sourcing discipline, and
 * a deliverable audit trail (see /dashboard/vault's legal-guardrail note and
 * the review-queue pattern for the underlying mechanics).
 */
const ROWS: string[] = [
  "Every draft defaults to review, nothing ships without a sign-off.",
  "Vault entries are sourced and dated, speculative claims are flagged, never stated as fact.",
  "Every Services deliverable keeps a record of who approved it, and when.",
];

export function Guardrails() {
  return (
    <div className="bdc-guardrails">
      {ROWS.map((row) => (
        <div className="bdc-guard-row" key={row}>
          <Check size={18} strokeWidth={2} />
          {row}
        </div>
      ))}
    </div>
  );
}
