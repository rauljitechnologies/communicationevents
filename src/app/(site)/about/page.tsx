import type { Metadata } from "next";
import Image from "next/image";
import { Contact } from "@/components/site/contact";
import { Parallax, Reveal, WordsReveal } from "@/components/site/motion-primitives";
import { contactLinks, getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Communication & Events, Kolkata",
  description:
    "Three decades of promotions, campaigns and mega events. Meet the founder and team behind Communication & Events, Kolkata.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Communication & Events",
    description:
      "30+ years of executing promotions, campaigns and mega events with national and international celebrities.",
  },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main>
      <section className="on-dark dark-section relative flex h-[70svh] items-end overflow-hidden">
        <Image
          src={settings.hero_poster}
          alt="Stage production by Communication & Events"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-veil)]" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 md:px-10">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)] leading-[1]">
            <WordsReveal text="Three decades of " />
            <span className="text-gold-gradient">unmatched execution</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-[5svh] md:gap-14 md:px-10 md:py-[8svh] lg:grid-cols-[1fr_0.8fr]">
        <Reveal>
          {settings.about_body.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-lg leading-relaxed text-foreground/90"
                  : "mt-6 leading-relaxed text-muted-foreground"
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Parallax distance={50}>
          <figure className="overflow-hidden rounded-sm border border-border">
            <Image
              src={settings.founder_image}
              alt={`${settings.founder_name}, founder of Communication & Events`}
              width={1024}
              height={1280}
              className="w-full object-cover"
            />
            <figcaption className="bg-card px-6 py-5">
              <p className="eyebrow">Our founder</p>
              <p className="mt-2 font-display text-xl font-bold">{settings.founder_name}</p>
            </figcaption>
          </figure>
        </Parallax>
      </section>

      <Contact settings={contactLinks(settings)} />
    </main>
  );
}
