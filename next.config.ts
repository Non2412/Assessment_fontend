import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [75, 100],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '120mb',
    },
  },
};

export default nextConfig;
