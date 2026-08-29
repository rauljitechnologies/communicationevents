import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { SupabaseConfig } from "@/components/admin/supabase-config";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Rendered per request so the Supabase values are read from the *runtime*
 * environment. That way setting them on the host is enough — no rebuild
 * needed, which matters on hosts that build without the env present.
 */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    "";

  return (
    <SupabaseConfig url={url} anonKey={anonKey}>
      <AdminShell>{children}</AdminShell>
    </SupabaseConfig>
  );
}
