"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase config for the admin panel.
 *
 * NEXT_PUBLIC_* values are inlined when `next build` runs. On hosts where the
 * build happens without the environment set (Appwrite Cloud, for one), that
 * leaves the bundle with an undefined URL forever. So the admin layout reads
 * the values on the server at request time and injects them here — the
 * build-time values are only a fallback.
 */

const buildTime = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  key:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "",
};

let injected: { url: string; key: string } | null = null;
let client: SupabaseClient | null = null;

/** Called during render by <SupabaseConfig>, before any child uses the client. */
export function setSupabaseConfig(url: string, key: string) {
  const next = { url: url || buildTime.url, key: key || buildTime.key };
  if (injected && injected.url === next.url && injected.key === next.key) return;
  injected = next;
  client = null; // config changed — drop the memoised client
}

function config() {
  return injected ?? buildTime;
}

function valid(c: { url: string; key: string }) {
  return Boolean(c.url && c.key) && c.url.startsWith("http") && !c.url.includes("YOUR-PROJECT");
}

export function isSupabaseConfigured() {
  return valid(config());
}

/** Which values are still missing, for the admin panel's setup message. */
export function missingSupabaseEnv(): string[] {
  const c = config();
  return [
    c.url ? null : "NEXT_PUBLIC_SUPABASE_URL",
    c.key ? null : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean) as string[];
}

/**
 * Browser client for the admin panel. The signed-in user's JWT is what unlocks
 * writes — RLS checks public.is_admin(), so this key alone can't change
 * anything. The session persists in localStorage across reloads.
 */
export function supabaseBrowser(): SupabaseClient {
  const c = config();
  if (!valid(c)) {
    throw new Error(
      `Supabase is not configured. Missing: ${missingSupabaseEnv().join(", ") || "a valid NEXT_PUBLIC_SUPABASE_URL"}`,
    );
  }
  client ??= createClient(c.url, c.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return client;
}
