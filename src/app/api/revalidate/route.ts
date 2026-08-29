import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

/**
 * Flushes the cached Supabase content so edits appear immediately instead of
 * waiting out CONTENT_REVALIDATE_SECONDS.
 *
 * Two ways in:
 *   - Authorization: Bearer <supabase access token> from a signed-in admin
 *     (this is what the admin panel's "Publish now" button uses).
 *   - ?secret=<REVALIDATE_SECRET> for a Supabase Database Webhook.
 */
export const dynamic = "force-dynamic";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function isAdminToken(token: string): Promise<boolean> {
  if (!url || !anon) return false;
  const sb = createClient(url, anon, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: user } = await sb.auth.getUser(token);
  if (!user?.user) return false;
  const { data, error } = await sb.rpc("is_admin");
  return !error && data === true;
}

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const allowed =
    (Boolean(expected) && secret === expected) ||
    (Boolean(bearer) && (await isAdminToken(bearer!)));

  if (!allowed) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  revalidateTag("content");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
