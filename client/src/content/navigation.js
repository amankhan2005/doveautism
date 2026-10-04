/** Navbar items, in order. The single navbar CTA is PRIMARY_CTA (Get Started). */
export const PRIMARY_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
];

export const PRIMARY_CTA = { to: '/contact', label: 'Get Started' };

/** Footer "Explore" links (the contact page stays reachable here). */
export const FOOTER_NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

export const LEGAL_NAV = [{ to: '/privacy-policy', label: 'Privacy Policy' }];

export const COPYRIGHT = '© 2026 Dove Autism. All rights reserved.';

export const DEVELOPER_CREDIT = Object.freeze({
  label: 'Designed & Developed by WebieApp Solutions LLC',
  url: 'https://www.webieapp.com/',
});
