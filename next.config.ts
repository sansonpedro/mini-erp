import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cache Components is intentionally off until the app has stable data flows.
     With it on, reading cookies() outside a <Suspense> boundary fails the build,
     which gets in the way of auth work. See docs/decisions/0001-cache-components.md. */
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
