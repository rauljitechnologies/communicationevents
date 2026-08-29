"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { LOGO } from "@/components/site/nav-links";

const NEXT_STEPS = [
  {
    step: "01",
    title: "We review your brief",
    copy: "Our team studies your objectives, scale and timelines the same day.",
  },
  {
    step: "02",
    title: "We call you back",
    copy: "A producer reaches out within one working day to fill in the details.",
  },
  {
    step: "03",
    title: "You get a concept",
    copy: "A tailored creative approach with indicative costing follows shortly after.",
  },
];

export function ThankYou() {
  return (
    <main className="flex flex-col justify-center pt-28 pb-24">
      <section className="relative overflow-hidden">
        <div
          className="animate-glow pointer-events-none absolute top-0 left-1/2 -z-10 h-[50svh] w-[70vw] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10"
          >
            <Check className="text-primary" size={34} />
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.03]"
          >
            Thank you — <span className="text-gold-gradient">we&apos;ve got it</span>
          </motion.h1>
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-5 max-w-xl text-muted-foreground"
          >
            Your enquiry has reached our Kolkata studio. A member of the team will get back to you
            within one working day with the next steps.
          </motion.p>

          <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
            {NEXT_STEPS.map((n, i) => (
              <motion.div
                key={n.step}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.45 + i * 0.12 }}
                className="glass-panel rounded-sm p-6"
              >
                <span className="text-gold-gradient text-2xl">{n.step}</span>
                <h2 className="mt-2 text-lg">{n.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{n.copy}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="rounded-sm bg-primary px-8 py-4 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
            >
              Back to home
            </Link>
            <Link
              href="/services"
              className="rounded-sm border border-border px-8 py-4 text-xs font-bold tracking-[0.24em] uppercase transition-colors hover:border-primary hover:text-primary"
            >
              Explore our services
            </Link>
          </motion.div>

          <Image
            src={LOGO}
            alt="Communication & Events logo"
            width={160}
            height={113}
            className="mx-auto mt-16 h-14 w-auto object-contain opacity-40 invert dark:invert-0"
          />
        </div>
      </section>
    </main>
  );
}
