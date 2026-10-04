import { m } from 'framer-motion';
import { Container } from '../components/ui/Container.jsx';
import { Breadcrumbs } from '../components/ui/Breadcrumbs.jsx';
import { EASE } from '../utils/motion.js';
import styles from './PageHero.module.css';

const seq = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

/** Inner-page hero: breadcrumb, H1, lead, optional actions and art. */
export function PageHero({ crumb, title, lead, children, art, tone = 'mist' }) {
  return (
    <section className={`${styles.hero} ${styles[tone]}`} aria-labelledby="page-title">
      <Container size="wide" className={`${styles.grid} ${art ? styles.withArt : ''}`}>
        <m.div className={styles.copy} variants={seq} initial="hidden" animate="visible">
          <m.div variants={rise}>
            <Breadcrumbs current={crumb} />
          </m.div>
          <m.h1 id="page-title" variants={rise} className={styles.title}>
            {title}
          </m.h1>
          {lead && (
            <m.p variants={rise} className={`lead ${styles.lead}`}>
              {lead}
            </m.p>
          )}
          {children && <m.div variants={rise}>{children}</m.div>}
        </m.div>
        {art && (
          <m.div className={styles.art} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}>
            {art}
          </m.div>
        )}
      </Container>
      <span className={styles.blobA} aria-hidden="true" />
      <span className={styles.blobB} aria-hidden="true" />
    </section>
  );
}
