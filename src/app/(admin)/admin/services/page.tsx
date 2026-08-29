"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { iconNames } from "@/components/site/service-icons";
import { Button, Card, Empty, Input, Label, PageHeader, Textarea, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/media-picker";

type Row = {
  id?: string;
  slug: string;
  title: string;
  copy: string;
  image: string;
  icon: string;
  points: string[];
  sort_order: number;
  published: boolean;
};

const blank = (n: number): Row => ({
  slug: "",
  title: "",
  copy: "",
  image: "/media/s1.jpg",
  icon: "Star",
  points: [],
  sort_order: n,
  published: true,
});

export default function ServicesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () =>
    supabaseBrowser()
      .from("services")
      .select("id, slug, title, copy, image, icon, points, sort_order, published")
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
    if (!row.slug.trim() || !row.title.trim()) {
      toast.error("Slug and title are required.");
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser()
      .from("services")
      .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "slug" });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved “${row.title}”`);
      load();
    }
  }

  async function removeRow(i: number) {
    const row = rows[i];
    if (!row.id) return setRows((r) => r.filter((_, j) => j !== i));
    if (!confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
    const { error } = await supabaseBrowser().from("services").delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      load();
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Services"
        description="Each row is a section on /services and a card on the home page."
        action={
          <Button variant="ghost" onClick={() => setRows([...rows, blank(rows.length + 1)])}>
            <Plus size={14} /> Add service
          </Button>
        }
      />

      {rows.length === 0 && <Empty>No services yet. Add one to get started.</Empty>}

      <div className="space-y-5">
        {rows.map((row, i) => (
          <Card key={row.id ?? `new-${i}`}>
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <Input
                label="Title"
                value={row.title}
                onChange={(e) => patch(i, { title: e.target.value })}
              />
              <Input
                label="Slug (used for the #anchor)"
                value={row.slug}
                onChange={(e) => patch(i, { slug: e.target.value })}
              />
              <Textarea
                label="Description"
                rows={3}
                value={row.copy}
                onChange={(e) => patch(i, { copy: e.target.value })}
              />
              <div className="space-y-4">
                <MediaPicker
                  label="Image"
                  folder="services"
                  value={row.image}
                  onChange={(v) => patch(i, { image: v })}
                />
                <label className="block">
                  <Label>Icon</Label>
                  <select
                    value={row.icon}
                    onChange={(e) => patch(i, { icon: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {iconNames.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <Label>Bullet points</Label>
              <div className="space-y-2">
                {row.points.map((p, pi) => (
                  <div key={pi} className="flex gap-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const points = [...row.points];
                        points[pi] = e.target.value;
                        patch(i, { points });
                      }}
                    />
                    <Button
                      variant="danger"
                      aria-label="Remove point"
                      onClick={() => patch(i, { points: row.points.filter((_, j) => j !== pi) })}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" onClick={() => patch(i, { points: [...row.points, ""] })}>
                  <Plus size={14} /> Add point
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4">
              <Input
                label="Order"
                type="number"
                className="w-24"
                value={row.sort_order}
                onChange={(e) => patch(i, { sort_order: Number(e.target.value) })}
              />
              <Toggle
                checked={row.published}
                onChange={(v) => patch(i, { published: v })}
                label="Published"
              />
              <div className="ml-auto flex gap-2">
                <Button variant="danger" onClick={() => removeRow(i)}>
                  <Trash2 size={14} /> Delete
                </Button>
                <Button onClick={() => saveRow(i)} disabled={busy}>
                  Save
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
