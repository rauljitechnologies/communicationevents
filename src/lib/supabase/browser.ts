"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// NOTE: NEXT_PUBLIC_* values are inlined at BUILD time. If they are absent
// when `next build` runs, they are permanently undefined in the bundle — no
// amount of runtime configuration will fill them in.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const browserConfigured =
  Boolean(url && key) && url.startsWith("http") && !url.includes("YOUR-PROJECT");

/** What is missing, for the admin panel's setup message. */
export const missingEnv = [
  url ? null : "NEXT_PUBLIC_SUPABASE_URL",
  key ? null : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
].filter(Boolean) as string[];

let client: SupabaseClient | null = null;

/**
 * Browser client for the admin panel. The signed-in user's JWT is what unlocks
 * writes — RLS checks public.is_admin(), so this key alone can't change
 * anything. The session persists in localStorage across reloads.
 */
export function supabaseBrowser(): SupabaseClient {
  if (!browserConfigured) {
    throw new Error(
      `Supabase is not configured in this build. Missing: ${missingEnv.join(", ") || "valid NEXT_PUBLIC_SUPABASE_URL"}`,
    );
  }
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return client;
}

