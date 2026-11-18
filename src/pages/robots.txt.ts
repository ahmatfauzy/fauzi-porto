import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro site URL is required to generate robots.txt');
  }

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemapUrl = new URL(`${basePath}/sitemap-index.xml`, site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
