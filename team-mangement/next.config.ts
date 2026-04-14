import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack optimization for blazing-fast local development
  turbopack: {
    // Ensure project root is correct for module resolution
    root: __dirname,
  },

  // Development server optimizations
  onDemandEntries: {
    // Keep pages in memory while in development
    maxInactiveAge: 60 * 1000,
    // How many pages should be kept in memory
    pagesBufferLength: 5,
  },

  // Experimental optimizations for Next.js 16+
  experimental: {
    // Filesystem cache for development (enabled by default in 16+)
    turbopackFileSystemCacheForDev: true,
  },

  // Optimize for all environments
  compress: true,
  poweredByHeader: false,

  // Speed up image handling in development
  images: {
    dangerouslyAllowSVG: true,
    disableStaticImages: false,
  },

};

export default nextConfig;
