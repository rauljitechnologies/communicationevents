"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}

const fieldCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50";

export function Input({
  label,
  className,
  ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <input className={cn(fieldCls, className)} {...props} />
    </label>
  );
}

export function Textarea({
  label,
  className,
  ...props
}: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <textarea className={cn(fieldCls, "resize-y", className)} {...props} />
    </label>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className, ...props }: BtnProps) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:brightness-95",
    ghost: "border border-border bg-background hover:border-primary hover:text-primary",
    danger: "border border-destructive/40 text-destructive hover:bg-destructive/10",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className,
      )}
      {...props}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--gold)]"
      />
      {label}
    </label>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
