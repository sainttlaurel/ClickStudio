import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/sitemap.xml', '/robots.txt', '/google:file*'],
}

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clickstudio.app/</loc><lastmod>2026-06-27</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://clickstudio.app/templates</loc><lastmod>2026-06-27</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://clickstudio.app/camera</loc><lastmod>2026-06-27</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://clickstudio.app/editor</loc><lastmod>2026-06-27</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://clickstudio.app/preview</loc><lastmod>2026-06-27</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://clickstudio.app/about</loc><lastmod>2026-06-27</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`

const ROBOTS = `User-agent: *
Allow: /
Disallow: /share/

Sitemap: https://clickstudio.app/sitemap.xml`

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/sitemap.xml') {
    return new NextResponse(SITEMAP, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  }

  if (pathname === '/robots.txt') {
    return new NextResponse(ROBOTS, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return NextResponse.next()
}
