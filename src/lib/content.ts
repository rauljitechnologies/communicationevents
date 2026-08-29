import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as seed from "./seed-data";
import type {
  Client,
  GalleryCategory,
  GalleryImage,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseReady =
  Boolean(SUPABASE_URL && SUPABASE_ANON) &&
  !SUPABASE_URL!.includes("YOUR-PROJECT") &&
  !SUPABASE_ANON!.startsWith("your-");

/**
 * How long a content page may serve cached Supabase data. Content edited in the
 * Supabase dashboard appears within this window with no rebuild and no deploy.
 * Set CONTENT_REVALIDATE_SECONDS=0 for always-fresh (fully dynamic) pages.
 */
export const revalidateSeconds = Number(process.env.CONTENT_REVALIDATE_SECONDS ?? 60);

let client: SupabaseClient | null = null;

function db(): SupabaseClient | null {
  if (!supabaseReady) return null;
  client ??= createClient(SUPABASE_URL!, SUPABASE_ANON!, {
    auth: { persistSession: false },
    global: {
      // Route every PostgREST call through Next's data cache so a burst of
      // requests hits Supabase once per revalidate window.
      fetch: (input, init) =>
        fetch(input as RequestInfo, {
          ...init,
          ...(revalidateSeconds > 0
            ? { next: { revalidate: revalidateSeconds, tags: ["content"] } }
            : { cache: "no-store" }),
        } as RequestInit),
    },
  });
  return client;
}

/**
 * Runs a Supabase query and falls back to the bundled seed content on any
 * failure (not configured, network down, empty table). The site never blanks
 * out because the database is unreachable.
 */
async function withFallback<T>(
  label: string,
  query: (sb: SupabaseClient) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  fallback: T[],
): Promise<T[]> {
  const sb = db();
  if (!sb) return fallback;
  try {
    const { data, error } = await query(sb);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return fallback;
    return data;
  } catch (err) {
    console.warn(`[content] ${label} fell back to seed data:`, (err as Error).message);
    return fallback;
  }
}

export async function getServices(): Promise<Service[]> {
  return withFallback<Service>(
    "services",
    (sb) =>
      sb
        .from("services")
        .select("slug, title, copy, image, icon, points, sort_order")
        .eq("published", true)
        .order("sort_order"),
    seed.services,
  );
}

export async function getClients(): Promise<Client[]> {
  return withFallback<Client>(
    "clients",
    (sb) =>
      sb
        .from("clients")
        .select("name, logo, website, sort_order")
        .eq("published", true)
        .order("sort_order"),
    seed.clients,
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return withFallback<Testimonial>(
    "testimonials",
    (sb) =>
      sb
        .from("testimonials")
        .select("quote, name, org, sort_order")
        .eq("published", true)
        .order("sort_order"),
    seed.testimonials,
  );
}

type CategoryRow = Omit<GalleryCategory, "images"> & {
  gallery_images: (GalleryImage & { published: boolean })[] | null;
};

export async function getGallery(): Promise<GalleryCategory[]> {
  const rows = await withFallback<CategoryRow>(
    "gallery",
    (sb) =>
      sb
        .from("gallery_categories")
        .select(
          "slug, title, copy, sort_order, gallery_images(url, caption, sort_order, published)",
        )
        .eq("published", true)
        .order("sort_order"),
    // Shape the seed data like a joined row so both paths share the mapper.
    seed.gallery.map((g) => ({
      ...g,
      gallery_images: g.images.map((i) => ({ ...i, published: true })),
    })),
  );

  return rows
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      copy: row.copy,
      sort_order: row.sort_order,
      images: (row.gallery_images ?? [])
        .filter((i) => i.published !== false)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ url, caption, sort_order }) => ({ url, caption, sort_order })),
    }))
    .filter((g) => g.images.length > 0);
}

export async function getSettings(): Promise<SiteSettings> {
  const sb = db();
  if (!sb) return seed.siteSettings;
  try {
    const { data, error } = await sb.from("site_settings").select("key, value");
    if (error) throw new Error(error.message);
    const overrides = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    return { ...seed.siteSettings, ...overrides };
  } catch (err) {
    console.warn("[content] settings fell back to seed data:", (err as Error).message);
    return seed.siteSettings;
  }
}

/** Convenience derived fields used across the nav, footer and contact blocks. */
export function contactLinks(s: SiteSettings) {
  return {
    ...s,
    phoneHref: `tel:+91${s.phone.replace(/\D/g, "").slice(-10)}`,
    emailHref: `mailto:${s.email}`,
  };
}

export const differences = seed.differences;
export const processSteps = seed.process;
