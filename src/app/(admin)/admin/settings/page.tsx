"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button, Card, Input, Label, PageHeader, Textarea } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/media-picker";
import type { Stat } from "@/lib/types";

type Settings = {
  phone: string;
  email: string;
  address: string;
  hero_video: string;
  hero_poster: string;
  founder_image: string;
  founder_name: string;
  about_body: string[];
  stats: Stat[];
};

const BLANK: Settings = {
  phone: "",
  email: "",
  address: "",
  hero_video: "",
  hero_poster: "",
  founder_image: "",
  founder_name: "",
  about_body: [],
  stats: [],
};

export default function SettingsPage() {
  const [s, setS] = useState<Settings>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabaseBrowser()
      .from("site_settings")
      .select("key, value")
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else if (data) {
          setS({ ...BLANK, ...Object.fromEntries(data.map((r) => [r.key, r.value])) });
        }
        setLoading(false);
      });
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    // site_settings is key/value, so every field is its own upsert row.
    const rows = Object.entries(s).map(([key, value]) => ({ key, value }));
    const { error } = await supabaseBrowser()
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved — hit “Publish now” to update the live site");
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Site & Stats"
        description="The counters on the home page, your contact details, and the About copy."
        action={
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 font-display text-lg">Homepage counters</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            These animate up on the home page and appear again on the contact block.
          </p>
          <div className="space-y-3">
            {s.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-[5rem_4rem_1fr_auto] items-end gap-2">
                <Input
                  label={i === 0 ? "Number" : undefined}
                  type="number"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...stat, value: Number(e.target.value) };
                    set("stats", next);
                  }}
                />
                <Input
                  label={i === 0 ? "Suffix" : undefined}
                  value={stat.suffix}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...stat, suffix: e.target.value };
                    set("stats", next);
                  }}
                />
                <Input
                  label={i === 0 ? "Label" : undefined}
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...stat, label: e.target.value };
                    set("stats", next);
                  }}
                />
                <Button
                  variant="danger"
                  aria-label="Remove counter"
                  onClick={() => set("stats", s.stats.filter((_, j) => j !== i))}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => set("stats", [...s.stats, { value: 0, suffix: "+", label: "" }])}
            >
              <Plus size={14} /> Add counter
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg">Contact details</h2>
          <div className="space-y-4">
            <Input label="Phone" value={s.phone} onChange={(e) => set("phone", e.target.value)} />
            <Input label="Email" value={s.email} onChange={(e) => set("email", e.target.value)} />
            <Textarea
              label="Address"
              rows={2}
              value={s.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display text-lg">Hero &amp; founder media</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload a new file or paste a URL. Changes go live after Save + Publish now.
          </p>
          <div className="space-y-5">
            <MediaPicker
              label="Hero background video"
              kind="video"
              accept="video/mp4,video/webm"
              folder="hero"
              value={s.hero_video}
              onChange={(v) => set("hero_video", v)}
              hint="Plays behind the headline on the home page. MP4 or WebM, max 100 MB."
            />
            <MediaPicker
              label="Hero poster image"
              folder="hero"
              value={s.hero_poster}
              onChange={(v) => set("hero_poster", v)}
              hint="Shown while the video loads, and as the About page banner."
            />
            <Input
              label="Founder name"
              value={s.founder_name}
              onChange={(e) => set("founder_name", e.target.value)}
            />
            <MediaPicker
              label="Founder photo"
              folder="about"
              value={s.founder_image}
              onChange={(v) => set("founder_image", v)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display text-lg">About page copy</h2>
          <p className="mb-4 text-sm text-muted-foreground">One box per paragraph.</p>
          <div className="space-y-3">
            {s.about_body.map((para, i) => (
              <div key={i} className="space-y-2">
                <Label>{`Paragraph ${i + 1}`}</Label>
                <Textarea
                  rows={4}
                  value={para}
                  onChange={(e) => {
                    const next = [...s.about_body];
                    next[i] = e.target.value;
                    set("about_body", next);
                  }}
                />
                <Button
                  variant="danger"
                  onClick={() => set("about_body", s.about_body.filter((_, j) => j !== i))}
                >
                  <Trash2 size={14} /> Remove
                </Button>
              </div>
            ))}
            <Button variant="ghost" onClick={() => set("about_body", [...s.about_body, ""])}>
              <Plus size={14} /> Add paragraph
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
