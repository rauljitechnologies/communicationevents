import type { Enquiry } from "@/lib/types";

/** Posts an enquiry to the API route, which writes it to Supabase. */
export async function submitEnquiry(payload: Enquiry): Promise<void> {
  const res = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "" }));
    throw new Error(error || "We couldn't send that. Please try again or call us.");
  }
}
