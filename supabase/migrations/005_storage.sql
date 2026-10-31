-- One public bucket for all images. Use folders: products/, events/, games/
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "anyone views media" on storage.objects
  for select using (bucket_id = 'media');

create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
