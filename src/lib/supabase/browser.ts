"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

let client: SupabaseClient | null = null;

/**
 * Browser client for the admin panel. The signed-in user's JWT is what unlocks
 * writes — RLS checks public.is_admin(), so this key alone can't change
 * anything. The session persists in localStorage across reloads.
 */
export function supabaseBrowser(): SupabaseClient {
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return client;
}

export const browserConfigured = Boolean(url && key);
