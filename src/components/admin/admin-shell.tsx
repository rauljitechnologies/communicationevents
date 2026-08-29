"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  LogOut,
  MessageSquareQuote,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react";
import { CreditLine } from "@/components/credit-line";
import {
  isSupabaseConfigured,
  missingSupabaseEnv,
  supabaseBrowser,
} from "@/lib/supabase/browser";
import { Button, Card, Input } from "./ui";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/settings", label: "Site & Stats", icon: Settings },
  { href: "/admin/services", label: "Services", icon: LayoutGrid },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  const checkAdmin = useCallback(async (s: Session | null) => {
    if (!s) return setIsAdmin(false);
    // is_admin() is the same predicate the RLS policies use.
    const { data, error } = await supabaseBrowser().rpc("is_admin");
    setIsAdmin(!error && data === true);
  }, []);

  useEffect(() => {
    // createClient throws on an empty URL, and hooks still run even when the
    // render below short-circuits — so bail out before touching Supabase.
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const sb = supabaseBrowser();
    sb.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await checkAdmin(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      await checkAdmin(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [checkAdmin]);

  if (!isSupabaseConfigured()) {
    return (
      <CenteredNote>
        <p className="font-semibold text-foreground">Supabase isn&apos;t configured.</p>
        <p className="mt-3">
          {missingSupabaseEnv().length > 0 ? (
            <>
              Missing:{" "}
              {missingSupabaseEnv().map((v, i) => (
                <span key={v}>
                  {i > 0 && ", "}
                  <code className="rounded bg-muted px-1">{v}</code>
                </span>
              ))}
            </>
          ) : (
            "The configured Supabase URL is not a valid https:// address."
          )}
        </p>
        <p className="mt-3">
          Set them in your hosting project&apos;s environment variables and restart the app. The
          admin reads them at request time, so a rebuild isn&apos;t required.
        </p>
      </CenteredNote>
    );
  }

  if (!ready) {
    return <CenteredNote>Checking your session…</CenteredNote>;
  }
  if (!session) {
    return <LoginForm />;
  }
  if (!isAdmin) {
    return (
      <CenteredNote>
        <p className="font-semibold text-foreground">This account isn&apos;t an admin.</p>
        <p className="mt-2">
          Signed in as {session.user.email}. Ask an existing admin to add you to the{" "}
          <code className="rounded bg-muted px-1">admins</code> table.
        </p>
        <Button variant="ghost" className="mt-5" onClick={() => supabaseBrowser().auth.signOut()}>
          Sign out
        </Button>
      </CenteredNote>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg">C&amp;E Admin</span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              View site <ExternalLink size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <PublishButton />
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <Button variant="ghost" onClick={() => supabaseBrowser().auth.signOut()}>
              <LogOut size={14} /> Sign out
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-2">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <n.icon size={13} /> {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">{children}</main>
      <footer className="border-t border-border">
        <CreditLine
          credit
          className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-muted-foreground"
        />
      </footer>
    </div>
  );
}

/** Flushes the public site's 60s content cache so edits show up immediately. */
function PublishButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="ghost"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const { data } = await supabaseBrowser().auth.getSession();
          const res = await fetch("/api/revalidate", {
            method: "POST",
            headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` },
          });
          if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
          toast.success("Live site updated");
        } catch (e) {
          toast.error((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <RefreshCw size={14} className={busy ? "animate-spin" : ""} /> Publish now
    </Button>
  );
}

function CenteredNote({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="max-w-md text-center text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="grid min-h-screen place-content-center justify-items-center bg-background px-5">
      <Card className="w-full max-w-sm">
        <h1 className="font-display text-2xl">Admin sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Communication &amp; Events content manager.
        </p>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
              if (error) setError(error.message);
            } catch {
              setError(
                "Couldn't reach Supabase. This build is missing its NEXT_PUBLIC_SUPABASE_URL — redeploy with the environment variables set.",
              );
            }
            setBusy(false);
          }}
        >
          <Input
            label="Email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
      <CreditLine credit className="mt-6 text-center text-xs text-muted-foreground" />
    </div>
  );
}
