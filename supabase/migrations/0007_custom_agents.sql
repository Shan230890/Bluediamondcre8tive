-- Blue Diamond Cre8tive — client-built custom AI agents, locked to
-- marketing tasks only. Modeled on how Opsara built custom_agents, adapted
-- for this project's single-tenant-per-client model (no company_id, no
-- admin role split — one client owns their account) and for the hard
-- scope requirement: every custom agent's chat route enforces a
-- marketing-only guardrail at runtime (see
-- src/app/api/dashboard/custom-agents/[id]/chat/route.ts), not just in
-- copy. Reuses set_updated_at() defined in 0003_tasks.sql, does not
-- redefine it.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create table custom_agents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,

  slug text not null,
  name text not null,
  title text not null,
  mission text not null,
  system_prompt text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (client_id, slug)
);

create index custom_agents_client_id_idx on custom_agents(client_id);

create trigger custom_agents_set_updated_at
  before update on custom_agents
  for each row
  execute function set_updated_at();

alter table custom_agents enable row level security;

create policy custom_agents_self_access on custom_agents
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());
