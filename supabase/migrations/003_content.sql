create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_om text,
  slug text not null unique,
  description text,
  description_om text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  city text,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create index events_starts_idx on public.events (starts_at);

create table public.game_guides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_om text,
  slug text not null unique,
  summary text,
  how_to_play text,
  history text,
  image_url text,
  video_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.game_guides enable row level security;

create policy "anyone reads published events" on public.events
  for select using (is_published = true);
create policy "anyone reads published games" on public.game_guides
  for select using (is_published = true);

create policy "admins manage events" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage games" on public.game_guides
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
