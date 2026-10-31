create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled', 'shipped', 'delivered')),
  amount_total integer not null check (amount_total >= 0),   -- santim
  currency text not null default 'ETB',
  payment_provider text not null default 'chapa',
  tx_ref text unique,
  shipping_name text not null,
  shipping_phone text not null,
  shipping_city text not null,
  shipping_address text not null,
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  quantity integer not null check (quantity > 0)
);

create index order_items_order_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Customers can only READ their own orders. No insert/update policy:
-- only the backend (service role) creates or changes orders.
create policy "users read own orders" on public.orders
  for select to authenticated using (auth.uid() = user_id);

create policy "users read own order items" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read order items" on public.order_items
  for select to authenticated using (public.is_admin());

-- Called by the backend after Chapa confirms payment.
-- Marks the order paid and reduces stock in ONE step. Safe to call twice.
create or replace function public.fulfill_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer;
begin
  update public.orders
  set status = 'paid', paid_at = now()
  where id = p_order_id and status = 'pending';

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return false;
  end if;

  update public.products p
  set stock = greatest(p.stock - oi.quantity, 0)
  from public.order_items oi
  where oi.order_id = p_order_id and oi.product_id = p.id;

  return true;
end;
$$;

revoke execute on function public.fulfill_order(uuid) from public, anon, authenticated;
grant execute on function public.fulfill_order(uuid) to service_role;
