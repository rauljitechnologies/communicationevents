-- Media uploads for the admin panel.
-- Run AFTER schema.sql and admin.sql. Safe to re-run.
--
-- Creates a public "media" bucket: anyone can read (the site serves these
-- images), only admins can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true,
  104857600,  -- 100 MB, enough for the hero loop video
  array[
    'image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml',
    'video/mp4','video/webm'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read"   on storage.objects;
drop policy if exists "media admin insert"  on storage.objects;
drop policy if exists "media admin update"  on storage.objects;
drop policy if exists "media admin delete"  on storage.objects;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
