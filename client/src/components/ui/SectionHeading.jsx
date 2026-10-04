import { Reveal } from '../motion/Reveal.jsx';
import styles from './SectionHeading.module.css';

/**
 * Heading block. `eyebrow` is only used where the label is meaningful
 * (e.g. the verified "We provide"), never as decoration.
 */
export function SectionHeading({ id, eyebrow, title, intro, align = 'start', level = 2, split = false, className = '' }) {
  const Heading = `h${level}`;
  return (
    <Reveal className={`${styles.heading} ${styles[align]} ${split ? styles.split : ''} ${className}`}>
      <div className={styles.titleGroup}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading id={id} className={styles.title}>
          {title}
        </Heading>
      </div>
      {intro && <p className={`lead ${styles.intro}`}>{intro}</p>}
    </Reveal>
  );
}
