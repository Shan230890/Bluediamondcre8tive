import { XCircle, CheckCircle2 } from "lucide-react";

const OLD_WAY = [
  "A dozen tabs open with a generic chat assistant, re-explaining the brief every time.",
  "A Notion doc of half-finished notes nobody else on the team can find.",
  "A spreadsheet tracking what's supposedly in progress, already out of date.",
  "No memory between sessions, every new chat starts from zero.",
];

const OUR_WAY = [
  "One project, holding the brief once, for every task that comes out of it.",
  "One task board, real named tasks assigned to a specific team member.",
  "Every closed task keeps its result and what you learned from it.",
  "A compounding execution-memory history, so decisions build on each other instead of resetting.",
];

/** Shared "old way vs our way" section for the /tools use-case pages —
 * describes Blue Diamond Cre8tive's real project/task/execution-memory
 * system, not fabricated infrastructure. */
export function OldWayNewWay() {
  return (
    <div className="bdc-compare-grid">
      <div className="card reveal bdc-compare-col bdc-compare-old">
        <h3>The old way</h3>
        {OLD_WAY.map((item) => (
          <div className="bdc-compare-item" key={item}>
            <XCircle size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="card reveal bdc-compare-col bdc-compare-new">
        <h3>Our way</h3>
        {OUR_WAY.map((item) => (
          <div className="bdc-compare-item" key={item}>
            <CheckCircle2 size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
