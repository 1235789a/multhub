create extension if not exists "pgcrypto";

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  website text not null,
  category text not null,
  score integer not null check (score between 0 and 100),
  verdict text not null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_created_idx
  on public.scans (user_id, created_at desc);

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists product_events_name_created_idx
  on public.product_events (name, created_at desc);

create index if not exists product_events_user_created_idx
  on public.product_events (user_id, created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  plan_id text not null check (plan_id in ('trial', 'baseline', 'audit', 'sprint')),
  plan_name text not null,
  amount_usdt numeric(12, 6) not null check (amount_usdt > 0),
  network text not null default 'TRON Mainnet',
  token_standard text not null default 'TRC20',
  receiving_address text not null,
  token_contract text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'expired', 'rejected')),
  project_name text not null,
  website text not null,
  category text not null,
  payment_txid text unique,
  payment_from text,
  last_verification_error text,
  expires_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);

create index if not exists orders_status_expires_idx
  on public.orders (status, expires_at);

create or replace function public.set_order_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_order_updated_at();

alter table public.scans enable row level security;
alter table public.product_events enable row level security;
alter table public.orders enable row level security;

-- The website reads and writes these tables only from authenticated server
-- routes using the Supabase service-role key. No public table policy is needed.
