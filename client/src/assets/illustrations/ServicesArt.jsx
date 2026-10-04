import { m } from 'framer-motion';
import { SERVICES } from '../../content/services.js';
import { LogoImage } from '../../components/ui/Logo.jsx';
import { EASE } from '../../utils/motion.js';
import styles from './ServicesArt.module.css';

const POSITIONS = [
  { top: '4%', left: '8%', rotate: -8 },
  { top: '0%', left: '56%', rotate: 6 },
  { top: '54%', left: '2%', rotate: 4 },
  { top: '52%', left: '58%', rotate: -6 },
];

/** Four service "petals" around the official logo. Decorative. */
export function ServicesArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <span className={styles.center}>
        <LogoImage className={styles.mark} alt="" sizes="140px" loading="lazy" />
      </span>
      {SERVICES.map((s, i) => {
        const Icon = s.icon;
        const pos = POSITIONS[i];
        return (
          <m.span
            key={s.id}
            className={styles.petal}
            style={{ top: pos.top, left: pos.left, '--petal': s.accent, '--petal-on': s.on, '--tint': s.tint, rotate: pos.rotate }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 }}
          >
            <Icon strokeWidth={1.6} />
          </m.span>
        );
      })}
    </div>
  );
}
