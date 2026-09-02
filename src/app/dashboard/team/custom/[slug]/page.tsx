import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PersonaChat } from "@/components/dashboard/PersonaChat";

/**
 * Chat page for one client-built custom agent, looked up by slug + the
 * caller's own client_id (RLS also enforces this at the DB layer). Reuses
 * PersonaChat with no `emoji` — custom agents get a text monogram instead
 * of a persona icon — and points it at the custom-agent chat route by id.
 */
export default async function CustomAgentChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: agent } = await supabase
    .from("custom_agents")
    .select("*")
    .eq("slug", slug)
    .eq("client_id", user.id)
    .maybeSingle();

  if (!agent) notFound();

  return (
    <div>
      <div className="dash-page-head">
        <h1>{agent.name}</h1>
        <p>{agent.title}</p>
      </div>
      <PersonaChat
        slug={agent.slug}
        name={agent.name}
        role={agent.title}
        apiPath={`/api/dashboard/custom-agents/${agent.id}/chat`}
      />
    </div>
  );
}
