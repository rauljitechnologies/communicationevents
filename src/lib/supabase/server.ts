import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

const usable = (v: string | undefined) => (v && !v.startsWith("your-") ? v : undefined);

/**
 * Write key, in order of preference:
 *   1. service_role — bypasses RLS, needed for anything beyond enquiries.
 *   2. publishable/anon — the "public submit enquiry" RLS policy permits the
 *      insert, so a project with no secret key still captures leads.
 */
const writeKey =
  usable(process.env.SUPABASE_SERVICE_ROLE_KEY) ??
  usable(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
  usable(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const serviceRoleConfigured =
  Boolean(url && writeKey) && !url!.includes("YOUR-PROJECT");

/** Server-only write client. Must never be imported into a Client Component. */
export function getServiceSupabase(): SupabaseClient | null {
  if (!serviceRoleConfigured) return null;
  return createClient(url!, writeKey!, { auth: { persistSession: false } });
}
