import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { IconBadge } from '../components/ui/IconBadge.jsx';
import { Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { VERIFIED, PROPOSED } from '../content/site.js';
import { SERVICES } from '../content/services.js';
import styles from './ServicesOverview.module.css';

/** "We provide" — the verified services paragraph and a path of service cards. */
export function ServicesOverview() {
  return (
    <Section aria-labelledby="services-title">
      <Container size="wide">
        <SectionHeading id="services-title" eyebrow={VERIFIED.weProvide} title={PROPOSED.servicesIntroHeading} intro={VERIFIED.servicesParagraph} split />
        <div className={styles.pathWrap}>
          <svg className={styles.path} viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M 0 140 C 200 40 320 40 450 110 C 580 180 720 180 850 100 C 980 20 1100 40 1200 90" fill="none" stroke="var(--line-strong)" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
          </svg>
          <Stagger as="ul" className={styles.cards} stagger={0.09}>
            {SERVICES.map((s) => (
              <StaggerItem as="li" key={s.id} className={styles.item}>
                <m.article className={styles.card} style={{ '--card-tint': s.tint, '--card-accent': s.accent }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <IconBadge icon={s.icon} color="var(--white)" shape="petal" />
                  <h3 className={styles.title}>{s.name}</h3>
                  <p className={styles.summary}>{s.summary}</p>
                  <Link to={`/services#${s.id}`} className={styles.more}>
                    Learn about {s.short}
                  </Link>
                </m.article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
