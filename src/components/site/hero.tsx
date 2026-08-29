"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { Stat } from "@/lib/types";
import { Counter } from "./counter";

export function Hero({
  video,
  poster,
  stats,
}: {
  video: string;
  poster: string;
  stats: Stat[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [playVideo, setPlayVideo] = useState(false);

  // The poster is the LCP element and paints immediately. The video is only
  // attached once the browser is idle, so it never competes with first paint —
  // and is skipped entirely for reduced-motion or data-saver users.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    const start = () => setPlayVideo(true);
    // `"requestIdleCallback" in window` would narrow window to never here,
    // since the property is always on the Window type. Check the value instead.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(start, 900);
    return () => window.clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.55, 0.9]);

  return (
    <>
      <section ref={ref} className="on-dark relative h-svh overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {playVideo && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video}
              poster={poster}
              preload="auto"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
          <motion.div
            style={{ opacity: veil }}
            className="absolute inset-0 bg-[var(--navy-deep)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[image:var(--gradient-veil)]" aria-hidden="true" />
        </motion.div>

        <motion.div
          style={{ y: yText, opacity }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 md:px-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="eyebrow"
          >
            Kolkata · Since 1994
          </motion.p>

          <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,8vw,6rem)] leading-[0.95]">
            {["Creating", "Memorable", "Events"].map((word, i) => (
              // The wrapper is the mask the word slides up behind. Its padding
              // gives descenders (the "g" in Creating) room inside the clip box;
              // the matching negative margin keeps the tight line spacing.
              <span key={word} className="-mb-[0.3em] block overflow-hidden pb-[0.3em]">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.13, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word === "Events" ? <span className="text-gold-gradient">Events</span> : word}
                </motion.span>
              </span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 1 }}
              className="mt-[0.3em] block text-[clamp(1.4rem,3.4vw,2.6rem)] font-light text-muted-foreground"
            >
              Since 1994
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9 }}
            className="mt-7 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            Corporate event management company in Kolkata. Creating extraordinary events.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-[var(--shadow-gold)]"
            >
              <span className="relative z-10">Reach out to us</span>
              <span className="absolute inset-0 -translate-x-full bg-[var(--gold-soft)] transition-transform duration-500 group-hover:translate-x-0" />
            </a>
            <a
              href="#services"
              className="rounded-sm border border-border px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:border-primary hover:text-primary"
            >
              What we do
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-primary"
          aria-hidden="true"
        >
          <ArrowDown size={18} />
        </motion.div>
      </section>

      <div className="relative z-20 px-5 pt-10 pb-12 md:px-10 md:pt-14 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl"
        >
          <div className="glass-panel flex flex-wrap items-center justify-around gap-6 rounded-sm px-6 py-8 shadow-[var(--shadow-lift)]">
            {stats.map((s, i) => (
              <StatBlock key={s.label} stat={s} showRule={i > 0} />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

function StatBlock({ stat, showRule }: { stat: Stat; showRule: boolean }) {
  return (
    <>
      {showRule && <span className="hidden h-10 w-px bg-border sm:block" />}
      <div className="text-center">
        <p className="font-display text-3xl text-primary md:text-4xl">
          <Counter to={stat.value} />
          {stat.suffix}
        </p>
        <p className="mt-1 text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          {stat.label}
        </p>
      </div>
    </>
  );
}
