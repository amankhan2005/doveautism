import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { TextLink } from '../components/ui/Button.jsx';
import { VERIFIED } from '../content/site.js';
import styles from './MissionBand.module.css';

/** The verified mission statement, given the space it deserves. */
export function MissionBand({ showLink = true, heading = 'Our mission' }) {
  // Opening clause gets its own span so the home page can emphasise it on phones; the text is unchanged.
  const cut = VERIFIED.mission.indexOf(', ') + 1;
  return (
    <Section tone="dawn" spacing="compact" aria-labelledby="mission-title">
      <Container>
        <Reveal className={styles.wrap}>
          <h2 id="mission-title" className={styles.label}>
            {heading}
          </h2>
          <p className={styles.statement}>
            <span className={styles.opening}>{VERIFIED.mission.slice(0, cut)}</span>
            {VERIFIED.mission.slice(cut)}
          </p>
          {showLink && <TextLink to="/about">More about Dove Autism</TextLink>}
        </Reveal>
      </Container>
    </Section>
  );
}
