import { MetadataRoute } from 'next';
import { GUIDE_ARTICLES } from '@/lib/guides-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://midadd.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ARTICLES.map(article => ({
    url: `${baseUrl}/guides/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...guideRoutes];
}
