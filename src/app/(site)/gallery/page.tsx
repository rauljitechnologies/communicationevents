import type { Metadata } from "next";
import Link from "next/link";
import { GallerySection } from "@/components/site/gallery-section";
import { Reveal, WordsReveal } from "@/components/site/motion-primitives";
import { getGallery } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Event Gallery | Corporate, Exhibition & Activation Work",
  description:
    "Browse our event gallery by type — corporate events, festival activations, exhibitions, brand activations, roadshows and sports/CSR events across India.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Event Gallery | Communication & Events",
    description:
      "A visual archive of conferences, exhibitions, activations and roadshows produced by our Kolkata team.",
  },
};

export default async function GalleryPage() {
  const gallery = await getGallery();
  const total = gallery.reduce((n, g) => n + g.images.length, 0);

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-10">
        <Reveal>
          <p className="eyebrow">Our work</p>
          <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]">
            <WordsReveal text="The gallery of" />{" "}
            <span className="text-gold-gradient">moments made</span>
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Three decades of events, grouped by what we do best. {total} frames below — every one a
            room we designed, built and ran end to end.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {gallery.map((g) => (
              <a
                key={g.slug}
                href={`#${g.slug}`}
                className="rounded-full border border-border px-4 py-2 text-xs tracking-[0.16em] uppercase transition-colors hover:border-primary hover:text-primary"
              >
                {g.title}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {gallery.map((group, i) => (
        <GallerySection key={group.slug} group={group} index={i} />
      ))}

      <section className="mx-auto max-w-7xl px-5 py-[6svh] text-center md:px-10">
        <Reveal>
          <h2 className="text-[clamp(1.7rem,4vw,2.8rem)]">Your event belongs in this gallery</h2>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
          >
            Start your event
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
