-- Blue Diamond Cre8tive — AI Visibility Report + deliverables extension
-- Continues the sequence started in 0001_init.sql .. 0004_projects.sql.
-- Single-tenant-per-client model: every row is scoped by client_id =
-- auth.uid(), no company layer.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ai_visibility_reports — a client's own brand + up to 3 named competitors,
-- each scored with the existing scoreGeoAeo() simulation (src/lib/score/
-- scoring-geo-aeo.ts). This is the deep-dive AEO comparison, distinct from
-- the single-axis geoAeo score inside Cre8tive Score.
-- ---------------------------------------------------------------------------
create table ai_visibility_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,

  brand_name text not null,
  category text not null,
  value_proposition text,
  competitors text[] not null default '{}',

  own_result jsonb not null,
  competitor_results jsonb not null default '[]',

  created_at timestamptz not null default now()
);

create index ai_visibility_reports_client_id_idx on ai_visibility_reports(client_id);
create index ai_visibility_reports_client_id_created_at_idx on ai_visibility_reports(client_id, created_at);

alter table ai_visibility_reports enable row level security;

create policy ai_visibility_reports_self_access on ai_visibility_reports
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());

-- ---------------------------------------------------------------------------
-- deliverables — existing table from 0001_init.sql (id, client_id, title,
-- type, file_url, created_at) already has a "type" discriminator column but
-- no structured-content field. Extending it rather than adding a parallel
-- table: Part D (paid media plans) and Part E (outbound drafts) both produce
-- structured JSON, not a file, so a nullable `content` jsonb column plus an
-- optional project link covers both without a new table.
-- ---------------------------------------------------------------------------
alter table deliverables add column content jsonb;
alter table deliverables add column project_id uuid references projects(id) on delete set null;

create index deliverables_project_id_idx on deliverables(project_id);
