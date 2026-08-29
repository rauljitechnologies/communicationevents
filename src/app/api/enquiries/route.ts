import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = { name: 120, phone: 40, email: 160, message: 4000, source: 60 };

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const enquiry = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    message: clean(body.message, MAX.message),
    source: clean(body.source, MAX.source) || "website",
  };

  if (!enquiry.name || !enquiry.message) {
    return NextResponse.json({ error: "Please add your name and a message." }, { status: 400 });
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return NextResponse.json({ error: "That email address looks wrong." }, { status: 400 });
  }

  const sb = getServiceSupabase();
  if (!sb) {
    // Supabase isn't wired up yet — don't lose the lead or block the user.
    console.warn("[enquiries] Supabase not configured; enquiry logged only:", enquiry);
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await sb.from("enquiries").insert(enquiry);
  if (error) {
    console.error("[enquiries] insert failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't save that. Please call us instead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
