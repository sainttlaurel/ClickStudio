import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end('User-agent: *\nAllow: /\nDisallow: /share/\n\nSitemap: https://clickstudio.app/sitemap.xml');
}

export const config = {
  path: '/robots.txt',
};
