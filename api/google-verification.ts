import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('google-site-verification: googleff322f63a236b38d.html');
}
