"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LOGO, navLinks } from "./nav-links";
import { EnquiryDialog } from "./enquiry-dialog";

export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`on-dark fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-border bg-[color-mix(in_oklab,var(--navy-deep)_92%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-[color-mix(in_oklab,var(--navy-deep)_65%,transparent)] backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center" aria-label="Communication & Events home">
          <Image
            src={LOGO}
            alt="Communication & Events logo"
            width={150}
            height={106}
            priority
            className="h-14 w-auto object-contain md:h-16"
          />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-primary transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            );
          })}
          <button
            onClick={() => setEnquiryOpen(true)}
            className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-[1.04]"
          >
            Enquire Now
          </button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="on-dark overflow-hidden bg-[var(--navy-deep)] md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                setEnquiryOpen(true);
              }}
              className="text-left text-primary"
            >
              Enquire Now
            </button>
          </div>
        </motion.div>
      )}

      <EnquiryDialog open={enquiryOpen} onOpenChange={setEnquiryOpen} />
    </motion.header>
  );
}
