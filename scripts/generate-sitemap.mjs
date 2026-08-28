/**
 * BUILD REQUIREMENT SEO-13 — auto-updating XML sitemap with lastmod dates.
 *
 * Runs before every build (see the `prebuild` script in package.json) and writes
 * public/sitemap.xml, so the sitemap can never drift out of sync with the routes
 * that actually exist.
 *
 * When Tier 2 service pages and Tier 3 location pages land (SEO-03), add them to
 * ROUTES and they are picked up automatically.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.VITE_SITE_URL || 'https://lfksolutions.com').replace(/\/$/, '');

// changefreq/priority are hints only; keep them honest rather than all-1.0.
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/why-us', changefreq: 'monthly', priority: '0.7' },
];

const lastmod = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const out = resolve(__dirname, '..', 'public', 'sitemap.xml');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, 'utf8');

console.log(`sitemap.xml — ${ROUTES.length} URLs, lastmod ${lastmod}, base ${SITE_URL}`);
