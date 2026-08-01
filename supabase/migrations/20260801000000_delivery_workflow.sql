-- Delivery workflow migration (additive, idempotent, backward-compatible).
-- Adds delivery tracking to existing orders and introduces a deliverables
-- table, plus defense-in-depth RLS and a Storage bucket for delivered files.
-- No existing table is dropped or recreated; existing order rows are kept.

-- ---------------------------------------------------------------------------
-- 1. orders: delivery tracking columns
-- ---------------------------------------------------------------------------
alter table public.orders
  add column if not exists delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'in_progress', 'ready', 'delivered', 'blocked')),
  add column if not exists delivery_due_at timestamptz,
  add column if not exists delivery_completed_at timestamptz,
  add column if not exists delivery_note text;

-- Backfill: mark delivery as started for orders that were already paid before
-- this migration. Re-running is a no-op (only touches pending -> in_progress).
update public.orders
  set delivery_status = 'in_progress'
  where status = 'paid' and delivery_status = 'pending';

create index if not exists orders_delivery_status_idx
  on public.orders (delivery_status);

-- ---------------------------------------------------------------------------
-- 2. deliverables: per-order delivery tasks (report, audit, implementation...)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 3. RLS policies (defense-in-depth)
-- All writes still go through server routes using the service-role key, which
-- bypasses RLS. These policies only allow authenticated users to READ their
-- own rows, so any future client-side reads stay scoped per user.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 4. Storage: bucket for delivered reports/assets
-- Objects are stored under deliverables/{user_id}/... so per-user RLS can
-- scope reads. Uploads are performed server-side with the service-role key.
-- ---------------------------------------------------------------------------
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
