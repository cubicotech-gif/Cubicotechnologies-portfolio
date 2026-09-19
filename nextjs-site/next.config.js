// Derive the Supabase storage host from the env var so the image allowlist
// follows the project instead of being pinned to one hardcoded ref.
//
// This must never throw: next.config.js is loaded before anything else, so a
// malformed value here would stop the server booting at all and hide the very
// diagnostics meant to explain the problem.
function resolveSupabaseHost() {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    console.warn(
      `[next.config] NEXT_PUBLIC_SUPABASE_URL is not a valid URL ("${raw}"). ` +
        'Supabase images will not load until it is corrected. ' +
        'It should look like https://your-project-ref.supabase.co'
    );
    return null;
  }
}

const supabaseHost = resolveSupabaseHost();

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
      // Only added when the env var resolved to a real host; an entry with an
      // undefined hostname would match nothing and mask the cause.
      ...(supabaseHost
        ? [
            {
              protocol: 'https',
              hostname: supabaseHost,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
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
