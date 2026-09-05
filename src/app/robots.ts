import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.derivativegenius.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/centurion/', '/api/centurion/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
