import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The CMS is not content for search engines.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
