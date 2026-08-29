"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Card, PageHeader } from "@/components/admin/ui";

const TILES = [
  { href: "/admin/settings", label: "Site & Stats", blurb: "Counters, contact details, About copy" },
  { href: "/admin/services", label: "Services", table: "services" },
  { href: "/admin/gallery", label: "Gallery photos", table: "gallery_images" },
  { href: "/admin/clients", label: "Clients", table: "clients" },
  { href: "/admin/testimonials", label: "Testimonials", table: "testimonials" },
  { href: "/admin/enquiries", label: "Open enquiries", table: "enquiries", openOnly: true },
] as const;

export default function AdminHome() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const sb = supabaseBrowser();
    TILES.forEach((t) => {
      if (!("table" in t) || !t.table) return;
      let q = sb.from(t.table).select("*", { count: "exact", head: true });
      if ("openOnly" in t && t.openOnly) q = q.eq("handled", false);
      q.then(({ count }) => setCounts((c) => ({ ...c, [t.href]: count ?? 0 })));
    });
  }, []);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Edit anything here and it appears on the live site — no rebuild, no deploy."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="h-full transition hover:border-primary">
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {t.label}
              </p>
              {"table" in t && t.table ? (
                <p className="text-gold-gradient mt-2 font-display text-3xl">
                  {counts[t.href] ?? "—"}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-lg">How publishing works</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Saved changes reach the public site within 60 seconds on their own. To see them right
          away, hit <strong>Publish now</strong> in the header — it clears the cache immediately.
        </p>
      </Card>
    </>
  );
}
