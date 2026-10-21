
-- Run in the existing Supabase SQL editor before enabling public sharing.
-- Anonymous scans remain PRIVATE by default. Never add SELECT/INSERT
-- policies for anon or authenticated roles to this table.
create table if not exists public.hedgehog_reports (
  id uuid primary key default gen_random_uuid(),
  share_token_hash text not null check (length(share_token_hash) = 64),
  website text not null,
  project_name text not null,
  category text not null,
  score integer not null check (score between 0 and 100),
  scanned_at timestamptz not null default now(),
  signals jsonb not null,
  identity jsonb not null,
  published_at timestamptz,
  show_website boolean not null default false,
  show_brand boolean not null default false
);
create index if not exists hedgehog_reports_publish_idx
  on public.hedgehog_reports (published_at) where published_at is not null;
create index if not exists hedgehog_reports_website_date_idx
  on public.hedgehog_reports (website, scanned_at desc);
alter table public.hedgehog_reports enable row level security;
-- No anon SELECT policy: only the server service-role key can read a report.
