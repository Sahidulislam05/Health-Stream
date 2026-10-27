import type { NextConfig } from "next";

// Server-only: where the Express API runs (a separate Vercel project in production).
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The browser calls /api/v1/* on this domain; Next forwards it to the API.
  // Keeps auth cookies first-party across two separate deployments (FRONTEND_PLAN §2.1).
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_ORIGIN}/api/v1/:path*` },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
