import { notFound } from "next/navigation";
import { getPersona } from "@/lib/personas/blue-diamond";
import { PersonaChat } from "@/components/dashboard/PersonaChat";
import { PERSONA_AVATAR_COLORS } from "@/lib/personas/avatar";

export default async function PersonaChatPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona: slug } = await params;
  const persona = getPersona(slug);
  if (!persona) notFound();

  return (
    <div>
      <div className="dash-page-head">
        <h1>{persona.name}</h1>
        <p>{persona.role}</p>
      </div>
      <PersonaChat
        slug={persona.slug}
        name={persona.name}
        role={persona.role}
        avatarColor={PERSONA_AVATAR_COLORS[persona.slug]}
      />
    </div>
  );
}
