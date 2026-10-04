import { ShieldCheck, ClipboardList, HeartHandshake } from 'lucide-react';
import { Container } from '../components/ui/Container.jsx';
import { Section } from '../components/ui/Section.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { IconBadge } from '../components/ui/IconBadge.jsx';
import { ButtonLink } from '../components/ui/Button.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { FamilyIllustration } from '../assets/illustrations/FamilyIllustration.jsx';
import { VERIFIED } from '../content/site.js';
import { getPhoto } from '../content/photos.js';
import { Photo } from '../components/ui/Photo.jsx';
import styles from './WhyChooseUs.module.css';

/** Pillars restate verified copy only (staff selection, ABA-based plans, family care). */
const PILLARS = [
  {
    icon: ShieldCheck,
    color: 'var(--navy-tint)',
    title: 'Carefully selected staff',
    text: 'Team members are chosen for their credentials and experience in the field of autism.',
  },
  {
    icon: ClipboardList,
    color: 'var(--dawn)',
    title: 'Customized treatment plans',
    text: 'Plans are based on the principles of Applied Behavior Analysis (ABA) and the personalized care each child deserves.',
  },
  {
    icon: HeartHandshake,
    color: 'var(--t-school)',
    title: 'Care for the whole family',
    text: 'Ongoing training and coordinated care for the entire family.',
  },
];

export function WhyChooseUs() {
  const photo = getPhoto('home-why');
  return (
    <Section aria-labelledby="why-title">
      <Container size="wide" className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeading id="why-title" title={VERIFIED.whyChooseHeading} />
          <Reveal as="p" className={styles.statement} delay={0.05}>
            {VERIFIED.whyChooseBody}
          </Reveal>
          <Stagger as="ul" className={styles.pillars}>
            {PILLARS.map((p) => (
              <StaggerItem as="li" key={p.title} className={styles.pillar}>
                <IconBadge icon={p.icon} color={p.color} />
                <div>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarText}>{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal>
            <ButtonLink to="/about" variant="secondary">
              About Us
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal className={styles.art} delay={0.1}>
          {photo ? (
            <Photo photo={photo} sizes="(min-width: 960px) 40vw, 90vw" className={styles.photo} />
          ) : (
            <FamilyIllustration className={styles.svg} />
          )}
        </Reveal>
      </Container>
    </Section>
  );
}
