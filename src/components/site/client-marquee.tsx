"use client";

import Image from "next/image";
import type { Client } from "@/lib/types";
import { Reveal } from "./motion-primitives";

/** Infinite logo marquee. The list is duplicated so the loop has no seam. */
export function ClientMarquee({ clients }: { clients: Client[] }) {
  return (
    <div className="mt-[4svh] md:mt-[7svh]">
      <Reveal>
        <p className="eyebrow px-5 text-center md:px-10">Brands we have served</p>
      </Reveal>
      <div className="relative mt-8 overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--navy-deep)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--navy-deep)] to-transparent" />
        <div className="animate-marquee flex w-max gap-4">
          {[...clients, ...clients].map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="flex h-20 w-40 shrink-0 items-center justify-center rounded-sm bg-white/90 p-4 grayscale transition-all duration-500 hover:grayscale-0"
            >
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={160}
                height={80}
                aria-hidden={i >= clients.length}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
