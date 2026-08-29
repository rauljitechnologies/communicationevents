"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/types";
import { submitEnquiry } from "./enquiry-form";
import { Reveal, WordsReveal } from "./motion-primitives";

type ContactProps = {
  settings: SiteSettings & { phoneHref: string; emailHref: string };
};

export function Contact({ settings }: ContactProps) {
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
        source: "contact-section",
      });
      form.reset();
      router.push("/thank-you");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-[5svh] md:py-[9svh]">
      <motion.div
        className="animate-glow pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[40svh] w-[70vw] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">Reach Out</p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]">
              <WordsReveal text="Let's plan your" />{" "}
              <span className="text-gold-gradient">event</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Tell us about your event and we&apos;ll get back to you shortly.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
              <Detail label="Address" value={settings.address} />
              <Detail label="Response time" value="Within 1 working day" />
              <Detail label="Email" value={settings.email} href={settings.emailHref} />
              <Detail label="Phone" value={settings.phone} href={settings.phoneHref} />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {settings.stats.map((s) => (
                <div key={s.label} className="border-t border-border pt-3">
                  <p className="text-gold-gradient font-display text-2xl">
                    {s.value.toLocaleString("en-IN")}
                    {s.suffix}
                  </p>
                  <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="glass-panel space-y-5 rounded-sm p-7 md:p-9">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Phone" name="phone" type="tel" placeholder="+91 00000 00000" />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" />
            <div>
              <label
                htmlFor="message"
                className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder="Type of event, city, approximate dates…"
                className="mt-2 w-full resize-none rounded-sm border border-input bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-primary"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={sending}
              className="w-full rounded-sm bg-primary py-4 text-xs font-bold tracking-[0.24em] text-primary-foreground uppercase disabled:opacity-60"
            >
              {sending ? "Sending…" : "Submit enquiry"}
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
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
        htmlFor={name}
        className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-input bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="bg-card/60 p-5">
      <p className="text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase">{label}</p>
      {href ? (
        <a href={href} className="mt-2 block text-base break-words hover:text-primary">
          {value}
        </a>
      ) : (
        <p className="mt-2 text-base">{value}</p>
      )}
    </div>
  );
}
