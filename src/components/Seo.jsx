import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE } from '../seo/siteConfig';

/**
 * Per-route head manager — BUILD REQUIREMENT SEO-04.
 *
 * Written against the DOM rather than pulling in react-helmet-async: this app is
 * on React 18, which does not hoist <title>/<meta> rendered inside components
 * (that landed in React 19), and the behaviour needed here is small enough that
 * a dependency would cost more than it saves.
 *
 * Everything this component writes is tagged with data-seo="route" and cleared
 * on the next render, so switching routes never leaves stale tags behind. Tags
 * that ship statically in index.html are left alone — see the note at the bottom
 * of this file about crawlers that do not execute JavaScript.
 */

const MARK = 'data-seo';

/**
 * Singleton tags — description, canonical, og:*, twitter:* — already ship
 * statically in index.html. Adopt and rewrite that element in place instead of
 * appending a second one: two <link rel="canonical"> or two descriptions is
 * actively harmful, and a crawler reading the first would get the homepage's
 * values on every route.
 */
const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  if (!href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/** Repeatable tags we own outright, so they carry the marker and get cleaned up. */
const addLink = (rel, href, extra = {}) => {
  if (!href) return;
  const el = document.createElement('link');
  el.setAttribute('rel', rel);
  el.setAttribute('href', href);
  el.setAttribute(MARK, 'route');
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
  document.head.appendChild(el);
};

const absolute = (p) => (!p ? null : /^https?:\/\//.test(p) ? p : `${SITE_URL}${p}`);

const Seo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  schemas = [],
  noindex = false,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  useEffect(() => {
    const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
    const ogImage = absolute(image);

    // Clear whatever the previous route wrote, then rebuild.
    document.head
      .querySelectorAll(`[${MARK}="route"]`)
      .forEach(el => el.remove());

    if (title) document.title = title;
    document.documentElement.setAttribute('lang', lang);

    upsertMeta('name', 'description', description);
    if (noindex) upsertMeta('name', 'robots', 'noindex, nofollow');

    upsertCanonical(canonical);

    // The site serves both languages from one URL, so hreflang points both
    // variants at the same canonical rather than inventing /es/ paths that do
    // not exist. Revisit if localised routes are ever added.
    addLink('alternate', canonical, { hreflang: 'en-US' });
    addLink('alternate', canonical, { hreflang: 'es-US' });
    addLink('alternate', canonical, { hreflang: 'x-default' });

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', BUSINESS.legalName);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', lang === 'es' ? 'es_US' : 'en_US');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    schemas.filter(Boolean).forEach((s) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MARK, 'route');
      script.textContent = JSON.stringify(s);
      document.head.appendChild(script);
    });

    return () => {
      document.head
        .querySelectorAll(`[${MARK}="route"]`)
        .forEach(el => el.remove());
    };
    // schemas is rebuilt each render by the caller, so stringify it to compare
    // by value instead of identity and avoid re-writing the head every frame.
  }, [title, description, path, image, type, noindex, lang, JSON.stringify(schemas)]);

  return null;
};

export default Seo;

/**
 * IMPORTANT — the limit of this approach.
 *
 * These tags are written by JavaScript after the bundle boots. Googlebot renders
 * JS and will see them, but many AI crawlers (and some social scrapers) read only
 * the raw HTML response. That is exactly the risk BUILD REQUIREMENT SEO-09 warns
 * about for JS-rendered sites.
 *
 * The mitigation shipped alongside this component: index.html carries a full
 * static baseline — title, description, Open Graph, and the LocalBusiness /
 * WebSite JSON-LD — so a non-executing crawler still gets the business identity
 * and the homepage's positioning. Per-route overrides here are an enhancement on
 * top of that floor, not the only source of truth.
 *
 * Fully satisfying SEO-09 needs prerendering or SSR at build time. See the
 * "Remaining gaps" section of changes/SEO-IMPLEMENTATION.md.
 */
