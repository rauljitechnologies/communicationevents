"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryCategory, GalleryImage } from "@/lib/types";
import { Reveal } from "./motion-primitives";

const INITIAL = 6;

export function GallerySection({
  group,
  index,
  showAll = false,
}: {
  group: GalleryCategory;
  index: number;
  /** Category pages show every photo up front; the index page paginates. */
  showAll?: boolean;
}) {
  const [expanded, setExpanded] = useState(showAll);
  const [active, setActive] = useState<number | null>(null);
  const count = group.images.length;
  const shown = expanded ? group.images : group.images.slice(0, INITIAL);
  const hidden = count - shown.length;

  return (
    <section
      id={group.slug}
      className={`scroll-mt-24 py-[5svh] md:py-[7svh] ${
        index % 2 === 1 ? "dark-section on-dark" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-5">
            <div className="min-w-0">
              <span className="text-gold-gradient font-display text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-[clamp(1.6rem,3.6vw,2.6rem)]">{group.title}</h2>
              <p className="mt-3 max-w-xl text-base text-muted-foreground">{group.copy}</p>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-[0.75rem] tracking-[0.18em] text-muted-foreground uppercase">
              {count} {count === 1 ? "photo" : "photos"}
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${img.caption}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl"
            >
              <Image
                src={img.url}
                alt={`${group.title} — ${img.caption}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--navy-deep)] to-transparent p-3 text-left text-[0.72rem] tracking-[0.16em] text-white uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {img.caption}
              </span>
            </button>
          ))}
        </div>

        {!showAll && count > INITIAL && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full border border-primary px-7 py-3 text-[0.75rem] font-semibold tracking-[0.22em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {expanded ? "Show less" : `View more (${hidden})`}
            </button>
          </div>
        )}
      </div>

      <Lightbox
        images={group.images}
        index={active}
        title={group.title}
        onClose={() => setActive(null)}
        onIndex={setActive}
      />
    </section>
  );
}

function Lightbox({
  images,
  index,
  title,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const current = open ? images[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  // Arrow keys page through the set; Radix already handles Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[96vw] border-none bg-transparent p-0 shadow-none sm:max-w-4xl [&>button]:hidden">
        {current && (
          <div className="relative">
            <DialogTitle className="sr-only">{`${title} — ${current.caption}`}</DialogTitle>
            <Image
              src={current.url}
              alt={`${title} — ${current.caption}`}
              width={1600}
              height={1200}
              className="max-h-[80svh] w-full rounded-2xl object-contain"
            />
            <p className="mt-3 text-center text-sm tracking-[0.16em] text-white uppercase">
              {current.caption}
            </p>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 right-0 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white sm:-right-3"
            >
              <X size={18} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => step(-1)}
                  className="absolute top-1/2 left-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => step(1)}
                  className="absolute top-1/2 right-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
