import { Check, X } from "lucide-react";

/**
 * "Who it's for / not a fit" self-qualifying section, Metaflow-style two
 * checklist columns, scoped to the Services tier per Shan's instruction
 * (this is a principal-led engagement qualifier, not a Platform pattern).
 */
const FIT: string[] = [
  "You want a marketing department's output without hiring one",
  "You'd rather one accountable principal own the work than manage freelancers yourself",
  "You can commit to a monthly cadence, not a one-off project",
  "You want everything reviewed by a person before it ships",
];

const NOT_FIT: string[] = [
  "You want the cheapest possible content mill, with no review step",
  "You need same-day turnaround with no onboarding call",
  "You're only looking for a one-time asset, not an ongoing engagement",
  "You want to bypass legal/compliance review on regulated claims",
];

export function QualifyGrid() {
  return (
    <div className="grid grid-2 bdc-qualify-grid">
      <div className="bdc-qualify-col bdc-qualify-yes">
        <h3>Services is a fit if</h3>
        <ul>
          {FIT.map((item) => (
            <li key={item}>
              <Check size={16} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bdc-qualify-col bdc-qualify-no">
        <h3>Not a fit if</h3>
        <ul>
          {NOT_FIT.map((item) => (
            <li key={item}>
              <X size={16} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
