"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button, Card, Empty, PageHeader } from "@/components/admin/ui";

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  handled: boolean;
  created_at: string;
};

export default function EnquiriesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHandled, setShowHandled] = useState(false);

  const load = () =>
    supabaseBrowser()
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setRows((data ?? []) as Row[]);
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  async function setHandled(id: string, handled: boolean) {
    const { error } = await supabaseBrowser().from("enquiries").update({ handled }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      setRows((r) => r.map((x) => (x.id === id ? { ...x, handled } : x)));
      toast.success(handled ? "Marked handled" : "Reopened");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabaseBrowser().from("enquiries").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const visible = showHandled ? rows : rows.filter((r) => !r.handled);
  const open = rows.filter((r) => !r.handled).length;

  return (
    <>
      <PageHeader
        title="Enquiries"
        description={`${open} open, ${rows.length} total. Submitted from the contact form and the Enquire Now dialog.`}
        action={
          <Button variant="ghost" onClick={() => setShowHandled((v) => !v)}>
            {showHandled ? "Hide handled" : "Show handled"}
          </Button>
        }
      />

      {visible.length === 0 && (
        <Empty>{rows.length === 0 ? "No enquiries yet." : "Nothing open — all caught up."}</Empty>
      )}

      <div className="space-y-3">
        {visible.map((r) => (
          <Card key={r.id} className={r.handled ? "opacity-60" : ""}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold">{r.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("en-IN")} · {r.source}
                </p>
                <p className="mt-3 text-sm whitespace-pre-wrap">{r.message}</p>
                <p className="mt-3 flex flex-wrap gap-4 text-sm">
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="text-primary hover:underline">
                      {r.phone}
                    </a>
                  )}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                      {r.email}
                    </a>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" onClick={() => setHandled(r.id, !r.handled)}>
                  <Check size={14} /> {r.handled ? "Reopen" : "Handled"}
                </Button>
                <Button variant="danger" aria-label="Delete" onClick={() => remove(r.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
