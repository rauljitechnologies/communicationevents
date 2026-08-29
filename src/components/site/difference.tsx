"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Parallax, Reveal, WordsReveal } from "./motion-primitives";

export function Difference({
  differences,
  process,
  image,
}: {
  differences: { title: string; copy: string }[];
  process: { title: string; copy: string }[];
  image: string;
}) {
  return (
    <section id="approach" className="relative overflow-hidden py-[5svh] md:py-[9svh]">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">The difference</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05]">
            <WordsReveal text="Our proven approach to creating exceptional corporate experiences." />
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-px">
            {differences.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ x: 14 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="group border-t border-border py-8"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-xs text-primary">0{i + 1}</span>
                    <div>
                      <h3 className="text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">
                        {d.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {d.copy}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Parallax distance={60} className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-sm border border-border">
              <Image
                src={image}
                alt="Corporate conference produced by Communication & Events"
                width={1200}
                height={1500}
                className="h-[75svh] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] to-transparent" />
            </div>
          </Parallax>
        </div>
      </div>

      <div className="mx-auto mt-[5svh] max-w-7xl px-5 md:mt-[9svh] md:px-10">
        <Reveal>
          <p className="eyebrow">The process</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05]">
            Four Ways To <span className="text-gold-gradient">Exceptional Experiences</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A proven process. Seamless execution. Memorable results.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} y={60}>
              <motion.div
                whileHover={{ y: -10, borderColor: "oklch(0.82 0.13 88 / 0.6)" }}
                className="glass-panel h-full rounded-sm p-7"
              >
                <span className="font-display text-4xl text-primary/30">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
