import { HeartHandshake, ClipboardList, BadgeCheck } from 'lucide-react';
import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { CareersForm } from '../sections/CareersForm.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { ButtonAnchor } from '../components/ui/Button.jsx';
import { IconBadge } from '../components/ui/IconBadge.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { Dove } from '../assets/illustrations/Dove.jsx';
import { ROLE_OPTIONS } from '@shared/careersSchema.js';
import { CAREERS } from '../content/site.js';
import styles from './Careers.module.css';

const ROLE_ICONS = {
  RBT: { icon: HeartHandshake, color: 'var(--t-communication)' },
  BT: { icon: ClipboardList, color: 'var(--t-play)' },
  BCBA: { icon: BadgeCheck, color: 'var(--t-school)' },
};

function HeroArt() {
  return (
    <svg viewBox="60 40 420 360" className={styles.heroArt} aria-hidden="true" focusable="false">
      <path d="M 80 220 C 70 120 170 50 280 60 C 400 70 470 150 460 250 C 450 350 360 400 260 394 C 150 388 90 320 80 220 Z" fill="var(--white)" />
      <Dove animateIn={false} />
    </svg>
  );
}

export default function Careers() {
  useSeo('careers');
  return (
    <>
      <PageHero crumb="Careers" title={CAREERS.heading} lead={CAREERS.intro} art={<HeroArt />}>
        <ButtonAnchor href="#apply" size="lg" className={styles.heroCta}>
          Start your application
        </ButtonAnchor>
      </PageHero>

      <Section tone="mist" spacing="compact" className={styles.section}>
        <Container size="wide" className={styles.grid}>
          <div id="apply" className={styles.formCol}>
            <CareersForm />
          </div>

          <aside className={styles.aside} aria-label="About applying">
            <Reveal className={styles.panel}>
              <h2 className={styles.panelTitle}>Positions</h2>
              <Stagger as="ul" className={styles.roles}>
                {ROLE_OPTIONS.map((r) => (
                  <StaggerItem as="li" key={r.value} className={styles.role}>
                    <IconBadge icon={ROLE_ICONS[r.value].icon} color={ROLE_ICONS[r.value].color} size="sm" />
                    <span>
                      <span className={styles.roleName}>{r.label}</span>
                      <span className={styles.roleTitle}>{r.title}</span>
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            <Reveal className={styles.panel} delay={0.08}>
              <h2 className={styles.panelTitle}>How applying works</h2>
              <ol className={styles.steps}>
                <li>
                  <span className={styles.stepNo} aria-hidden="true">1</span>
                  <span>
                    <strong>Share your basic details.</strong> Your name, contact details, state and the position you are applying for.
                  </span>
                </li>
                <li>
                  <span className={styles.stepNo} aria-hidden="true">2</span>
                  <span>
                    <strong>Our team reviews your information.</strong> There is nothing to upload — no resume or cover letter is needed for now.
                  </span>
                </li>
              </ol>
            </Reveal>
          </aside>
        </Container>
      </Section>
    </>
  );
}
