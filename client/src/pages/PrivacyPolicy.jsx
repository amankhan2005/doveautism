import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { Accordion } from '../components/ui/Accordion.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { PRIVACY } from '../content/privacy.js';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicy() {
  useSeo('privacy');
  const updated = PRIVACY.lastUpdated
    ? new Date(`${PRIVACY.lastUpdated}T00:00:00`).toLocaleDateString('en-US', { dateStyle: 'long' })
    : null;

  return (
    <>
      <PageHero crumb="Privacy Policy" title="Privacy Policy" lead="How Dove Autism handles information shared through this website.">
        {updated && <p className={styles.updated}>Last updated {updated}</p>}
      </PageHero>

      {PRIVACY.policy.length > 0 && (
        <Section aria-label="Privacy policy">
          <Container size="prose" className="prose">
            {PRIVACY.policy.map((block) => (
              <section key={block.heading}>
                <h2>{block.heading}</h2>
                {block.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </section>
            ))}
          </Container>
        </Section>
      )}

      <Section tone={PRIVACY.policy.length ? 'mist' : 'white'} aria-labelledby="website-notes">
        <Container size="prose">
          <Reveal className={styles.head}>
            <h2 id="website-notes">How this website handles your information</h2>
            <p className="lead">A plain-language summary of what happens when you use our contact form.</p>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion items={PRIVACY.websiteNotes} />
          </Reveal>
          <p className={styles.contact}>
            Questions about your information? <Link to="/contact">Contact our team</Link>.
          </p>
        </Container>
      </Section>
    </>
  );
}
