/** Geometry shared by every dove drawing. Feather order = SKILLS order (back → front). */
export const FEATHERS = [
  { color: 'var(--f-school)', rotate: -84, d: 'M0 0 C -36 -46 -39 -121 0 -178 C 39 -121 36 -46 0 0 Z' },
  { color: 'var(--f-social)', rotate: -63, d: 'M0 0 C -37 -48 -40 -125 0 -184 C 40 -125 37 -48 0 0 Z' },
  { color: 'var(--f-selfcare)', rotate: -42, d: 'M0 0 C -35 -46 -39 -120 0 -176 C 39 -120 35 -46 0 0 Z' },
  { color: 'var(--f-play)', rotate: -21, d: 'M0 0 C -32 -42 -35 -109 0 -160 C 35 -109 32 -42 0 0 Z' },
  { color: 'var(--f-communication)', rotate: 0, d: 'M0 0 C -28 -36 -30 -94 0 -138 C 30 -94 28 -36 0 0 Z' },
];

/** Maps a skill id to its feather index (feathers are drawn back-to-front). */
export const FEATHER_FOR_SKILL = {
  'school-readiness': 0,
  social: 1,
  'self-care': 2,
  play: 3,
  communication: 4,
};

export const DOVE_BODY =
  'M 300 250 C 312 220 330 206 352 206 C 380 206 398 228 394 256 C 390 300 350 336 290 340 C 240 344 200 330 170 312 L 108 330 L 126 296 L 100 266 L 176 280 C 220 284 272 280 300 250 Z';
export const DOVE_BEAK = 'M 392 238 L 420 248 L 390 258 Z';
export const WING_PIVOT = { x: 286, y: 268 };
