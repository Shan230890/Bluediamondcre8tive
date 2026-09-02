import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Product-screenshot showcase cards, embedded directly in the homepage
 * scroll rather than hidden behind a separate product page. Each pairs a
 * short pitch with a realistic mockup UI card built
 * from our own product's real shape (score axes, vault rows, academy
 * tiers, a principal-review stamp), all clearly illustrative.
 */

export function ScoreShowcase() {
  const axes = [
    { label: "Originality", value: 78 },
    { label: "Technical feasibility", value: 84 },
    { label: "AI-visibility", value: 61 },
    { label: "Competition", value: 55 },
    { label: "White space", value: 72 },
  ];
  return (
    <div className="bdc-showcase">
      <div className="bdc-showcase-copy">
        <h3>Cre8tive Score</h3>
        <p>
          Submit an idea and get an honest 0-100 read across five axes in about 30 seconds. Free,
          no account required.
        </p>
        <Link href="/tools/score" className="bdc-showcase-link">
          Score your idea free <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bdc-showcase-mock">
        <div className="bdc-mock-header">
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-url">cre8tivescore.com/result</span>
        </div>
        <div className="bdc-mock-body">
          <div className="bdc-mock-overall">
            <span className="bdc-mock-overall-num">71</span>
            <span className="bdc-mock-overall-label">Overall score</span>
          </div>
          {axes.map((a) => (
            <div className="bdc-mock-axis" key={a.label}>
              <span>{a.label}</span>
              <div className="bdc-mock-axis-track">
                <div className="bdc-mock-axis-fill" style={{ width: `${a.value}%` }} />
              </div>
            </div>
          ))}
          <p className="bdc-mock-truth">
            &ldquo;Solid technical footing, but three funded competitors already own this exact
            wedge. Sharpen the positioning before you build more.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

export function TaskBoardShowcase() {
  const rows = [
    { title: "Draft next week's email flow", role: "Copywriting agent", status: "Replied, awaiting review" },
    { title: "Redesign the pricing page hero", role: "Design agent", status: "In progress" },
    { title: "Check the new landing page copy", role: "Legal agent", status: "Auto-run, done" },
  ];
  return (
    <div className="bdc-showcase">
      <div className="bdc-showcase-copy">
        <h3>Your AI team, on a task board</h3>
        <p>
          The Platform isn&apos;t a chat window. Assign real marketing work, copy, design, video,
          legal review, code, to your AI team and track it on a kanban board from open to done. Every
          agent drafts a reply you review, or let a task auto-run straight to done.
        </p>
        <Link href="/dashboard/tasks" className="bdc-showcase-link">
          Open the task board <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bdc-showcase-mock">
        <div className="bdc-mock-header">
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-url">dashboard/tasks</span>
        </div>
        <div className="bdc-mock-body">
          {rows.map((row) => (
            <div className="bdc-mock-vault-row" key={row.title}>
              <CheckCircle2 size={16} />
              <div>
                <div className="bdc-mock-vault-name">{row.title}</div>
                <div className="bdc-mock-vault-change">
                  {row.role} · {row.status}
                </div>
              </div>
            </div>
          ))}
          <p className="bdc-mock-caption">Illustrative preview, not real client data.</p>
        </div>
      </div>
    </div>
  );
}

export function VaultShowcase() {
  const rows = [
    { name: "Acme Growth Co.", change: "Dropped entry tier from $79 to $59/mo", trend: "down" as const },
    { name: "Northwind Studio", change: "Launched a new landing page for their flagship offer", trend: "up" as const },
    { name: "Bright Signal Agency", change: "No pricing or positioning changes this week", trend: "flat" as const },
  ];
  const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  return (
    <div className="bdc-showcase bdc-showcase-reverse">
      <div className="bdc-showcase-copy">
        <h3>Competitor Intelligence Vault</h3>
        <p>
          Weekly scans and a monthly white-space review, tracked per competitor. Entries are added
          by hand by our team, not scraped, pending a legal review of target sites&apos; terms of
          service.
        </p>
        <Link href="/tools/vault" className="bdc-showcase-link">
          See the Vault preview <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bdc-showcase-mock">
        <div className="bdc-mock-header">
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-url">dashboard/vault</span>
        </div>
        <div className="bdc-mock-body">
          {rows.map((row) => {
            const Icon = trendIcon[row.trend];
            return (
              <div className="bdc-mock-vault-row" key={row.name}>
                <Icon size={16} />
                <div>
                  <div className="bdc-mock-vault-name">{row.name}</div>
                  <div className="bdc-mock-vault-change">{row.change}</div>
                </div>
              </div>
            );
          })}
          <p className="bdc-mock-caption">Illustrative preview, not real client data.</p>
        </div>
      </div>
    </div>
  );
}

export function AcademyShowcase() {
  const courses = [
    { name: "Content systems that don't burn you out", tag: "Flagship" },
    { name: "Positioning worksheet pack", tag: "Template" },
    { name: "Paid + organic launch playbook", tag: "Course" },
  ];
  return (
    <div className="bdc-showcase">
      <div className="bdc-showcase-copy">
        <h3>Marketing Academy</h3>
        <p>
          The exact playbooks we run for clients, packaged as courses and templates you can start
          today. Instant access, no cohort wait.
        </p>
        <Link href="/academy" className="bdc-showcase-link">
          Browse Academy <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bdc-showcase-mock">
        <div className="bdc-mock-header">
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-url">academy/library</span>
        </div>
        <div className="bdc-mock-body">
          {courses.map((c) => (
            <div className="bdc-mock-course-row" key={c.name}>
              <span className="bdc-mock-course-tag">{c.tag}</span>
              <span className="bdc-mock-course-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrincipalReviewShowcase() {
  return (
    <div className="bdc-showcase bdc-showcase-reverse">
      <div className="bdc-showcase-copy">
        <h3>Every deliverable, reviewed before it ships</h3>
        <p>
          This is the human-in-the-loop step behind the &ldquo;principal-reviewed&rdquo; claim, not
          just a line of copy. Nothing leaves the pipeline without a sign-off.
        </p>
        <Link href="/services" className="bdc-showcase-link">
          See how Services works <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bdc-showcase-mock">
        <div className="bdc-mock-header">
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-dot" />
          <span className="bdc-mock-url">dashboard/deliverables</span>
        </div>
        <div className="bdc-mock-body">
          <div className="bdc-mock-deliverable">
            <div className="bdc-mock-deliverable-title">Q3 content calendar — draft 2</div>
            <div className="bdc-mock-deliverable-stamp">
              <CheckCircle2 size={15} />
              Reviewed and approved by our principal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
