import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal, WordsReveal } from "@/components/site/motion-primitives";
import { serviceIcon } from "@/components/site/service-icons";
import { getServices } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Services | Corporate Events, Exhibitions & Activations",
  description:
    "Corporate events, festival activations, exhibitions, brand activations, roadshows, sports & CSR events, trade activation and special assignments — planned and executed end to end from Kolkata.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Communication & Events",
    description:
      "Event services delivered end to end — from conferences and exhibitions to trade activation and special assignments.",
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-10">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]">
            <WordsReveal text="Our" /> <span className="text-gold-gradient">services</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {services.length} ways we bring brands to life — each one planned, produced and executed
            end to end by our Kolkata team.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => {
              const Icon = serviceIcon(s.icon);
              return (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-[0.16em] uppercase transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon size={14} className="shrink-0 text-primary" />
                  {s.title}
                </a>
              );
            })}
          </div>
        </Reveal>
      </section>

      {services.map((s, i) => {
        const Icon = serviceIcon(s.icon);
        const dark = i % 2 === 1;
        return (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 py-[5svh] md:py-[7svh] ${dark ? "dark-section on-dark" : ""}`}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 md:px-10 lg:grid-cols-2 lg:gap-14">
              <Reveal className={dark ? "lg:order-2" : ""}>
                <div className="relative h-[38svh] overflow-hidden rounded-2xl border border-border md:h-[52svh]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/40 text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-gold-gradient text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-4 text-[clamp(1.7rem,4vw,2.8rem)] leading-tight">{s.title}</h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {s.copy}
                  </p>

                  <ul className="mt-6 grid gap-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                          <Check size={14} />
                        </span>
                        <span className="min-w-0 text-base leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-7xl px-5 py-[6svh] text-center md:px-10">
        <Reveal>
          <h2 className="text-[clamp(1.7rem,4vw,2.8rem)]">
            Tell us what you&apos;re planning
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
          >
            Reach out
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
