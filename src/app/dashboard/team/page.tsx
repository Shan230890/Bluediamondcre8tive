import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PERSONA_SLUGS, PERSONAS } from "@/lib/personas/blue-diamond";
import { TiltCard } from "@/components/motion/TiltCard";

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
                <span className="persona-avatar">{persona.emoji}</span>
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
    </div>
  );
}
