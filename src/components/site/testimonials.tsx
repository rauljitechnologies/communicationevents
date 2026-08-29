"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import type { Client, Testimonial } from "@/lib/types";
import { ClientMarquee } from "./client-marquee";
import { Reveal } from "./motion-primitives";

export function Testimonials({
  testimonials,
  clients,
}: {
  testimonials: Testimonial[];
  clients: Client[];
}) {
  return (
    <section
      id="clients"
      className="dark-section on-dark relative overflow-hidden py-[5svh] md:py-[9svh]"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">Client testimonials</p>
          <h2 className="mt-3 text-[clamp(1.9rem,4.6vw,3.4rem)]">
            Trusted by the brands <span className="text-gold-gradient">that expect more</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.12} y={60}>
              <motion.blockquote
                whileHover={{ y: -8 }}
                className="glass-panel flex h-full flex-col rounded-sm p-8"
              >
                <Quote className="text-primary" size={22} />
                <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{t.org}</p>
                </footer>
              </motion.blockquote>
            </Reveal>
          ))}
        </div>
      </div>

      <ClientMarquee clients={clients} />
    </section>
  );
}
