-- Blue Diamond Cre8tive — Phase 1 core schema
-- Single-tenant-per-client model (not multi-company): every client-scoped
-- table is keyed directly by client_id = auth.uid(), no company layer.
-- This migration is written for review, NOT applied automatically — paste
-- into the Supabase SQL editor by hand.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  company text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- subscriptions — Silo 1 (services) and Silo 2 (vault) subscriptions
-- ---------------------------------------------------------------------------
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  silo text not null check (silo in ('services', 'vault')),
  tier text not null,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index subscriptions_client_id_idx on subscriptions(client_id);

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------
create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  status text not null default 'due' check (status in ('paid', 'due', 'overdue')),
  due_date date,
  created_at timestamptz not null default now()
);

create index invoices_client_id_idx on invoices(client_id);

-- ---------------------------------------------------------------------------
-- deliverables — content calendars, campaign assets, reports, etc.
-- ---------------------------------------------------------------------------
create table deliverables (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text,
  file_url text,
  created_at timestamptz not null default now()
);

create index deliverables_client_id_idx on deliverables(client_id);

-- ---------------------------------------------------------------------------
-- academy_products — Silo 3 catalogue (publicly readable)
-- ---------------------------------------------------------------------------
create table academy_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tier text not null check (tier in ('entry', 'flagship', 'premium')),
  price numeric not null,
  description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- academy_purchases
-- ---------------------------------------------------------------------------
create table academy_purchases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references academy_products(id) on delete cascade,
  purchased_at timestamptz not null default now()
);

create index academy_purchases_client_id_idx on academy_purchases(client_id);
create index academy_purchases_product_id_idx on academy_purchases(product_id);

-- ---------------------------------------------------------------------------
-- competitor_vault_entries — Silo 2 Competitor Intelligence Vault
--
-- IMPORTANT — legal guardrail: automated scraping of competitor websites has
-- an unresolved legal question (target sites' ToS may prohibit it). Entries
-- are sourced from manual/internal entry (an admin form, built in a later
-- phase) until that review clears automated collection. Do not wire this
-- table up to a live scraper before that sign-off.
-- ---------------------------------------------------------------------------
create table competitor_vault_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users(id) on delete cascade,
  competitor_name text not null,
  entry_type text not null check (entry_type in ('weekly_scan', 'monthly_review')),
  content text,
  white_space_notes text,
  created_at timestamptz not null default now()
);

create index competitor_vault_entries_client_id_idx on competitor_vault_entries(client_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — single-tenant-per-client, RLS scopes every row to
-- the caller directly via client_id = auth.uid() (no company layer).
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table invoices enable row level security;
alter table deliverables enable row level security;
alter table academy_products enable row level security;
alter table academy_purchases enable row level security;
alter table competitor_vault_entries enable row level security;

create policy profiles_self_access on profiles
  for all using (id = auth.uid());

create policy subscriptions_self_access on subscriptions
  for all using (client_id = auth.uid());

create policy invoices_self_access on invoices
  for all using (client_id = auth.uid());

create policy deliverables_self_access on deliverables
  for all using (client_id = auth.uid());

-- Catalogue is a public product listing — readable by anyone, including
-- signed-out visitors browsing /academy.
create policy academy_products_public_read on academy_products
  for select using (true);

create policy academy_purchases_self_access on academy_purchases
  for all using (client_id = auth.uid());

create policy competitor_vault_entries_self_access on competitor_vault_entries
  for all using (client_id = auth.uid());
