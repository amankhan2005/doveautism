import { m } from 'framer-motion';
import { FEATHERS, DOVE_BODY, DOVE_BEAK, WING_PIVOT } from './feathers.js';
import { EASE } from '../../utils/motion.js';

/**
 * The Dove Autism signature: a dove whose wing is five colored feathers,
 * one for each skill area. Rendered inside a parent <svg>.
 *
 * - `animateIn`: feathers grow from the shoulder in sequence on first view.
 * - `activeIndex`: highlights one feather and softens the others.
 */
export function Dove({ animateIn = true, activeIndex = null }) {
  return (
    <g>
      <g transform={`translate(${WING_PIVOT.x} ${WING_PIVOT.y})`}>
        {FEATHERS.map((f, i) => {
          const dimmed = activeIndex !== null && activeIndex !== i;
          return (
            <g key={i} transform={`rotate(${f.rotate})`}>
              <m.path
                d={f.d}
                fill={f.color}
                style={{ transformBox: 'fill-box', originX: 0.5, originY: 1 }}
                initial={animateIn ? { scale: 0.2, opacity: 0 } : false}
                animate={{ scale: 1, opacity: dimmed ? 0.28 : 1 }}
                transition={{
                  scale: { duration: 0.7, ease: EASE, delay: animateIn ? 0.35 + (FEATHERS.length - i) * 0.08 : 0 },
                  opacity: { duration: 0.25 },
                }}
              />
            </g>
          );
        })}
      </g>
      <path d={DOVE_BODY} fill="var(--white)" stroke="var(--navy)" strokeWidth="4" strokeLinejoin="round" />
      <path d={DOVE_BEAK} fill="var(--orange)" stroke="var(--navy)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="364" cy="236" r="5.5" fill="var(--ink)" />
      <path d="M 300 300 C 320 296 338 284 346 268" fill="none" stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}
