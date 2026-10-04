import { m, PresenceContext } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container.jsx';
import { ButtonLink } from '../components/ui/Button.jsx';
import { HeroIllustration } from '../assets/illustrations/HeroIllustration.jsx';
import { VERIFIED, PROPOSED } from '../content/site.js';
import { SERVICES } from '../content/services.js';
import { PRIMARY_CTA } from '../content/navigation.js';
import { EASE } from '../utils/motion.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { getPhoto } from '../content/photos.js';
import { Photo } from '../components/ui/Photo.jsx';
import styles from './HomeHero.module.css';

const seq = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Phones lead with a photograph; tablet and desktop keep the dove illustration. */
const PHONE = '(max-width: 639px)';

export function HomeHero() {
  const phone = useMediaQuery(PHONE);
  const photo = phone ? getPhoto('home-why') : null;
  const hero = (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container size="wide" className={styles.grid}>
        <m.div className={styles.copy} variants={seq} initial="hidden" animate="visible">
          <m.p className={styles.tagline} variants={rise}>
            {VERIFIED.tagline}
          </m.p>
          <m.h1 id="hero-title" className={styles.title} variants={rise}>
            {VERIFIED.heroHeading}
          </m.h1>
          <m.p className={`lead ${styles.lead}`} variants={rise}>
            {PROPOSED.heroSupport}
          </m.p>
          <m.div className={styles.actions} variants={rise}>
            <ButtonLink to={PRIMARY_CTA.to} size="lg">
              {PRIMARY_CTA.label}
            </ButtonLink>
            <ButtonLink to="/services" variant="secondary" size="lg" className={styles.secondary}>
              Explore services
            </ButtonLink>
          </m.div>
          <m.ul className={styles.chips} variants={rise} aria-label="Our services">
            {SERVICES.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Link to={`/services#${s.id}`} className={styles.chip} style={{ '--chip-dot': s.accent }}>
                  {s.name}
                </Link>
              </li>
            ))}
          </m.ul>
        </m.div>
        {photo ? (
          <m.div
            className={styles.photoWrap}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <Photo photo={{ ...photo, ratio: '1 / 1' }} sizes="90vw" priority className={styles.photo} />
          </m.div>
        ) : (
          <div className={styles.art}>
            <HeroIllustration className={styles.illustration} />
          </div>
        )}
      </Container>
      <svg className={styles.wave} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 48 C 240 88 480 8 720 32 C 960 56 1200 80 1440 36 L 1440 80 L 0 80 Z" fill="var(--dawn)" />
      </svg>
    </section>
  );
  // The page transition starts with initial={false}, which also skips this entrance on first load.
  // On phones the hero opts back in by leaving that presence scope; desktop is untouched.
  return phone ? <PresenceContext.Provider value={null}>{hero}</PresenceContext.Provider> : hero;
}
