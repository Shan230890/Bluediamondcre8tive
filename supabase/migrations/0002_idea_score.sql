-- Blue Diamond Cre8tive — Cre8tive Score (free public idea/positioning scorer)
-- Continues the sequence started in 0001_init.sql.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

-- ---------------------------------------------------------------------------
-- idea_assessments — one row per scored submission. Single table holds the
-- scores, evidence blobs, and share-page content (mirrors the ported
-- scoring engine's source schema, not the projects/scores/share_cards
-- split from earlier architecture notes).
-- ---------------------------------------------------------------------------
create table idea_assessments (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid,                                              -- anonymous localStorage id, free-tier tracking pre-auth
  client_id uuid references auth.users(id) on delete set null,  -- set once the visitor is signed in
  email text,                                                   -- required at submission, scopes free-tier credits
  idea_name text not null,
  idea_description text not null,
  idea_url text,
  competitors text[] not null default '{}'::text[],

  score_overall integer not null check (score_overall between 0 and 100),
  score_originality integer not null check (score_originality between 0 and 100),
  score_technical integer not null check (score_technical between 0 and 100),
  score_geo_aeo integer not null check (score_geo_aeo between 0 and 100),
  score_competition integer not null check (score_competition between 0 and 100),
  score_gap integer not null check (score_gap between 0 and 100),

  brutal_truth text not null,
  share_slug text not null unique,
  scoring_version text not null default 'v1',

  extraction_json jsonb,
  originality_evidence jsonb,
  competition_evidence jsonb,
  geo_aeo_evidence jsonb,
  technical_evidence jsonb,
  gap_evidence jsonb,
  confidence_intervals jsonb,

  created_at timestamptz not null default now()
);

create index idea_assessments_visitor_id_idx on idea_assessments(visitor_id);
create index idea_assessments_client_id_idx on idea_assessments(client_id);
create index idea_assessments_email_idx on idea_assessments(email);
create index idea_assessments_share_slug_idx on idea_assessments(share_slug);
create index idea_assessments_created_at_idx on idea_assessments(created_at desc);

-- ---------------------------------------------------------------------------
-- RLS — public read (share pages are meant to be publicly viewable at their
-- share URL), writes are service-role only (no insert/update/delete policy
-- for anon/authenticated — matches how the rest of this app's cron/admin
-- writes go through src/lib/supabase/admin.ts).
-- ---------------------------------------------------------------------------
alter table idea_assessments enable row level security;

create policy "idea_assessments_public_read"
  on idea_assessments
  for select
  using (true);
