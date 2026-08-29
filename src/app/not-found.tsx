import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-gold-gradient text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-3 text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase"
          >
            Go home
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-sm border border-border px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:border-primary hover:text-primary"
          >
            See our work
          </Link>
        </div>
      </div>
    </main>
  );
}
