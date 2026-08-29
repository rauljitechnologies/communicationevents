import { NextResponse } from "next/server";
import { getClients, getGallery, getServices, getSettings, getTestimonials } from "@/lib/content";

/**
 * Read-only JSON feed of everything the site renders. Handy for checking what
 * Supabase is actually returning, and for any future headless consumer.
 *
 *   /api/content            → everything
 *   /api/content?only=gallery
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const only = new URL(request.url).searchParams.get("only");

  const loaders = {
    services: getServices,
    clients: getClients,
    gallery: getGallery,
    testimonials: getTestimonials,
    settings: getSettings,
  } as const;

  if (only) {
    const loader = loaders[only as keyof typeof loaders];
    if (!loader) {
      return NextResponse.json(
        { error: `Unknown section. Try one of: ${Object.keys(loaders).join(", ")}` },
        { status: 400 },
      );
    }
    return NextResponse.json({ [only]: await loader() });
  }

  const [services, clients, gallery, testimonials, settings] = await Promise.all([
    getServices(),
    getClients(),
    getGallery(),
    getTestimonials(),
    getSettings(),
  ]);

  return NextResponse.json({ services, clients, gallery, testimonials, settings });
}
