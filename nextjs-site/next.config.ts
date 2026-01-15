import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // For static export compatibility
  },
};

export default nextConfig;
