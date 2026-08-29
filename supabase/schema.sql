-- Communication & Events — Supabase schema
-- Run once in Supabase Studio → SQL Editor → New query.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.

-- ---------------------------------------------------------------- services
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  copy        text not null default '',
  image       text not null default '',
  icon        text not null default 'Star',
  points      text[] not null default '{}',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------- clients
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  logo        text not null,
  website     text,
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------- gallery
create table if not exists public.gallery_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  copy        text not null default '',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  category_slug text not null references public.gallery_categories(slug)
                  on update cascade on delete cascade,
  url           text not null,
  caption       text not null default '',
  sort_order    int  not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists gallery_images_category_idx
  on public.gallery_images (category_slug, sort_order);

-- ------------------------------------------------------------ testimonials
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  name        text not null,
  org         text not null default '',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------- site settings
-- Key/value so new site-wide fields never need a migration.
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- --------------------------------------------------------------- enquiries
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null default '',
  email       text not null default '',
  message     text not null default '',
  source      text not null default 'website',
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------- RLS
alter table public.services           enable row level security;
alter table public.clients            enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_images     enable row level security;
alter table public.testimonials       enable row level security;
alter table public.site_settings      enable row level security;
alter table public.enquiries          enable row level security;

-- Anyone may read published content. Writes go through the service-role key
-- (the Supabase dashboard and `npm run seed`), which bypasses RLS.
do $$
declare t text;
begin
  foreach t in array array['services','clients','gallery_categories','gallery_images','testimonials'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format(
      'create policy "public read published" on public.%I for select using (published = true)', t);
  end loop;
end $$;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

-- Enquiries are write-only for the public: submit yes, read back no.
drop policy if exists "public submit enquiry" on public.enquiries;
create policy "public submit enquiry" on public.enquiries for insert with check (true);
