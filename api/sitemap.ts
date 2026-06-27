import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://clickstudio.app/</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://clickstudio.app/templates</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clickstudio.app/camera</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clickstudio.app/editor</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickstudio.app/preview</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://clickstudio.app/about</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
}
