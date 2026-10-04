import { Router } from 'express';
import { ROUTES } from '../../../shared/seo.js';

export function seoRoutes({ siteUrl }) {
  const router = Router();

  router.get('/sitemap.xml', (_req, res) => {
    const urls = ROUTES.map(
      (r) => `  <url>
    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    ).join('\n');
    res.type('application/xml').set('Cache-Control', 'public, max-age=3600');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
  });

  router.get('/robots.txt', (_req, res) => {
    res.type('text/plain').set('Cache-Control', 'public, max-age=3600');
    res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`);
  });

  return router;
}
