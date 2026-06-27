export const config = {
  matcher: ['/robots.txt', '/sitemap.xml', '/google*'],
}

export default function middleware(request: Request) {
  const url = new URL(request.url)

  if (url.pathname === '/robots.txt') {
    return new Response(
      'User-agent: *\nAllow: /\nDisallow: /share/\n\nSitemap: https://click-studio-ten.vercel.app/sitemap.xml',
      {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    )
  }

  if (url.pathname === '/sitemap.xml') {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://click-studio-ten.vercel.app/</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://click-studio-ten.vercel.app/templates</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://click-studio-ten.vercel.app/camera</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://click-studio-ten.vercel.app/editor</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://click-studio-ten.vercel.app/preview</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://click-studio-ten.vercel.app/about</loc>
    <lastmod>2026-06-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`,
      {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    )
  }

  if (url.pathname === '/googleff322f63a236b38d.html') {
    return new Response('google-site-verification: googleff322f63a236b38d.html', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
