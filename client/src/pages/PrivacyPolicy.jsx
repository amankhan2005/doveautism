import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { PRIVACY } from '../content/privacy.js';
import styles from './PrivacyPolicy.module.css';

/** Renders a paragraph that is either a string or an array of strings and { text, href } links. */
function Paragraph({ value }) {
  if (typeof value === 'string') return <p>{value}</p>;
  return (
    <p>
      {value.map((part, i) =>
        typeof part === 'string' ? (
          part
        ) : (
          <a key={i} href={part.href} className={styles.nowrap}>
            {part.text}
          </a>
        ),
      )}
    </p>
  );
}

export default function PrivacyPolicy() {
  useSeo('privacy');

  return (
    <>
      <PageHero crumb="Privacy Policy" title={PRIVACY.title} />

      <Section aria-label="Privacy policy">
        <Container size="prose" className={`prose ${styles.policy}`}>
          {PRIVACY.intro.map((p, i) => (
            <Paragraph key={`intro-${i}`} value={p} />
          ))}

          {PRIVACY.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, i) =>
                typeof block === 'string' ? (
                  <p key={i}>{block}</p>
                ) : (
                  <ul key={i}>
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}

          <div className={styles.closing}>
            {PRIVACY.closing.map((p, i) => (
              <Paragraph key={`closing-${i}`} value={p} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
