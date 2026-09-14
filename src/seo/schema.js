/**
 * JSON-LD builders — BUILD REQUIREMENT SEO-10.
 *
 * Every builder omits fields whose source data is null, so an unconfirmed value
 * in siteConfig produces valid schema with that property absent rather than
 * invalid or invented schema.
 */
import {
  SITE_URL, BUSINESS, CREDENTIALS, AREAS_SERVED, SERVICES,
} from './siteConfig';

const drop = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) =>
    v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)));

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.address.street,
  addressLocality: BUSINESS.address.locality,
  addressRegion: BUSINESS.address.region,
  postalCode: BUSINESS.address.postalCode,
  addressCountry: BUSINESS.address.country,
});

const geo = () => BUSINESS.geo && ({
  '@type': 'GeoCoordinates',
  latitude: BUSINESS.geo.latitude,
  longitude: BUSINESS.geo.longitude,
});

const openingHours = () => BUSINESS.openingHours && BUSINESS.openingHours.map(h => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days,
  opens: h.opens,
  closes: h.closes,
}));

/** The organisation node every other node points back to. */
export const businessId = `${SITE_URL}/#business`;

/**
 * LocalBusiness typed as both Plumber and GeneralContractor, per SEO-10.
 * This is the anchor entity for the whole site.
 */
export const localBusinessSchema = () => drop({
  '@context': 'https://schema.org',
  '@type': ['Plumber', 'GeneralContractor'],
  '@id': businessId,
  name: BUSINESS.legalName,
  alternateName: BUSINESS.name,
  url: `${SITE_URL}/`,
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  foundingDate: BUSINESS.foundingDate,
  priceRange: BUSINESS.priceRange,
  address: postalAddress(),
  geo: geo(),
  openingHoursSpecification: openingHours(),
  areaServed: AREAS_SERVED.map(a => ({ '@type': 'Place', name: a })),
  sameAs: BUSINESS.sameAs,
  hasCredential: CREDENTIALS.map(c => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'license',
    name: c,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Plumbing and remodeling services',
    itemListElement: SERVICES.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s },
    })),
  },
});

/** WebSite node — enables sitelinks search box eligibility and names the publisher. */
export const webSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: BUSINESS.legalName,
  publisher: { '@id': businessId },
  inLanguage: ['en-US', 'es-US'],
});

/** Service schema for a single service, per SEO-10. */
export const serviceSchema = ({ name, description, path }) => drop({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  serviceType: name,
  provider: { '@id': businessId },
  areaServed: AREAS_SERVED.map(a => ({ '@type': 'Place', name: a })),
  url: path ? `${SITE_URL}${path}` : undefined,
});

/** FAQPage — only emit when the questions have real published answers. */
export const faqSchema = (items = []) => {
  const usable = items.filter(i => i && i.q && i.a);
  if (!usable.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable.map(i => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
};

/** BreadcrumbList for non-home pages. */
export const breadcrumbSchema = (trail = []) => {
  if (trail.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
};

/**
 * Review / AggregateRating — INTENTIONALLY NOT WIRED UP.
 *
 * SEO-10 permits these "only for reviews genuinely collected — never
 * fabricated". The testimonials currently on the site are client-supplied
 * quotes with no collected star rating and no verifiable source, so publishing
 * an AggregateRating from them would be asserting a rating the business has not
 * actually earned. That risks a Google manual action, not just a lost snippet.
 *
 * Once real reviews exist (BUILD REQUIREMENT SEO-15), pass them in here and add
 * the result to the Reviews page's schema array.
 */
export const aggregateRatingSchema = ({ ratingValue, reviewCount }) => {
  if (!ratingValue || !reviewCount) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: { '@id': businessId },
    ratingValue,
    reviewCount,
  };
};
