-- Any logged-in person can post foods, clothes, games and events.
-- Every post still waits for an admin to approve it before it appears on the site.
-- (The trigger from 006 keeps forcing: owner = the poster, status = draft/pending.)

do $$
declare t text;
begin
  foreach t in array array['products', 'events', 'game_guides'] loop
    execute format('drop policy if exists %I on public.%I', 'contributors add', t);
    execute format('drop policy if exists %I on public.%I', 'members add', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (auth.uid() is not null)', 'members add', t);
  end loop;
end $$;

-- Photos: any logged-in person may upload, but only into their own folder (media/<their id>/...)
drop policy if exists "contributors upload own media" on storage.objects;
drop policy if exists "members upload own media" on storage.objects;
create policy "members upload own media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'media'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
