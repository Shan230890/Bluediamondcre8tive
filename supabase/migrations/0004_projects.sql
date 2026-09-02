-- Blue Diamond Cre8tive — Projects + onboarding-to-final workflow
-- Continues the sequence started in 0001_init.sql / 0002_idea_score.sql /
-- 0003_tasks.sql. Single-tenant-per-client model: every row is scoped by
-- client_id = auth.uid(), no company layer.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects — one row per client project. A project is created from a brief
-- (the client's own words: goals, industry, audience, channels of interest),
-- an AI drafts starter tasks against it, and it moves discovery -> active ->
-- review -> complete as the client works the kanban board.
-- ---------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  brief text not null,
  status text not null default 'discovery' check (status in ('discovery', 'active', 'review', 'complete')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_client_id_idx on projects(client_id);
create index projects_client_id_status_idx on projects(client_id, status);

-- Reuses the set_updated_at() trigger function already defined in
-- 0003_tasks.sql — do not redefine it here.
create trigger projects_set_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- tasks — extend with an optional project link and a place to record what
-- actually happened once a task closes (execution memory, Part F).
-- ---------------------------------------------------------------------------
alter table tasks add column project_id uuid references projects(id) on delete set null;
alter table tasks add column outcome_note text;

create index tasks_project_id_idx on tasks(project_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — single-tenant-per-client, RLS scopes every row to
-- the caller directly via client_id = auth.uid() (no company layer).
-- ---------------------------------------------------------------------------
alter table projects enable row level security;

create policy projects_self_access on projects
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());
