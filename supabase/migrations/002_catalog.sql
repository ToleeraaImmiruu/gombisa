create table public.categories (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('clothes', 'food', 'games')),
  name text not null,
  name_om text,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  name_om text,
  slug text not null unique,
  description text,
  description_om text,
  cultural_note text,
  origin_region text,
  maker_name text,
  price_cents integer not null check (price_cents >= 0),   -- santim (1 birr = 100)
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_active_idx on public.products (is_active, created_at desc);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;

create policy "anyone reads categories" on public.categories
  for select using (true);
create policy "anyone reads active products" on public.products
  for select using (is_active = true);

create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
