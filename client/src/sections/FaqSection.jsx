import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { Accordion } from '../components/ui/Accordion.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { FAQS } from '../content/faq.js';

/** Renders nothing until verified FAQs are supplied in content/faq.js. */
export function FaqSection({ tone = 'white' }) {
  if (!FAQS.length) return null;
  return (
    <Section tone={tone} aria-labelledby="faq-title">
      <Container size="prose">
        <SectionHeading id="faq-title" title="Questions families ask" />
        <Reveal style={{ marginTop: 'var(--s-6)' }}>
          <Accordion items={FAQS} />
        </Reveal>
      </Container>
    </Section>
  );
}
