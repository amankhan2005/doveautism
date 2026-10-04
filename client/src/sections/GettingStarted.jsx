import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { AvailabilityNote } from '../components/ui/AvailabilityNote.jsx';
import { STEPS } from '../content/steps.js';
import { PROPOSED } from '../content/site.js';
import styles from './GettingStarted.module.css';

const COLORS = ['var(--f-communication)', 'var(--f-play)', 'var(--f-selfcare)'];

export function GettingStarted({ tone = 'mist' }) {
  return (
    <Section tone={tone} aria-labelledby="steps-title">
      <Container size="wide">
        <SectionHeading id="steps-title" title={PROPOSED.stepsHeading} intro={PROPOSED.stepsIntro} align="center" className={styles.heading} />
        <Reveal className={styles.availability} delay={0.05}>
          <AvailabilityNote />
        </Reveal>
        <Stagger as="ol" className={styles.steps} stagger={0.12}>
          {STEPS.map((step, i) => (
            <StaggerItem as="li" key={step.title} className={styles.step} style={{ '--step': COLORS[i] }}>
              <span className={styles.number} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={styles.title}>
                <span className="visually-hidden">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className={styles.text}>{step.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
