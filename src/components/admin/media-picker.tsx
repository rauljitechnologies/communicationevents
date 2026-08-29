"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Label } from "./ui";

const BUCKET = "media";
const MAX_BYTES = 100 * 1024 * 1024;

/** Turns "Hero Loop.MP4" into "hero-loop-1712345678.mp4". */
function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = (dot > -1 ? name.slice(dot + 1) : "bin").toLowerCase();
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "file"}-${Date.now()}.${ext}`;
}

export function MediaPicker({
  label,
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  kind = "image",
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Sub-folder inside the bucket, e.g. "hero" or "services". */
  folder?: string;
  accept?: string;
  kind?: "image" | "video";
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (file.size > MAX_BYTES) {
      toast.error(`That file is ${(file.size / 1048576).toFixed(1)} MB — the limit is 100 MB.`);
      return;
    }
    setBusy(true);
    const sb = supabaseBrowser();
    const path = `${folder}/${safeName(file.name)}`;
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast.success("Uploaded — remember to save");
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted">
          {!value ? (
            <span className="text-[0.6rem] text-muted-foreground">none</span>
          ) : kind === "video" ? (
            <video src={value} muted playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/media/hero.jpg or https://…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear"
                className="rounded-md border border-border px-2 text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-bold tracking-[0.12em] uppercase transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {busy ? "Uploading…" : "Upload file"}
          </button>
          <p className="text-xs text-muted-foreground">
            {hint ?? "Upload a file, or paste a path/URL. Max 100 MB."}
          </p>
        </div>
      </div>
    </div>
  );
}
