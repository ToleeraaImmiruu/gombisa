-- ROLES: customer (default), contributor (can add own content), admin (everything)
-- Contributors add foods, clothes, games and events. Their work is reviewed by an admin
-- before it appears on the site, and they can only edit or delete their own items.

-- ===== 1. Roles on profiles =====
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('customer', 'contributor', 'admin'));

alter table public.profiles add column if not exists wants_contributor boolean not null default false;
grant update (wants_contributor) on public.profiles to authenticated;   -- a user may ask, never self-promote

drop policy if exists "admins read profiles" on public.profiles;
create policy "admins read profiles" on public.profiles
  for select to authenticated using (public.is_admin());

create or replace function public.is_contributor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('contributor', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, wants_contributor)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'wants_contributor', '') = 'true'
  );
  return new;
end;
$$;

-- ===== 2. Deleting a person must not delete order history =====
alter table public.orders alter column user_id drop not null;
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete set null;

-- ===== 3. Rules enforced on products, events and games =====
create or replace function public.enforce_content_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_stock_only boolean := false;
begin
  -- Requests from the website carry a user. The backend (service role) has none and is trusted.
  if v_uid is not null then
    if not public.is_admin() then
      if tg_op = 'INSERT' then
        new.owner_id := v_uid;
        new.status := case when new.status = 'draft' then 'draft' else 'pending' end;
        if tg_table_name = 'products' then
          new.is_featured := false;                    -- only admins feature products
        end if;
      else
        new.owner_id := old.owner_id;                  -- ownership can never be changed
        new.rejection_note := old.rejection_note;
        if tg_table_name = 'products' then
          new.is_featured := old.is_featured;
          -- a stock-only change does not need a new review
          v_stock_only :=
                (to_jsonb(new) ->> 'stock') is distinct from (to_jsonb(old) ->> 'stock')
            and new.status = old.status
            and (to_jsonb(new) - 'stock' - 'updated_at' - 'is_active')
              = (to_jsonb(old) - 'stock' - 'updated_at' - 'is_active');
        end if;
        if not v_stock_only then
          new.status := case when new.status = 'draft' then 'draft' else 'pending' end;
        end if;
      end if;
    elsif tg_op = 'INSERT' and new.owner_id is null then
      new.owner_id := v_uid;
    end if;
  end if;

  -- keep the older visibility flags in step with status
  if tg_table_name = 'products' then
    new.is_active := (new.status = 'published');
  else
    new.is_published := (new.status = 'published');
  end if;
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['products', 'events', 'game_guides'] loop
    execute format('alter table public.%I add column if not exists owner_id uuid references auth.users(id) on delete set null', t);
    execute format('alter table public.%I add column if not exists status text not null default %L', t, 'published');
    execute format('alter table public.%I add column if not exists rejection_note text', t);
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_status_check');
    execute format('alter table public.%I add constraint %I check (status in (''draft'',''pending'',''published'',''rejected''))', t, t || '_status_check');
    execute format('create index if not exists %I on public.%I (owner_id)', t || '_owner_idx', t);
    execute format('drop trigger if exists %I on public.%I', 'content_rules_' || t, t);
    execute format('create trigger %I before insert or update on public.%I for each row execute function public.enforce_content_rules()', 'content_rules_' || t, t);
  end loop;
end $$;

-- ===== 4. Who can see and change what =====
drop policy if exists "anyone reads active products" on public.products;
drop policy if exists "admins manage products" on public.products;
drop policy if exists "anyone reads published events" on public.events;
drop policy if exists "admins manage events" on public.events;
drop policy if exists "anyone reads published games" on public.game_guides;
drop policy if exists "admins manage games" on public.game_guides;

do $$
declare t text;
begin
  foreach t in array array['products', 'events', 'game_guides'] loop
    execute format('drop policy if exists %I on public.%I', 'read published or own', t);
    execute format('drop policy if exists %I on public.%I', 'contributors add', t);
    execute format('drop policy if exists %I on public.%I', 'owners and admins edit', t);
    execute format('drop policy if exists %I on public.%I', 'owners and admins delete', t);
    execute format('create policy %I on public.%I for select using (status = ''published'' or owner_id = auth.uid() or public.is_admin())', 'read published or own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_contributor())', 'contributors add', t);
    execute format('create policy %I on public.%I for update to authenticated using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin())', 'owners and admins edit', t);
    execute format('create policy %I on public.%I for delete to authenticated using (owner_id = auth.uid() or public.is_admin())', 'owners and admins delete', t);
  end loop;
end $$;

-- ===== 5. Images: contributors may use only their own folder (media/<their id>/...) =====
drop policy if exists "admins upload media" on storage.objects;
drop policy if exists "admins update media" on storage.objects;
drop policy if exists "admins delete media" on storage.objects;

drop policy if exists "contributors upload own media" on storage.objects;
create policy "contributors upload own media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'media' and public.is_contributor()
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "contributors update own media" on storage.objects;
create policy "contributors update own media" on storage.objects
  for update to authenticated using (
    bucket_id = 'media'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "contributors delete own media" on storage.objects;
create policy "contributors delete own media" on storage.objects
  for delete to authenticated using (
    bucket_id = 'media'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
