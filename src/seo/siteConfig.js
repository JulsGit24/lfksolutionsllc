/**
 * Single source of truth for the business's identity.
 *
 * SEO-16 in the audit requires byte-identical NAP (Name / Address / Phone)
 * everywhere the business appears. Everything on the site — schema, meta tags,
 * footer, sitemap — should read from here rather than restating these values,
 * so they can never drift apart.
 *
 * Values marked `NEEDS CONFIRMATION` are deliberately null. They are NOT
 * guessed: emitting invented coordinates or opening hours into structured data
 * is worse than omitting the field, because Google treats schema as a factual
 * claim by the business. Fill them in and the schema picks them up automatically.
 */

// Set at build time: VITE_SITE_URL=https://lfksolutions.com npm run build
// Until the domain in BUILD REQUIREMENT SEO-01 is registered, this is the value
// every canonical URL, og:url and sitemap entry is built from — so it must be
// pointed at the real domain before launch.
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL || 'https://lfksolutions.com'
).replace(/\/$/, '');

// Canonical NAP — do not reformat, abbreviate or reorder these anywhere.
export const BUSINESS = {
  legalName: 'LFK Solutions, LLC',
  name: 'LFK Solutions',
  foundingDate: '2015',

  telephone: '+1-703-859-4908',
  telephoneDisplay: '(703) 859-4908',
  telephoneHref: 'tel:+17038594908',

  // The audit (SEO-01) asks for this to move to @lfksolutions.com at launch.
  email: 'lfksolutions4u@gmail.com',

  address: {
    street: '405 Greenstead Drive',
    locality: 'Stafford',
    region: 'VA',
    regionName: 'Virginia',
    postalCode: '22554',
    country: 'US',
  },

  // NEEDS CONFIRMATION — copy the exact coordinates from the verified Google
  // Business Profile once SEO-14 is done. Left null so `geo` is omitted rather
  // than published with invented numbers.
  geo: null, // e.g. { latitude: 38.42, longitude: -77.41 }

  // NEEDS CONFIRMATION — real opening hours. Omitted until supplied.
  // e.g. [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
  //         opens: '08:00', closes: '17:00' }]
  openingHours: null,

  // NEEDS CONFIRMATION — every profile URL the business controls. `sameAs` is
  // how Google links this site to the Google Business Profile, Yelp, Facebook
  // and the trade directories in SEO-16. Add each one as it goes live.
  sameAs: [],

  priceRange: '$$',
};

// Credential stack as supplied by the client and published in the site footer.
// This resolves the open question flagged in changes/SEO-IMPLEMENTATION.md —
// VA Class A Contractor is confirmed, which is a Tier 2 keyword in the audit
// ("Class A contractor Stafford VA").
export const CREDENTIALS = [
  'DC General Contractor',
  'VA Class A Contractor',
  'VA Master Plumber & Gasfitter',
  'DC Master Plumber & Gasfitter',
  'WSSC Master Plumber & Gasfitter',
  'Bonded and insured for residential and commercial work',
];

// Matches the service area stated in the FAQ copy, plus the audit's home county.
export const AREAS_SERVED = [
  'Stafford, VA',
  'Fredericksburg, VA',
  'Woodbridge, VA',
  'Arlington, VA',
  'Alexandria, VA',
  'Fairfax, VA',
  'Washington, DC',
  'Montgomery County, MD',
  "Prince George's County, MD",
];

// Services the business actually sells. Per BUILD REQUIREMENT SEO-06, this list
// contains only things a customer can buy — no "Quality Workmanship" style
// adjectives, and "backflow" is one word.
export const SERVICES = [
  'Residential Plumbing',
  'Commercial Plumbing',
  'Backflow Prevention and Testing',
  'Water Heater Installation and Repair',
  'Bathroom Remodeling',
  'Kitchen Remodeling',
  'Home Additions and Renovations',
  'Emergency Plumbing Repairs',
];

export const DEFAULT_OG_IMAGE = '/assets/home/featured/res_plumbing_1.jpeg';
