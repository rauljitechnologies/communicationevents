import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { CreditLine } from "@/components/credit-line";
import { contactLinks } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";
import { LOGO, navLinks } from "./nav-links";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const contact = contactLinks(settings);

  return (
    <footer className="dark-section on-dark border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 md:px-10">
        <div>
          <Image
            src={LOGO}
            alt="Communication & Events logo"
            width={170}
            height={120}
            className="h-18 w-auto object-contain"
          />
          <p className="mt-5 max-w-xs text-base text-muted-foreground">
            Corporate event management company in Kolkata. Creating extraordinary events for over
            three decades.
          </p>
        </div>
        <div className="min-w-0 text-base">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label === "About" ? "About us" : l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 text-base">
          <p className="eyebrow">Reach us</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1 shrink-0 text-primary" />
              <span>{contact.address}</span>
            </li>
            <li className="flex min-w-0 items-start gap-2">
              <Mail size={16} className="mt-1 shrink-0 text-primary" />
              <a href={contact.emailHref} className="min-w-0 [overflow-wrap:anywhere] hover:text-primary">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-1 shrink-0 text-primary" />
              <a href={contact.phoneHref} className="hover:text-primary">
                {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-rule" />
      <CreditLine className="px-5 py-6 text-center text-xs text-muted-foreground md:px-10" />
    </footer>
  );
}
