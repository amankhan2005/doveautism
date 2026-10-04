import { MessageCircle, Blocks, Smile, Users, BookOpen } from 'lucide-react';

/**
 * Skill areas — names VERIFIED (homepage services paragraph).
 * Short descriptions are PROPOSED plain-language definitions, not program claims.
 * Colors are five of the six AUTISM letter colors from the official logo, matching the dove's feathers.
 */
export const SKILLS = [
  { id: 'communication', name: 'Communication', color: 'var(--f-communication)', on: 'var(--on-communication)', icon: MessageCircle, text: 'Sharing needs, wants and ideas' },
  { id: 'play', name: 'Play', color: 'var(--f-play)', on: 'var(--on-play)', icon: Blocks, text: 'Exploring toys, games and turn-taking' },
  { id: 'self-care', name: 'Self-care', color: 'var(--f-selfcare)', on: 'var(--on-selfcare)', icon: Smile, text: 'Everyday routines like dressing and mealtimes' },
  { id: 'social', name: 'Social', color: 'var(--f-social)', on: 'var(--on-social)', icon: Users, text: 'Connecting with family and peers' },
  { id: 'school-readiness', name: 'School readiness', color: 'var(--f-school)', on: 'var(--on-school)', icon: BookOpen, text: 'Getting comfortable with classroom routines' },
];
