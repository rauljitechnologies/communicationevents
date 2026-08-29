"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const LINE =
  "Delivering events with proven expertise, precision and scale. Crafted to inspire, engage and elevate every experience.";

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.35"] });
  const words = LINE.split(" ");

  return (
    <section ref={ref} className="grain relative dark-section on-dark py-[6svh] md:py-[11svh]">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-10">
        <p className="flex flex-wrap justify-center text-[clamp(1.5rem,4.2vw,3rem)] leading-[1.25] font-semibold">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(progress, range, [
    "oklch(0.72 0.02 260)",
    "oklch(0.96 0.008 260)",
  ]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.28em] font-display">
      {children}
    </motion.span>
  );
}
