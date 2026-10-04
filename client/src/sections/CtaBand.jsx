import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { ButtonLink } from '../components/ui/Button.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { FEATHERS } from '../assets/illustrations/feathers.js';
import { PROPOSED } from '../content/site.js';
import { PRIMARY_CTA } from '../content/navigation.js';
import { getPhoto } from '../content/photos.js';
import { Photo } from '../components/ui/Photo.jsx';
import styles from './CtaBand.module.css';

export function CtaBand({ heading = PROPOSED.ctaHeading, body = PROPOSED.ctaBody, secondary = { to: '/services', label: 'Explore services' }, photoSlot }) {
  const photo = photoSlot ? getPhoto(photoSlot) : null;
  return (
    <Section aria-labelledby="cta-title" spacing="compact">
      <Container size="wide">
        <Reveal className={`${styles.panel} ${photo ? styles.withPhoto : ''}`}>
          {photo && <Photo photo={photo} sizes="(min-width: 900px) 40vw, 90vw" className={styles.photo} />}
          <svg className={styles.feathers} viewBox="-200 -200 260 220" aria-hidden="true" focusable="false">
            {FEATHERS.map((f, i) => (
              <path key={i} d={f.d} fill={f.color} transform={`rotate(${f.rotate})`} opacity="0.9" />
            ))}
          </svg>
          <div className={styles.copy}>
            <h2 id="cta-title" className={styles.title}>
              {heading}
            </h2>
            <p className={styles.body}>{body}</p>
            <div className={styles.actions}>
              <ButtonLink to={PRIMARY_CTA.to} variant="accent" size="lg">
                {PRIMARY_CTA.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink to={secondary.to} variant="ghostInverse" size="lg" className={styles.secondary}>
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
