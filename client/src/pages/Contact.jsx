import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { IntakeForm } from '../sections/IntakeForm.jsx';
import { ContactPanel } from '../sections/ContactPanel.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { AvailabilityNote } from '../components/ui/AvailabilityNote.jsx';
import { PROPOSED } from '../content/site.js';
import styles from './Contact.module.css';

export default function Contact() {
  useSeo('contact');
  return (
    <>
      <PageHero crumb="Contact" title={PROPOSED.contactHeading} lead={PROPOSED.contactIntro}>
        <AvailabilityNote />
      </PageHero>
      <Section tone="mist" spacing="compact" className={styles.section}>
        <Container size="wide" className={styles.grid}>
          <IntakeForm />
          <ContactPanel />
        </Container>
      </Section>
    </>
  );
}
