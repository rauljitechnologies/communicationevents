# Communication & Events — Next.js

Corporate event management site for Communication & Events, Kolkata. A full
Next.js 15 (App Router) rebuild of the Lovable/TanStack prototype, with
services, clients and the gallery driven by **Supabase** — content changes go
live without a rebuild or a redeploy.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint (next/core-web-vitals + next/typescript)
```

It runs immediately with no database: the content layer falls back to the
bundled seed content in `src/lib/seed-data.ts`.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste `supabase/schema.sql` → Run.
3. Copy `.env.example` to `.env.local` and fill in the three keys from
   **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

4. Install the admin policies (`supabase/admin.sql`) the same way, then load
   the starting content:

   ```bash
   npm run seed
   ```

   Prefer pasting SQL? Run `supabase/seed.sql` in the SQL editor instead
   (regenerate it any time with `npm run seed:sql`).

From then on, edit content in **Supabase Studio → Table Editor**. No code
change, no rebuild.

## Admin panel

`/admin` — sign in with a Supabase Auth account that is also listed in the
`admins` table. Sections:

| Page | Manages |
| --- | --- |
| Site & Stats | the home-page counters, phone/email/address, hero + founder media, About copy |
| Services | full CRUD, bullet points, icon, order, publish toggle |
| Gallery | categories and the photos inside each one |
| Clients | logos, website links, order |
| Testimonials | quotes and attribution |
| Enquiries | leads from the site, mark handled or delete |

Saved edits reach the public site within `CONTENT_REVALIDATE_SECONDS`. The
**Publish now** button in the header flushes that cache immediately.

### Admin access control

Signing in is not enough to write anything. Every write policy calls
`public.is_admin()`, which checks the caller's `auth.uid()` against the
`admins` table — so a stray sign-up gets read-only public access and nothing
more. Run `supabase/admin.sql` once to install this.

To add another admin: create the user (Supabase dashboard → Authentication →
Add user), then

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'them@example.com';
```

To remove one: `delete from public.admins where email = 'them@example.com';`

## What's dynamic

| Table | Drives | Add a row and you get |
| --- | --- | --- |
| `services` | `/services`, home grid | a new section on `/services` + a jump chip + a home grid card |
| `gallery_categories` + `gallery_images` | `/gallery` | a new gallery section with its own lightbox |
| `clients` | `/clients`, home marquee | a new logo tile |
| `testimonials` | home, `/clients` | a new quote card |
| `site_settings` | phone, email, address, hero video, founder, stats, About copy | site-wide edits |
| `enquiries` | contact form + nav dialog | every submitted lead, newest first |

Everything lives on single-page `/services` and `/gallery` routes — each
service and gallery category is a section with a `#slug` anchor and a jump chip
at the top. There are no per-item detail pages.

### How "no rebuild" works

Content pages revalidate every `CONTENT_REVALIDATE_SECONDS` (default 60). An
edit in Supabase appears within that window.

- Want it instant? Set `CONTENT_REVALIDATE_SECONDS=0` — every request reads
  live from Supabase.
- Want instant *and* cached? Set `REVALIDATE_SECRET` and point a Supabase
  **Database Webhook** at `POST /api/revalidate?secret=<secret>`. Each write
  then flushes the cache immediately.

### Adding new images

Local images live in `public/media` and are referenced as `/media/....`.
For images added later, upload to **Supabase Storage** (make the bucket public)
and paste the full `https://` URL into the `url` / `logo` / `image` column —
`next.config.ts` already allows remote https images.

## Routes

```
/                      home
/services              all services (one section + #anchor per row)
/gallery               all categories (one section + lightbox per row)
/clients               logo wall + testimonials
/about                 founder and story
/contact               enquiry form
/thank-you             post-submission (noindex)
/admin                 content manager (noindex, auth required)

/api/content           JSON feed of everything (?only=services|clients|gallery|testimonials|settings)
/api/enquiries         POST — writes a lead to Supabase
/api/revalidate        POST — webhook cache buster
/sitemap.xml           the six public pages
/robots.txt
```

## Project layout

```
src/
  app/
    (site)/            public marketing pages (nav + footer chrome)
    (admin)/admin/     content manager (its own chrome, no nav/footer)
    api/               enquiries, content feed, revalidate
  components/site/     page sections (hero, gallery, contact, nav, footer…)
  components/admin/    admin shell, auth gate, form primitives
  components/ui/       dialog + toaster primitives
  lib/
    content.ts         Supabase reads, caching, seed fallback
    seed-data.ts       canonical starting content
    supabase/          anon (read) and service-role (write) clients
    types.ts
supabase/
  schema.sql           tables, indexes, public RLS policies
  admin.sql            admins table, is_admin(), write policies
  seed.sql             generated starting rows
scripts/
  seed.mjs             pushes seed-data.ts into Supabase
  generate-seed-sql.mjs
public/media/          images and hero video
```

## Security notes

- Row Level Security is on for every table. The public anon key can read only
  rows where `published = true`, and can insert into `enquiries` but never read
  them back.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (`src/lib/supabase/server.ts`
  imports `server-only`). Never reference it from a Client Component.

## Deploying

Works on Vercel as-is. Add the same environment variables in the project
settings. `NEXT_PUBLIC_SITE_URL` sets the canonical/sitemap host.
# communicationevents
