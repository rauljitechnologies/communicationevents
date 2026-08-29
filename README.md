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

4. Install the admin policies (`supabase/admin.sql`) and the media bucket
   (`supabase/storage.sql`) the same way, then load the starting content:

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
| Site & Stats | the home-page counters, phone/email/address, hero video + poster, founder photo, About copy |
| Services | full CRUD, bullet points, icon, order, publish toggle |
| Gallery | categories and the photos inside each one |
| Clients | logos, website links, order |
| Testimonials | quotes and attribution |
| Enquiries | leads from the site, mark handled or delete |

Saved edits reach the public site within `CONTENT_REVALIDATE_SECONDS`. The
**Publish now** button in the header flushes that cache immediately.

### Uploading images and video

Every image field in the admin has an **Upload file** button. Files go to the
public `media` bucket in Supabase Storage and the field is filled with the
resulting URL — no need to touch the repo. Covers the hero background video,
hero poster, founder photo, service images, client logos and gallery photos.

Limits: 100 MB per file; JPEG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM. Run
`supabase/storage.sql` once to create the bucket and its policies — public read,
admin-only write.

You can still paste a path (`/media/hero.jpg`, for files committed under
`public/media`) or any external https URL into the same box.

Note: replacing an image leaves the old file in the bucket. Storage rows can't
be deleted with SQL — use the Storage browser in the Supabase dashboard to
clear anything you no longer want.

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
Anything added later is uploaded straight from the admin panel into the
Supabase Storage `media` bucket — `next.config.ts` already allows remote https
images, so no rebuild is needed.

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
  components/admin/    admin shell, auth gate, media uploader, form primitives
  components/ui/       dialog + toaster primitives
  lib/
    content.ts         Supabase reads, caching, seed fallback
    seed-data.ts       canonical starting content
    supabase/          anon (read) and service-role (write) clients
    types.ts
supabase/
  schema.sql           tables, indexes, public RLS policies
  admin.sql            admins table, is_admin(), write policies
  storage.sql          public media bucket + admin-only upload policies
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

## Performance notes

- The hero loop is re-encoded to 1280px / CRF 30 / no audio track — 4.6 MB down
  to 0.49 MB. If you replace it, run it through the same treatment:
  `ffmpeg -i in.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 30 -preset slow -movflags +faststart -an out.mp4`
- The hero poster is the LCP element and loads with `priority`. The video is
  only attached once the browser goes idle, and is skipped entirely for
  `prefers-reduced-motion` or data-saver users.
- Measured on the production build: LCP 1.67 s, CLS 0, ~1 MB transferred.

## Deploying

Add the same environment variables in the hosting project's settings.
`NEXT_PUBLIC_SITE_URL` sets the canonical/sitemap host.

`NEXT_PUBLIC_*` values are normally inlined when `next build` runs, so a host
that builds without them ships a bundle with an undefined Supabase URL and the
admin fails with "Failed to fetch". To avoid depending on that, the admin
layout is `force-dynamic` and reads the Supabase values from the **runtime**
environment, handing them to the browser client. Setting the variables on the
host and restarting is enough — no rebuild required.

The public pages read Supabase server-side, so they pick up runtime values too.
# communicationevents
