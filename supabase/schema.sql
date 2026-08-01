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
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'in_progress', 'ready', 'delivered', 'blocked')),
  delivery_due_at timestamptz,
  delivery_completed_at timestamptz,
  delivery_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);

create index if not exists orders_status_expires_idx
  on public.orders (status, expires_at);

create index if not exists orders_delivery_status_idx
  on public.orders (delivery_status);

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
-- routes using the Supabase service-role key, which bypasses RLS. The policies
-- below are defense-in-depth: they let authenticated users READ their own rows
-- only, so any future client-side reads stay scoped per user.

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('report', 'audit', 'implementation', 'retest', 'other')),
  title text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'ready', 'delivered')),
  asset_url text,
  storage_path text,
  note text,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deliverables_order_idx
  on public.deliverables (order_id);

create index if not exists deliverables_user_created_idx
  on public.deliverables (user_id, created_at desc);

alter table public.deliverables enable row level security;

create or replace function public.set_deliverable_updated_at()
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

drop trigger if exists deliverables_set_updated_at on public.deliverables;
create trigger deliverables_set_updated_at
before update on public.deliverables
for each row execute function public.set_deliverable_updated_at();

drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "users read own deliverables" on public.deliverables;
create policy "users read own deliverables"
  on public.deliverables for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "users read own scans" on public.scans;
create policy "users read own scans"
  on public.scans for select
  to authenticated
  using (user_id = auth.uid());

-- Storage bucket for delivered reports/assets. Objects are stored under
-- deliverables/{user_id}/... so per-user RLS scopes reads. Uploads are
-- performed server-side with the service-role key.
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', true)
on conflict (id) do nothing;

drop policy if exists "users read own deliverable files" on storage.objects;
create policy "users read own deliverable files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'deliverables'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
