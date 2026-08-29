import type { Metadata, Viewport } from "next";
import { Jost, Marcellus } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://communicationevent.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Communication & Events | Corporate Event Management, Kolkata",
    template: "%s | Communication & Events",
  },
  description:
    "Corporate event management company in Kolkata creating extraordinary conferences, exhibitions, brand activations and roadshows since 1994.",
  authors: [{ name: "Communication & Events" }],
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    siteName: "Communication & Events",
    title: "Communication & Events | Corporate Events in Kolkata",
    description: "Creating memorable corporate events since 1994.",
    images: ["/media/hero.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0f1f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${marcellus.variable} ${jost.variable}`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
