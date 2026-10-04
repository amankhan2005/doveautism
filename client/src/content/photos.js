import manifest from './photos.manifest.json';

/**
 * Photography slots — single source of truth for every photo on the site.
 * All image files live under public/ and are referenced with root-relative paths.
 *
 * CURRENT STATE: every slot shows a black PLACEHOLDER (public/images/placeholders/),
 * used to verify placement, aspect ratio, responsive behavior and layout stability.
 *
 * TO REPLACE A PLACEHOLDER WITH A REAL, LICENSED PHOTO
 *   Option A (recommended — responsive AVIF/WebP):
 *     1. Save the original as client/photos-src/<slot-id>.jpg
 *     2. npm run photos   → writes public/images/photos/<slot-id>-<width>.{avif,webp}
 *     3. Below: set placeholder: false, write `alt`, fill `license`, `source`, `sourceUrl`, `credit`.
 *   Option B (single file): put the file in public/images/photos/, set `src` to its path,
 *     update width/height to the file's real size, then do step 3.
 * The frame shape (`ratio`) never changes, so the layout stays identical.
 *
 * A non-placeholder slot is only published when `alt` and `license` are filled in.
 * Stock photos are illustrative only: alt text and nearby copy must never imply the
 * people shown are Dove Autism clients, families or staff.
 */
const blank = { license: '', source: '', sourceUrl: '', credit: '' };

export const PHOTO_SLOTS = {
  'home-why': {
    where: 'Home › "Why choose us?" section',
    brief: 'Parent and young child sharing a calm everyday moment at home; natural light, unposed',
    ratio: '4 / 5',
    placeholder: false,
    src: '/images/placeholders/home-why.jpg',
    width: 960,
    height: 1200,
    alt: 'Parent reading a picture book with a young child on their lap',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'home-cta': {
    where: 'Home › closing "Ready to talk about your child?" panel',
    brief: 'Caregiver and child playing together on the floor (blocks, books); warm, documentary style',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/home-cta.jpg',
    width: 1200,
    height: 900,
    alt: 'Adult and young child building a toy train from colorful blocks on a living room floor',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'about-hero': {
    where: 'About › page header (above the fold — loads with high priority)',
    brief: 'Adult and child engaged in a shared activity at a table; faces may be partly turned away',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/about-hero.jpg',
    width: 1200,
    height: 900,
    alt: 'Adult and child laughing together at a wooden table with paper and markers',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'about-family': {
    where: 'About › "Support for the whole family" section',
    brief: 'Family together in a relaxed home setting',
    ratio: '16 / 9',
    placeholder: false,
    src: '/images/placeholders/about-family.jpg',
    width: 1280,
    height: 720,
    alt: 'Two adults and a young girl smiling together on a sofa at home',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'services-early-intervention': {
    where: 'Services › Early intervention panel',
    brief: 'Toddler exploring a sensory or stacking toy with an adult nearby',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/services-early-intervention.jpg',
    width: 1200,
    height: 900,
    alt: 'Toddler stacking colorful rings on a peg while an adult holds up a picture card',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'services-in-home-aba': {
    where: 'Services › In-home ABA panel',
    brief: 'Child and adult working on an activity in a living room or kitchen',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/services-in-home-aba.jpg',
    width: 1200,
    height: 900,
    alt: 'Adult guiding a young child coloring a drawing at a table by the window',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'services-school-readiness': {
    where: 'Services › School readiness panel',
    brief: 'Child with a backpack, books or crayons; classroom-ready routine',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/services-school-readiness.jpg',
    width: 1200,
    height: 900,
    alt: 'Child at a desk behind a stack of books, an apple, colored pencils and a small alarm clock',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
  'services-family-support': {
    where: 'Services › Family training & coordinated care panel',
    brief: 'Parents in a supportive conversation, or parent and child reading together',
    ratio: '4 / 3',
    placeholder: false,
    src: '/images/placeholders/services-family-support.jpg',
    width: 1200,
    height: 900,
    alt: 'Two adults talking in a kitchen while one holds a young child',
    ...blank,
    license: 'TODO: unverified — confirm license before launch',
  },
};

/** Responsive variants produced by `npm run photos` live here. */
export const PHOTO_DIR = '/images/photos';

/**
 * Render data for a slot, or null (the section then shows its illustration).
 * Placeholders render as a single image; real photos use responsive variants
 * when the pipeline has produced them, otherwise the slot's `src` file.
 */
export function getPhoto(slot) {
  const s = PHOTO_SLOTS[slot];
  if (!s) return null;
  const common = { slot, ratio: s.ratio, alt: s.alt };
  if (s.placeholder) {
    return s.src ? { ...common, placeholder: true, src: s.src, width: s.width, height: s.height } : null;
  }
  if (!s.alt.trim() || !s.license.trim()) return null; // never publish an undocumented photo
  const v = manifest[slot];
  if (v) return { ...common, placeholder: false, width: v.width, height: v.height, widths: v.widths };
  return s.src ? { ...common, placeholder: false, src: s.src, width: s.width, height: s.height } : null;
}
