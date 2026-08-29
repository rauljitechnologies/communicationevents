"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Reveal, WordsReveal } from "./motion-primitives";

/** Compact, scannable services grid — every service visible at a glance. */
export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="services" className="bg-background py-[6svh] md:py-[9svh]">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">What we do</p>
              <h2 className="mt-3 max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05]">
                <WordsReveal text="Every Event Is A " />
                <span className="text-gold-gradient">Masterpiece</span>
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-primary px-6 py-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex"
            >
              All services <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i, 4) * 0.06}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <Link
                  href={`/services#${s.slug}`}
                  className="on-dark group relative block h-[34svh] min-h-[240px] overflow-hidden rounded-2xl border border-border"
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/55 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="font-display text-xs tracking-[0.3em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 flex items-center gap-2 text-xl font-bold">
                      {s.title}
                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {s.copy}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/services"
            className="flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase"
          >
            All services <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
