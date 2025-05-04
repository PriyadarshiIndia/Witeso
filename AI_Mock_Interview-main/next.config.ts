import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ⚠️ Danger: disables TS type-checking on production build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ⚠️ Danger: disables ESLint errors on production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
