import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { ServicesGrid } from "@/components/site/services-grid";
import { Statement } from "@/components/site/statement";
import { Difference } from "@/components/site/difference";
import { Testimonials } from "@/components/site/testimonials";
import { Contact } from "@/components/site/contact";
import {
  contactLinks,
  differences,
  getClients,
  getServices,
  getSettings,
  getTestimonials,
  processSteps,
} from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Corporate Event Management Company in Kolkata",
  description:
    "Communication & Events — corporate event management in Kolkata. 1000+ events, 100+ brands, 30+ years of conferences, exhibitions, activations and roadshows.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Communication & Events | Corporate Events in Kolkata",
    description:
      "Creating memorable corporate events since 1994 — conferences, exhibitions, brand activations, roadshows and CSR events.",
  },
};

export default async function HomePage() {
  const [services, clients, testimonials, settings] = await Promise.all([
    getServices(),
    getClients(),
    getTestimonials(),
    getSettings(),
  ]);

  return (
    <main>
      <Hero video={settings.hero_video} poster={settings.hero_poster} stats={settings.stats} />
      <ServicesGrid services={services} />
      <Statement />
      <Difference
        differences={differences}
        process={processSteps}
        image={services[0]?.image ?? "/media/s1.jpg"}
      />
      <Testimonials testimonials={testimonials} clients={clients} />
      <Contact settings={contactLinks(settings)} />
    </main>
  );
}
