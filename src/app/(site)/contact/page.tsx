import type { Metadata } from "next";
import { Contact } from "@/components/site/contact";
import { Reveal, WordsReveal } from "@/components/site/motion-primitives";
import { contactLinks, getSettings } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Event Management Company in Kolkata",
  description:
    "Plan your next corporate event with Communication & Events, Kolkata. Share your brief and our team will respond within one working day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Communication & Events",
    description: "Tell us about your event — conferences, exhibitions, activations and roadshows.",
  },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]">
            <WordsReveal text="Let's build something" />{" "}
            <span className="text-gold-gradient">unforgettable</span>
          </h1>
        </Reveal>
      </section>
      <Contact settings={contactLinks(settings)} />
    </main>
  );
}
