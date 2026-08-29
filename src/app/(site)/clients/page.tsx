import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Counter } from "@/components/site/counter";
import { Reveal, WordsReveal } from "@/components/site/motion-primitives";
import { getClients, getTestimonials } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Clients | Brands We Have Worked With",
  description:
    "Pepsi, Nestlé, ITC, Reliance, HP, Nokia, ICICI, HDFC, Airtel and more — 100+ brands trust Communication & Events for their corporate events.",
  alternates: { canonical: "/clients" },
  openGraph: {
    title: "Clients | Communication & Events",
    description: "100+ brands across FMCG, banking, telecom, media and manufacturing.",
  },
};

const STATS = [
  { value: 1000, suffix: "+", label: "Events delivered" },
  { value: 100, suffix: "+", label: "Brands served" },
  { value: 30, suffix: "+", label: "Years of experience" },
  { value: 25, suffix: "+", label: "Cities covered" },
];

export default async function ClientsPage() {
  const [clients, testimonials] = await Promise.all([getClients(), getTestimonials()]);

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-10">
        <Reveal>
          <p className="eyebrow">Clients</p>
          <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]">
            <WordsReveal text="Trusted by" />{" "}
            <span className="text-gold-gradient">100+ brands</span>
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Three decades of partnerships across FMCG, banking, telecom, media, energy and
            manufacturing — from single-city launches to multi-city national campaigns.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-3 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-border pt-4">
              <p className="text-gold-gradient text-[clamp(1.8rem,4vw,3rem)]">
                <Counter to={s.value} />
                {s.suffix}
              </p>
              <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark-section on-dark py-[5svh] md:py-[8svh]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden border border-border bg-border px-0 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c, i) => {
            const logo = (
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={200}
                height={100}
                className="max-h-14 w-auto object-contain opacity-80 grayscale transition duration-500 hover:scale-110 hover:opacity-100 hover:grayscale-0"
              />
            );
            return (
              <Reveal key={c.name} delay={(i % 4) * 0.05}>
                <div className="flex h-32 items-center justify-center bg-white p-6">
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noopener noreferrer">
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-[5svh] md:px-10 md:py-[8svh]">
        <Reveal>
          <p className="eyebrow">In their words</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.08}>
              <figure className="glass-panel h-full rounded-sm p-7">
                <blockquote className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  {t.name} — {t.org}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <Link
            href="/contact"
            className="mt-14 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
          >
            Work with us
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
