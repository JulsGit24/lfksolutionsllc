/**
 * Hand-written title tags and meta descriptions — BUILD REQUIREMENT SEO-04.
 * No templating, no auto-generation. Edit these directly.
 *
 * Title formula for service pages: [Service] in [City], VA | LFK Solutions
 * Keep titles at or under ~60 characters so they are not truncated in results.
 * Descriptions state the service, the city, a credential, and a call to action
 * with the phone number.
 *
 * Written in English because the target queries in the audit's keyword map are
 * English-language local searches. If Spanish-language search becomes a target,
 * these move into the locale files and `Seo` reads them through `t()`.
 */

export const PAGE_META = {
  home: {
    path: '/',
    // 56 characters
    title: 'Plumbing & Remodeling in Stafford, VA | LFK Solutions LLC',
    description:
      'Licensed Master Plumber serving Stafford and the DMV since 2015. ' +
      'Plumbing, bathroom and kitchen remodeling. Free estimates — call (703) 859-4908.',
  },

  about: {
    path: '/about',
    // 54 characters
    title: 'Licensed Master Plumber in Stafford, VA | LFK Solutions',
    description:
      'Meet LFK Solutions — Master Plumber licensed in DC, Maryland and Virginia, ' +
      'serving Stafford and the DMV since 2015. Bonded and insured. Call (703) 859-4908.',
  },

  services: {
    path: '/services',
    // 58 characters
    title: 'Plumbing & Remodeling Services | LFK Solutions, Stafford VA',
    description:
      'Residential and commercial plumbing, water heaters, and bathroom and kitchen ' +
      'remodeling in Stafford, VA and the DMV. Free estimates — (703) 859-4908.',
  },

  whyUs: {
    path: '/why-us',
    // 54 characters
    title: 'Why Choose LFK Solutions | Licensed Plumber Stafford VA',
    description:
      'Licensed in DC, MD and VA, bonded and insured, with free estimates and ' +
      'guaranteed workmanship. Why DMV homeowners choose LFK Solutions — (703) 859-4908.',
  },
};

export default PAGE_META;
