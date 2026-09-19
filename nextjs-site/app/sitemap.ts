import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    { path: '', priority: 1 },
    { path: '/showcase', priority: 0.9 },
    { path: '/services', priority: 0.8 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.7 },
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
