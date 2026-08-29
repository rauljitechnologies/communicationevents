-- Admin access control.
-- Run AFTER schema.sql. Safe to re-run.
--
-- Being signed in is NOT enough to write: a user must also be listed in
-- public.admins. That way, even if public sign-ups are ever left enabled,
-- a new account gets no write access.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- SECURITY DEFINER so the policies below can read this table without
-- recursing through its own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select to authenticated using (public.is_admin());

-- Full CRUD on every content table, admins only.
do $$
declare t text;
begin
  foreach t in array array[
    'services','clients','gallery_categories','gallery_images',
    'testimonials','site_settings'
  ] loop
    execute format('drop policy if exists "admins write" on public.%I', t);
    execute format(
      'create policy "admins write" on public.%I for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Admins can read and triage leads; the public still cannot read them at all.
drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());
