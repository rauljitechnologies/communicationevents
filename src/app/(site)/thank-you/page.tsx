import type { Metadata } from "next";
import { ThankYou } from "./thank-you";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thanks for reaching out to Communication & Events. Our Kolkata team will respond to your event enquiry within one working day.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Thank you for your enquiry",
    description: "We've received your event brief and will be in touch shortly.",
  },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
