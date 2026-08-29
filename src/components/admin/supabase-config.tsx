"use client";

import type { ReactNode } from "react";
import { setSupabaseConfig } from "@/lib/supabase/browser";

/**
 * Hands the server's runtime Supabase values to the browser client. Set during
 * render (not in an effect) so children can use the client immediately.
 */
export function SupabaseConfig({
  url,
  anonKey,
  children,
}: {
  url: string;
  anonKey: string;
  children: ReactNode;
}) {
  setSupabaseConfig(url, anonKey);
  return <>{children}</>;
}
