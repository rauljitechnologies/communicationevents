"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-3 text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase"
          >
            Try again
          </button>
          {/* Full page load, not <Link>: client routing may be part of what broke. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:border-primary hover:text-primary"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
