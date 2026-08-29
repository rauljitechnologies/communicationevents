"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitEnquiry } from "./enquiry-form";

export function EnquiryDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await submitEnquiry({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        source: "nav-dialog",
      });
      form.reset();
      setOpen(false);
      router.push("/thank-you");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setOpen}>
      {children !== undefined && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-h-[90svh] overflow-y-auto rounded-sm border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Let&apos;s plan your <span className="text-gold-gradient">event</span>
          </DialogTitle>
          <DialogDescription>
            Share a few details and our team responds within one working day.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 space-y-4">
          <DialogField label="Name" name="name" placeholder="Your name" />
          <DialogField label="Phone" name="phone" type="tel" placeholder="+91 00000 00000" />
          <DialogField label="Email" name="email" type="email" placeholder="you@company.com" />
          <div>
            <label
              htmlFor="d-message"
              className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
            >
              Message
            </label>
            <textarea
              id="d-message"
              name="message"
              rows={3}
              required
              placeholder="Type of event, city, approximate dates…"
              className="mt-2 w-full resize-none rounded-sm border border-input bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={sending}
            className="w-full rounded-sm bg-primary py-3.5 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit enquiry"}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DialogField({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={`d-${name}`}
        className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      <input
        id={`d-${name}`}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-input bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
