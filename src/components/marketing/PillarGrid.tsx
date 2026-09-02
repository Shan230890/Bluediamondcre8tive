import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Users2, Scale, Radar } from "lucide-react";

type Pillar = { icon: LucideIcon; title: string; body: string };

/**
 * "The harness is the product" positioning grid — a 2x2 philosophy-cards
 * layout, filled with claims that are actually true of this system
 * (principal review step, six-persona
 * production team, Vault's manual-entry legal guardrail, real client
 * context in the dashboard) rather than invented capabilities.
 */
const PILLARS: Pillar[] = [
  {
    icon: ShieldCheck,
    title: "Principal-reviewed",
    body: "Nothing ships on a Services engagement until our principal signs off on strategy and quality, every time, not just on request.",
  },
  {
    icon: Users2,
    title: "AI product team",
    body: "Copy, design, and campaign work move through an AI-assisted production pipeline staffed by a real team, not a single prompt box.",
  },
  {
    icon: Scale,
    title: "Legal-safe by design",
    body: "The Vault's competitor entries are added by hand, not scraped, because target sites' terms of service haven't cleared legal review yet. We'd rather be slower and correct.",
  },
  {
    icon: Radar,
    title: "Real client context",
    body: "Your dashboard, deliverables, and Vault data all live in one account, so every recommendation is grounded in your actual brand, not a generic template.",
  },
];

export function PillarGrid() {
  return (
    <div className="grid grid-2 bdc-pillar-grid">
      {PILLARS.map((p) => (
        <div className="bdc-pillar-card" key={p.title}>
          <div className="bdc-pillar-icon">
            <p.icon size={20} />
          </div>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
}
