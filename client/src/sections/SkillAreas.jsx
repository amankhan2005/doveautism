import { useState } from 'react';
import { m } from 'framer-motion';
import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { Dove } from '../assets/illustrations/Dove.jsx';
import { FEATHER_FOR_SKILL } from '../assets/illustrations/feathers.js';
import { SKILLS } from '../content/skills.js';
import { PROPOSED } from '../content/site.js';
import { VIEWPORT } from '../utils/motion.js';
import styles from './SkillAreas.module.css';

/**
 * The five verified skill areas, tied to the five feathers of the dove.
 * Hovering or focusing a skill highlights its feather. All text is always
 * visible, so the highlight is an enhancement, not required information.
 */
export function SkillAreas({ tone = 'mist', headingLevel = 2 }) {
  const [active, setActive] = useState(null);
  const Heading = `h${headingLevel + 1}`;

  return (
    <Section tone={tone} aria-labelledby="skills-title">
      <Container size="wide" className={styles.grid}>
        <m.div className={styles.art} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT} transition={{ duration: 0.7 }}>
          <svg viewBox="60 40 420 360" className={styles.svg} aria-hidden="true" focusable="false">
            <path d="M 80 220 C 70 120 170 50 280 60 C 400 70 470 150 460 250 C 450 350 360 400 260 394 C 150 388 90 320 80 220 Z" fill="var(--white)" />
            <Dove animateIn={false} activeIndex={active === null ? null : FEATHER_FOR_SKILL[active]} />
          </svg>
        </m.div>
        <div className={styles.copy}>
          <SectionHeading id="skills-title" title={PROPOSED.skillsHeading} intro={PROPOSED.skillsIntro} level={headingLevel} />
          <Stagger as="ul" className={styles.list} onMouseLeave={() => setActive(null)}>
            {SKILLS.map((s) => {
              const Icon = s.icon;
              return (
                <StaggerItem
                  as="li"
                  key={s.id}
                  className={`${styles.skill} ${active === s.id ? styles.on : ''}`}
                  style={{ '--skill': s.color, '--skill-on': s.on }}
                  onMouseEnter={() => setActive(s.id)}
                >
                  <span className={styles.feather} aria-hidden="true">
                    <Icon strokeWidth={1.75} />
                  </span>
                  <span>
                    <Heading className={styles.name}>{s.name}</Heading>
                    <span className={styles.text}>{s.text}</span>
                  </span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
