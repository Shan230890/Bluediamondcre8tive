import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PERSONA_SLUGS, PERSONAS } from "@/lib/personas/blue-diamond";
import { TiltCard } from "@/components/motion/TiltCard";
import { PersonaAvatar } from "@/components/dashboard/PersonaAvatar";

export default function TeamPage() {
  return (
    <div>
      <div className="dash-page-head">
        <h1>Your Cre8tive Team</h1>
        <p>Chat with the AI personas behind Blue Diamond Cre8tive&apos;s marketing team.</p>
      </div>

      <div className="dash-grid dash-grid-3">
        {PERSONA_SLUGS.map((slug) => {
          const persona = PERSONAS[slug];
          return (
            <Link key={slug} href={`/dashboard/team/${slug}`} style={{ display: "block" }}>
              <TiltCard tilt="flat" className="persona-card">
                <PersonaAvatar slug={persona.slug} name={persona.name} />
                <span className="persona-name">{persona.name}</span>
                <span className="persona-role">{persona.role}</span>
                <p className="persona-oneliner">{persona.oneLiner}</p>
                <span className="persona-card-arrow">
                  Start a chat <ArrowRight size={13} />
                </span>
              </TiltCard>
            </Link>
          );
        })}
      </div>

      <div className="dash-section-head" style={{ marginTop: 40 }}>
        <h3>Custom agents</h3>
      </div>
      <p className="form-note" style={{ marginBottom: 20 }}>
        Build your own AI agent for the marketing work your six-person team doesn&apos;t already cover.
        Custom agents can only help with marketing work for your business, no matter how a request is
        phrased.
      </p>
      <Link href="/dashboard/team/custom" style={{ display: "block" }}>
        <TiltCard tilt="flat" className="persona-card">
          <span className="persona-avatar monogram">
            <Plus size={22} />
          </span>
          <span className="persona-name">Manage custom agents</span>
          <span className="persona-role">Create, edit, and chat</span>
          <p className="persona-oneliner">
            Build a marketing specialist for the work your built-in team doesn&apos;t cover.
          </p>
          <span className="persona-card-arrow">
            View custom agents <ArrowRight size={13} />
          </span>
        </TiltCard>
      </Link>
    </div>
  );
}
