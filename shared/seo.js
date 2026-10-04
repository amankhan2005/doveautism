/**
 * Single source of truth for page metadata.
 * Used by the Express server (HTML head injection, sitemap.xml, robots.txt)
 * and by the React client (useSeo hook on client-side navigation).
 *
 * Structured data includes ONLY verified facts from the research reference.
 * Address, phone, service area, ratings and social profiles are deliberately
 * omitted until Dove Autism confirms them.
 */

export const SITE = Object.freeze({
  name: 'Dove Autism',
  defaultUrl: 'https://www.doveautism.com',
  locale: 'en_US',
  ogImage: '/og-image.png',
  logo: '/brand/dove-autism-logo.png',
  themeColor: '#1E4C78',
  // Verified homepage copy (meta description on the current site).
  description:
    'We specialize in early intervention, in-home ABA, and school readiness for children diagnosed with autism. Our programs target a wide range of skills such as communication, play, self-care, social, and school readiness. We also provide ongoing training and coordinated care for the entire family.',
});

/** Verified service lines. Descriptions are not verified, so schema uses names only. */
export const SERVICES_FOR_SCHEMA = [
  { id: 'early-intervention', name: 'Early intervention' },
  { id: 'in-home-aba', name: 'In-home ABA therapy' },
  { id: 'school-readiness', name: 'School readiness' },
  { id: 'family-support', name: 'Family training and coordinated care' },
];

export const ROUTES = [
  {
    key: 'home',
    path: '/',
    title: 'Dove Autism | ABA Therapy for Children with Autism',
    description:
      'Early intervention, in-home ABA, and school readiness for children diagnosed with autism, with ongoing training and coordinated care for the entire family.',
    breadcrumb: null,
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    key: 'about',
    path: '/about',
    title: 'About Us | Dove Autism',
    description:
      'Dove Autism believes every child can learn. Learn about our customized, ABA-based treatment plans and how we carefully select staff experienced in autism.',
    breadcrumb: 'About Us',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    key: 'services',
    path: '/services',
    title: 'ABA Therapy Services for Children | Dove Autism',
    description:
      'Early intervention, in-home ABA, and school readiness programs that build communication, play, self-care, social, and school readiness skills.',
    breadcrumb: 'Services',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'contact',
    path: '/contact',
    title: 'Contact Us | Dove Autism',
    description:
      'Talk with the Dove Autism team about ABA therapy for your child. Send us a message to ask questions or get started.',
    breadcrumb: 'Contact',
    changefreq: 'yearly',
    priority: '0.9',
  },
  {
    key: 'careers',
    path: '/careers',
    title: 'Careers | Join Our Team | Dove Autism',
    description:
      'RBTs, BTs and BCBAs can apply to join Dove Autism. Share a few basic details through our short online application — no resume needed for now.',
    breadcrumb: 'Careers',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    key: 'privacy',
    path: '/privacy-policy',
    title: 'Privacy Policy | Dove Autism',
    description: 'How Dove Autism handles information shared through this website.',
    breadcrumb: 'Privacy Policy',
    changefreq: 'yearly',
    priority: '0.3',
  },
];

export const NOT_FOUND = Object.freeze({
  key: 'notFound',
  path: null,
  title: 'Page Not Found | Dove Autism',
  description: 'The page you were looking for could not be found.',
  noindex: true,
});

export function findRoute(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return ROUTES.find((r) => r.path === clean) || null;
}

export function routeByKey(key) {
  return ROUTES.find((r) => r.key === key) || NOT_FOUND;
}

function absolute(siteUrl, path) {
  return new URL(path, siteUrl.replace(/\/+$/, '') + '/').toString();
}

export function canonicalFor(siteUrl, route) {
  if (!route?.path) return null;
  return route.path === '/' ? absolute(siteUrl, '/') : absolute(siteUrl, route.path);
}

/** JSON-LD graph for a route. Only verified facts. */
export function buildJsonLd(route, siteUrl) {
  const base = siteUrl.replace(/\/+$/, '');
  const orgId = `${base}/#organization`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE.name,
      url: `${base}/`,
      logo: absolute(base, SITE.logo),
      description: SITE.description,
    },
    {
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      url: `${base}/`,
      name: SITE.name,
      publisher: { '@id': orgId },
      inLanguage: 'en-US',
    },
  ];

  if (route?.path) {
    graph.push({
      '@type': 'WebPage',
      '@id': `${canonicalFor(base, route)}#webpage`,
      url: canonicalFor(base, route),
      name: route.title,
      description: route.description,
      isPartOf: { '@id': `${base}/#website` },
      about: { '@id': orgId },
    });
  }

  if (route?.breadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: route.breadcrumb, item: canonicalFor(base, route) },
      ],
    });
  }

  if (route?.key === 'services') {
    for (const s of SERVICES_FOR_SCHEMA) {
      graph.push({
        '@type': 'Service',
        '@id': `${base}/services#${s.id}`,
        name: s.name,
        serviceType: 'Applied Behavior Analysis (ABA) therapy',
        provider: { '@id': orgId },
        audience: { '@type': 'PeopleAudience', audienceType: 'Children diagnosed with autism and their families' },
        url: `${base}/services#${s.id}`,
      });
    }
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Head tags as an HTML string — used by the server to pre-render metadata. */
export function renderHeadTags(route, siteUrl) {
  const r = route || NOT_FOUND;
  const canonical = canonicalFor(siteUrl, r);
  const image = absolute(siteUrl, SITE.ogImage);
  const tags = [
    `<title>${escapeAttr(r.title)}</title>`,
    `<meta name="description" content="${escapeAttr(r.description)}" />`,
    r.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow" />',
    canonical ? `<link rel="canonical" href="${escapeAttr(canonical)}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${escapeAttr(r.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(r.description)}" />`,
    canonical ? `<meta property="og:url" content="${escapeAttr(canonical)}" />` : '',
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Dove Autism — ABA therapy for children with autism" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(r.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(r.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
    r.noindex
      ? ''
      : `<script type="application/ld+json" id="ld-json">${JSON.stringify(buildJsonLd(r, siteUrl)).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}
