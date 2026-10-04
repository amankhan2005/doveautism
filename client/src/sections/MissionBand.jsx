import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { TextLink } from '../components/ui/Button.jsx';
import { VERIFIED } from '../content/site.js';
import styles from './MissionBand.module.css';

/** The verified mission statement, given the space it deserves. */
export function MissionBand({ showLink = true, heading = 'Our mission' }) {
  return (
    <Section tone="dawn" spacing="compact" aria-labelledby="mission-title">
      <Container>
        <Reveal className={styles.wrap}>
          <h2 id="mission-title" className={styles.label}>
            {heading}
          </h2>
          <p className={styles.statement}>{VERIFIED.mission}</p>
          {showLink && <TextLink to="/about">More about Dove Autism</TextLink>}
        </Reveal>
      </Container>
    </Section>
  );
}
