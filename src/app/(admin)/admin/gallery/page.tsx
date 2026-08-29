"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button, Card, Empty, Input, PageHeader, Textarea, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/media-picker";

type Cat = {
  id?: string;
  slug: string;
  title: string;
  copy: string;
  sort_order: number;
  published: boolean;
};

type Img = {
  id?: string;
  category_slug: string;
  url: string;
  caption: string;
  sort_order: number;
  published: boolean;
};

export default function GalleryAdmin() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const sb = supabaseBrowser();
    const [c, i] = await Promise.all([
      sb.from("gallery_categories").select("*").order("sort_order"),
      sb.from("gallery_images").select("*").order("sort_order"),
    ]);
    if (c.error) toast.error(c.error.message);
    if (i.error) toast.error(i.error.message);
    setCats((c.data ?? []) as Cat[]);
    setImages((i.data ?? []) as Img[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const patchCat = (i: number, p: Partial<Cat>) =>
    setCats((r) => r.map((row, j) => (j === i ? { ...row, ...p } : row)));

  const patchImage = (id: string, p: Partial<Img>) =>
    setImages((r) => r.map((im) => (im.id === id ? { ...im, ...p } : im)));

  async function saveCat(i: number) {
    const c = cats[i];
    if (!c.slug.trim() || !c.title.trim()) return toast.error("Slug and title are required.");
    const { error } = await supabaseBrowser()
      .from("gallery_categories")
      .upsert(c, { onConflict: "slug" });
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved “${c.title}”`);
      load();
    }
  }

  async function removeCat(i: number) {
    const c = cats[i];
    if (!c.id) return setCats((r) => r.filter((_, j) => j !== i));
    if (!confirm(`Delete “${c.title}” and all its photos?`)) return;
    const { error } = await supabaseBrowser().from("gallery_categories").delete().eq("id", c.id);
    if (error) toast.error(error.message);
    else load();
  }

  async function addImage(slug: string) {
    const n = images.filter((i) => i.category_slug === slug).length + 1;
    const { error } = await supabaseBrowser()
      .from("gallery_images")
      .insert({ category_slug: slug, url: "", caption: "", sort_order: n, published: false });
    if (error) toast.error(error.message);
    else {
      toast.success("Photo slot added — upload a file, then Save");
      load();
    }
  }

  async function saveImage(img: Img) {
    const { error } = await supabaseBrowser()
      .from("gallery_images")
      .update({ url: img.url, caption: img.caption, sort_order: img.sort_order, published: img.published })
      .eq("id", img.id!);
    if (error) toast.error(error.message);
    else toast.success("Photo saved");
  }

  async function removeImage(id: string) {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabaseBrowser().from("gallery_images").delete().eq("id", id);
    if (error) toast.error(error.message);
    else load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Categories become sections on /gallery; each holds its own set of photos."
        action={
          <Button
            variant="ghost"
            onClick={() =>
              setCats([
                ...cats,
                { slug: "", title: "", copy: "", sort_order: cats.length + 1, published: true },
              ])
            }
          >
            <Plus size={14} /> Add category
          </Button>
        }
      />

      {cats.length === 0 && <Empty>No gallery categories yet.</Empty>}

      <div className="space-y-4">
        {cats.map((c, i) => {
          const mine = images.filter((im) => im.category_slug === c.slug);
          const isOpen = open === (c.slug || `new-${i}`);
          return (
            <Card key={c.id ?? `new-${i}`}>
              <div className="grid items-end gap-3 lg:grid-cols-[1fr_1fr_5rem_auto_auto]">
                <Input
                  label="Title"
                  value={c.title}
                  onChange={(e) => patchCat(i, { title: e.target.value })}
                />
                <Input
                  label="Slug"
                  value={c.slug}
                  onChange={(e) => patchCat(i, { slug: e.target.value })}
                />
                <Input
                  label="Order"
                  type="number"
                  value={c.sort_order}
                  onChange={(e) => patchCat(i, { sort_order: Number(e.target.value) })}
                />
                <Toggle
                  checked={c.published}
                  onChange={(v) => patchCat(i, { published: v })}
                  label="Live"
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveCat(i)}>Save</Button>
                  <Button variant="danger" aria-label="Delete" onClick={() => removeCat(i)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <Textarea
                label="Description"
                className="mt-3"
                rows={2}
                value={c.copy}
                onChange={(e) => patchCat(i, { copy: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.slug || `new-${i}`)}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase"
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {mine.length} photo{mine.length === 1 ? "" : "s"}
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  {mine.map((img) => (
                    <div key={img.id} className="rounded-md border border-border p-3">
                      <MediaPicker
                        label="Photo"
                        folder={`gallery/${c.slug}`}
                        value={img.url}
                        onChange={(v) => patchImage(img.id!, { url: v })}
                      />
                      <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_5rem_auto_auto]">
                        <Input
                          label="Caption"
                          value={img.caption}
                          onChange={(e) => patchImage(img.id!, { caption: e.target.value })}
                        />
                        <Input
                          label="Order"
                          type="number"
                          value={img.sort_order}
                          onChange={(e) =>
                            patchImage(img.id!, { sort_order: Number(e.target.value) })
                          }
                        />
                        <Toggle
                          checked={img.published}
                          onChange={(v) => patchImage(img.id!, { published: v })}
                          label="Live"
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => saveImage(img)}>Save</Button>
                          <Button
                            variant="danger"
                            aria-label="Delete photo"
                            onClick={() => removeImage(img.id!)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" onClick={() => addImage(c.slug)} disabled={!c.slug}>
                    <Plus size={14} /> Add photo
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
