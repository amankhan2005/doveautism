import { Sprout, House, Backpack, HeartHandshake } from 'lucide-react';

/**
 * Service lines — names VERIFIED; summaries PROPOSED (client approval needed).
 * `id` doubles as the anchor on /services and the value in the contact form.
 */
export const SERVICES = [
  {
    id: 'early-intervention',
    name: 'Early intervention',
    short: 'early intervention',
    icon: Sprout,
    tint: 'var(--t-selfcare)',
    accent: 'var(--f-selfcare)',
    on: 'var(--on-selfcare)',
    summary: 'Support that starts in the early years, with a plan shaped around your child.', // PROPOSED
  },
  {
    id: 'in-home-aba',
    name: 'In-home ABA',
    short: 'in-home ABA',
    icon: House,
    tint: 'var(--t-play)',
    accent: 'var(--f-play)',
    on: 'var(--on-play)',
    summary: 'ABA sessions in the comfort of your own home, where everyday routines already happen.', // PROPOSED
  },
  {
    id: 'school-readiness',
    name: 'School readiness',
    short: 'school readiness',
    icon: Backpack,
    tint: 'var(--t-school)',
    accent: 'var(--f-school)',
    on: 'var(--on-school)',
    summary: 'Building the skills that help a child feel ready for the classroom.', // PROPOSED
  },
  {
    id: 'family-support',
    name: 'Family training & coordinated care',
    short: 'family support',
    icon: HeartHandshake,
    tint: 'var(--t-communication)',
    accent: 'var(--f-communication)',
    on: 'var(--on-communication)',
    summary: 'Ongoing training and coordinated care for the entire family.', // VERIFIED wording
  },
];

export const serviceById = (id) => SERVICES.find((s) => s.id === id);
