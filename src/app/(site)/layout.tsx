import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgressBar } from "@/components/site/motion-primitives";
import { getSettings } from "@/lib/content";

/** Content pages re-check Supabase on this cadence. */
export const revalidate = 60;

/** Marketing chrome. The admin panel sits outside this group. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    // min-h-svh + flex-1 keeps the footer at the bottom of the viewport even
    // when a page is shorter than the screen, at every breakpoint.
    <div className="flex min-h-svh flex-col">
      <ScrollProgressBar />
      <SiteNav />
      <div className="flex-1">{children}</div>
      <SiteFooter settings={settings} />
    </div>
  );
}
