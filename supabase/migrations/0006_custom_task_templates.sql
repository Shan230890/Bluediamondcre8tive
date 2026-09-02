-- Blue Diamond Cre8tive — custom task templates (client-saved, private)
-- Continues the sequence started in 0001_init.sql through 0005. This is the
-- honest adaptation of "create custom agents": a client can save their own
-- reusable task template (name, instructions, a chosen persona) — not an
-- autonomous agent-builder. Reuses set_updated_at() defined in 0003_tasks.sql,
-- does not redefine it.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create table task_templates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  instructions text not null,
  assignee_persona_key text check (assignee_persona_key in ('henry', 'harvey', 'ray', 'anna', 'scott', 'barry')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index task_templates_client_id_idx on task_templates(client_id);

create trigger task_templates_set_updated_at
  before update on task_templates
  for each row
  execute function set_updated_at();

alter table task_templates enable row level security;

create policy task_templates_self_access on task_templates
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());
