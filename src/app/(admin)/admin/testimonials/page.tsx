"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button, Card, Empty, Input, PageHeader, Textarea, Toggle } from "@/components/admin/ui";

type Row = {
  id?: string;
  quote: string;
  name: string;
  org: string;
  sort_order: number;
  published: boolean;
};

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    supabaseBrowser()
      .from("testimonials")
      .select("id, quote, name, org, sort_order, published")
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setRows((data ?? []) as Row[]);
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const patch = (i: number, p: Partial<Row>) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...p } : row)));

  async function saveRow(i: number) {
    const row = rows[i];
    if (!row.quote.trim()) return toast.error("A quote is required.");
    const sb = supabaseBrowser();
    // No natural key here, so insert when new and update by id when existing.
    const { error } = row.id
      ? await sb.from("testimonials").update(row).eq("id", row.id)
      : await sb.from("testimonials").insert(row);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      load();
    }
  }

  async function removeRow(i: number) {
    const row = rows[i];
    if (!row.id) return setRows((r) => r.filter((_, j) => j !== i));
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabaseBrowser().from("testimonials").delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Shown on the home page and on /clients."
        action={
          <Button
            variant="ghost"
            onClick={() =>
              setRows([
                ...rows,
                { quote: "", name: "", org: "", sort_order: rows.length + 1, published: true },
              ])
            }
          >
            <Plus size={14} /> Add testimonial
          </Button>
        }
      />

      {rows.length === 0 && <Empty>No testimonials yet.</Empty>}

      <div className="space-y-4">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`}>
            <Textarea
              label="Quote"
              rows={3}
              value={row.quote}
              onChange={(e) => patch(i, { quote: e.target.value })}
            />
            <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_1fr_5rem_auto_auto]">
              <Input
                label="Attribution"
                value={row.name}
                onChange={(e) => patch(i, { name: e.target.value })}
              />
              <Input
                label="Organisation"
                value={row.org}
                onChange={(e) => patch(i, { org: e.target.value })}
              />
              <Input
                label="Order"
                type="number"
                value={row.sort_order}
                onChange={(e) => patch(i, { sort_order: Number(e.target.value) })}
              />
              <Toggle
                checked={row.published}
                onChange={(v) => patch(i, { published: v })}
                label="Live"
              />
              <div className="flex gap-2">
                <Button onClick={() => saveRow(i)}>Save</Button>
                <Button variant="danger" aria-label="Delete" onClick={() => removeRow(i)}>
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
