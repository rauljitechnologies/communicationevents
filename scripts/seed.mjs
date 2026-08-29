/**
 * Pushes src/lib/seed-data.ts into Supabase.
 *
 *   1. Run supabase/schema.sql in the Supabase SQL editor first.
 *   2. npm run seed
 *
 * Idempotent — re-running upserts the same rows rather than duplicating them.
 */
import { createClient } from "@supabase/supabase-js";
import * as seed from "../src/lib/seed-data.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || url.includes("YOUR-PROJECT") || key.startsWith("your-")) {
  console.error(
    "Missing Supabase credentials.\n" +
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, then re-run.",
  );
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function upsert(table, rows, onConflict) {
  const { error } = await sb.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ✓ ${table.padEnd(20)} ${rows.length} rows`);
}

async function main() {
  console.log("Seeding Supabase…");

  await upsert(
    "services",
    seed.services.map((s) => ({ ...s, published: true })),
    "slug",
  );

  await upsert(
    "clients",
    seed.clients.map((c) => ({ ...c, published: true })),
    "name",
  );

  await upsert(
    "gallery_categories",
    seed.gallery.map(({ slug, title, copy, sort_order }) => ({
      slug,
      title,
      copy,
      sort_order,
      published: true,
    })),
    "slug",
  );

  // Images have no natural key, so replace the set wholesale.
  const slugs = seed.gallery.map((g) => g.slug);
  const { error: delErr } = await sb.from("gallery_images").delete().in("category_slug", slugs);
  if (delErr) throw new Error(`gallery_images cleanup: ${delErr.message}`);

  const images = seed.gallery.flatMap((g) =>
    g.images.map((i) => ({ ...i, category_slug: g.slug, published: true })),
  );
  const { error: imgErr } = await sb.from("gallery_images").insert(images);
  if (imgErr) throw new Error(`gallery_images: ${imgErr.message}`);
  console.log(`  ✓ ${"gallery_images".padEnd(20)} ${images.length} rows`);

  const { error: tErr } = await sb.from("testimonials").delete().neq("quote", "");
  if (tErr) throw new Error(`testimonials cleanup: ${tErr.message}`);
  const { error: tinsErr } = await sb
    .from("testimonials")
    .insert(seed.testimonials.map((t) => ({ ...t, published: true })));
  if (tinsErr) throw new Error(`testimonials: ${tinsErr.message}`);
  console.log(`  ✓ ${"testimonials".padEnd(20)} ${seed.testimonials.length} rows`);

  await upsert(
    "site_settings",
    Object.entries(seed.siteSettings).map(([key, value]) => ({ key, value })),
    "key",
  );

  console.log("\nDone. Edit content in Supabase Studio — the site picks it up automatically.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
