import { m } from 'framer-motion';
import { Dove } from './Dove.jsx';
import { Float } from '../../components/motion/Float.jsx';
import { EASE } from '../../utils/motion.js';

/** Home hero art. Decorative — the page text carries the meaning. */
export function HeroIllustration({ className }) {
  return (
    <svg className={className} viewBox="40 20 500 460" role="presentation" aria-hidden="true" focusable="false">
      <m.path
        d="M 70 230 C 60 120 170 40 290 52 C 410 64 480 150 470 260 C 460 370 360 440 250 432 C 130 424 80 340 70 230 Z"
        fill="var(--navy-tint)"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
      />
      <path
        d="M 96 372 C 150 340 190 352 228 336"
        fill="none"
        stroke="var(--navy)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 12"
        opacity="0.55"
      />
      <Float distance={12} duration={8}>
        <circle cx="430" cy="102" r="40" fill="var(--sun)" />
      </Float>
      <Float distance={8} duration={6.5} delay={1.2}>
        <circle cx="118" cy="128" r="12" fill="var(--f-school)" opacity="0.7" />
      </Float>
      <Float distance={6} duration={7.5} delay={0.6}>
        <circle cx="460" cy="356" r="9" fill="var(--orange)" opacity="0.8" />
      </Float>
      <Dove />
    </svg>
  );
}
