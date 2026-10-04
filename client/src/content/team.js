/**
 * Team members. A page titled "Jenny Hilton – Dove Autism" exists on the current site,
 * but her role and bio could not be verified. Keep `published: false` until
 * Dove Autism supplies the role, bio and (optionally) a photo with alt text.
 */
export const TEAM = [
  {
    slug: 'jenny-hilton',
    name: 'Jenny Hilton',
    role: null, // CLIENT TO CONFIRM
    bio: [], // CLIENT TO SUPPLY — array of paragraphs
    published: false,
  },
];

export const publishedTeam = () => TEAM.filter((m) => m.published && m.role);
export const teamMemberBySlug = (slug) => TEAM.find((m) => m.slug === slug && m.published && m.role) || null;
