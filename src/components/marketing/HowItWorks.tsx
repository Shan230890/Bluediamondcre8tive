/**
 * Shared "how it works" strip for the /tools and /for marketing pages. Four
 * steps, each the real flow the app actually has: a project brief, an
 * AI-drafted starter task list, the task board itself, and the execution
 * memory those closed tasks leave behind. No fabricated tool-call names or
 * fictional pipeline, this is the real product shape, built from the
 * existing Pattern E `.card`/`.icon-badge` tokens already used elsewhere on
 * these pages, no new CSS required.
 */
const STEPS = [
  {
    num: "1",
    label: "Brief",
    body: "Tell us your goals, industry, and audience once, in one project.",
  },
  {
    num: "2",
    label: "AI drafts starter tasks",
    body: "Your team turns the brief into a starter task list, ready to assign.",
  },
  {
    num: "3",
    label: "Task board",
    body: "Assign, work, and review each task on a kanban board from open to done.",
  },
  {
    num: "4",
    label: "Execution memory",
    body: "Every closed task keeps its result, so the next brief builds on it.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid grid-4">
      {STEPS.map((step) => (
        <div className="card reveal" key={step.num}>
          {/* icon-badge's default text color is var(--accent), which reads
              at ~2.6:1 against the tinted badge background, below WCAG AA
              for text. Override to the page's dark text color so the step
              number stays legible; the accent-tinted badge background still
              carries the brand color. */}
          <span className="icon-badge" style={{ color: "var(--text-dark)", fontWeight: 700 }} aria-hidden="true">
            {step.num}
          </span>
          <h3>{step.label}</h3>
          <p>{step.body}</p>
        </div>
      ))}
    </div>
  );
}
