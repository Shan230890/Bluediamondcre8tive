-- Blue Diamond Cre8tive — Platform task board (Your AI Team kanban)
-- Continues the sequence started in 0001_init.sql / 0002_idea_score.sql.
-- Single-tenant-per-client model: every row is scoped by client_id =
-- auth.uid(), no company layer, no human assignees (AI personas only).
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- tasks — one row per kanban card. Status is the column (open/done/dismissed);
-- assignee_persona_key is one of the six Cre8tive Team personas or null
-- (unassigned). ai_reply/ai_replied_at hold the persona's response inline —
-- no separate chat-thread table for this first version.
-- ---------------------------------------------------------------------------
create table tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  description text,

  status text not null default 'open' check (status in ('open', 'done', 'dismissed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,

  assignee_persona_key text check (assignee_persona_key in ('henry', 'harvey', 'ray', 'anna', 'scott', 'barry')),
  auto_run boolean not null default false,

  ai_reply text,
  ai_replied_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_client_id_idx on tasks(client_id);
create index tasks_client_id_status_idx on tasks(client_id, status);
create index tasks_client_id_auto_run_updated_at_idx on tasks(client_id, auto_run, updated_at);

-- ---------------------------------------------------------------------------
-- updated_at trigger — no shared trigger function exists yet in this
-- project's earlier migrations, so this defines its own (named so a later
-- migration can reuse it for other tables without a name collision).
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_set_updated_at
  before update on tasks
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — single-tenant-per-client, RLS scopes every row to
-- the caller directly via client_id = auth.uid() (no company layer).
-- ---------------------------------------------------------------------------
alter table tasks enable row level security;

create policy tasks_self_access on tasks
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());
