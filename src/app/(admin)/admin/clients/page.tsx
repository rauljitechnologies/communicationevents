"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button, Card, Empty, Input, PageHeader, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/media-picker";

type Row = {
  id?: string;
  name: string;
  logo: string;
  website: string | null;
  sort_order: number;
  published: boolean;
};

export default function ClientsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    supabaseBrowser()
      .from("clients")
      .select("id, name, logo, website, sort_order, published")
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
    if (!row.name.trim() || !row.logo.trim()) return toast.error("Name and logo are required.");
    const { error } = await supabaseBrowser().from("clients").upsert(row, { onConflict: "name" });
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved ${row.name}`);
      load();
    }
  }

  async function removeRow(i: number) {
    const row = rows[i];
    if (!row.id) return setRows((r) => r.filter((_, j) => j !== i));
    if (!confirm(`Delete ${row.name}?`)) return;
    const { error } = await supabaseBrowser().from("clients").delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Clients"
        description="Logos on the /clients wall and the scrolling marquee on the home page."
        action={
          <Button
            variant="ghost"
            onClick={() =>
              setRows([
                ...rows,
                { name: "", logo: "", website: null, sort_order: rows.length + 1, published: true },
              ])
            }
          >
            <Plus size={14} /> Add client
          </Button>
        }
      />

      {rows.length === 0 && <Empty>No clients yet.</Empty>}

      <div className="space-y-3">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`}>
            <MediaPicker
              label="Logo"
              folder="clients"
              value={row.logo}
              onChange={(v) => patch(i, { logo: v })}
              hint="PNG or SVG with a transparent background works best."
            />
            <div className="mt-3 grid items-end gap-3 lg:grid-cols-[1fr_1fr_5rem_auto_auto]">
              <Input
                label="Name"
                value={row.name}
                onChange={(e) => patch(i, { name: e.target.value })}
              />
              <Input
                label="Website (optional)"
                value={row.website ?? ""}
                onChange={(e) => patch(i, { website: e.target.value || null })}
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
