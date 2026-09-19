// Derive the Supabase storage host from the env var so the image allowlist
// follows the project instead of being pinned to one hardcoded ref.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'snlehtiwmoxqxcglnlwd.supabase.co';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Large media never goes through the server: the admin panel uploads
      // straight from the browser to Supabase. This only covers form posts.
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      // Poster frames pulled from YouTube for embedded lessons.
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
    // Preserve image quality
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
