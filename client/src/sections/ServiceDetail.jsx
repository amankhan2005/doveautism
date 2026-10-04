import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { ButtonLink } from '../components/ui/Button.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { PROPOSED } from '../content/site.js';
import { getPhoto } from '../content/photos.js';
import { Photo } from '../components/ui/Photo.jsx';
import styles from './ServiceDetail.module.css';

/** One service on /services. `flip` alternates the layout. */
export function ServiceDetail({ service, flip = false, tone = 'white' }) {
  const Icon = service.icon;
  const titleId = `${service.id}-title`;
  const photo = getPhoto(`services-${service.id}`);
  return (
    <Section id={service.id} tone={tone} spacing="compact" aria-labelledby={titleId} className={styles.section}>
      <Container size="wide" className={`${styles.grid} ${flip ? styles.flip : ''}`}>
        <Reveal className={`${styles.visual} ${photo ? styles.hasPhoto : ''}`} style={{ '--tint': service.tint, '--accent': service.accent }}>
          {photo && <Photo photo={photo} sizes="(min-width: 900px) 45vw, 90vw" className={styles.photo} />}
          <span className={styles.shapeA} aria-hidden="true" />
          <span className={styles.shapeB} aria-hidden="true" />
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon strokeWidth={1.5} />
          </span>
        </Reveal>
        <Reveal className={styles.copy} delay={0.08}>
          <h2 id={titleId} tabIndex={-1} className={styles.title}>
            {service.name}
          </h2>
          <p className="lead">{service.summary}</p>
          <p className={styles.audience}>For children diagnosed with autism and their families.</p>
          <p className={styles.note}>{PROPOSED.serviceDetailNote}</p>
          <ButtonLink to={`/contact?service=${service.id}`} variant="primary">
            Ask about {service.short}
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
