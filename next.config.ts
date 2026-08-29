import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the trace root; there are stray lockfiles above this directory.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Local media lives in /public/media. Anything uploaded later to Supabase
    // Storage (or any CDN) is served straight from its https URL, so new
    // gallery/client images never require a rebuild.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
