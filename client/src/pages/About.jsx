import { Link } from 'react-router-dom';
import { Sprout, ClipboardList, Sun } from 'lucide-react';
import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { MissionBand } from '../sections/MissionBand.jsx';
import { CtaBand } from '../sections/CtaBand.jsx';
import { Section } from '../components/ui/Section.jsx';
import { Container } from '../components/ui/Container.jsx';
import { SectionHeading } from '../components/ui/SectionHeading.jsx';
import { IconBadge } from '../components/ui/IconBadge.jsx';
import { ButtonLink, TextLink } from '../components/ui/Button.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { FamilyIllustration } from '../assets/illustrations/FamilyIllustration.jsx';
import { VERIFIED, PROPOSED } from '../content/site.js';
import { publishedTeam } from '../content/team.js';
import { getPhoto } from '../content/photos.js';
import { Photo } from '../components/ui/Photo.jsx';
import styles from './About.module.css';

/** Approach points restate the verified mission sentence in parts. */
const APPROACH = [
  {
    icon: Sprout,
    color: 'var(--t-selfcare)',
    title: 'Every child can learn',
    text: 'Our work starts from the belief that every child can learn.',
  },
  {
    icon: ClipboardList,
    color: 'var(--t-communication)',
    title: 'Plans built on ABA principles',
    text: 'Treatment plans are customized for each child and based on the principles of Applied Behavior Analysis (ABA).',
  },
  {
    icon: Sun,
    color: 'var(--t-play)',
    title: 'Learning, independence and quality of life',
    text: 'We promote learning and independence to improve quality of life, with the personalized care children deserve.',
  },
];

function Team() {
  const team = publishedTeam();
  if (!team.length) return null;
  return (
    <ul className={styles.team}>
      {team.map((m) => (
        <li key={m.slug} className={styles.member}>
          <h3>
            <Link to={`/team/${m.slug}`}>{m.name}</Link>
          </h3>
          <p>{m.role}</p>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  useSeo('about');
  const heroPhoto = getPhoto('about-hero');
  const familyPhoto = getPhoto('about-family');
  return (
    <>
      <PageHero crumb="About Us" title="About Dove Autism" lead={PROPOSED.aboutIntro} art={
          heroPhoto ? (
            <Photo photo={heroPhoto} sizes="(min-width: 960px) 36vw, 90vw" priority />
          ) : (
            <FamilyIllustration />
          )
        }>
        <ButtonLink to="/contact" size="lg">
          Talk with our team
        </ButtonLink>
      </PageHero>

      <MissionBand showLink={false} />

      <Section aria-labelledby="approach-title">
        <Container size="wide">
          <SectionHeading id="approach-title" title="Our approach" intro="Three ideas from our mission guide how we work with every child and family." />
          <Stagger as="ul" className={styles.approach}>
            {APPROACH.map((a) => (
              <StaggerItem as="li" key={a.title} className={styles.point}>
                <IconBadge icon={a.icon} color={a.color} size="lg" shape="petal" />
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="mist" aria-labelledby="team-title">
        <Container size="wide" className={styles.split}>
          <SectionHeading id="team-title" title="Our team" />
          <Reveal className={styles.splitBody}>
            <p className={styles.big}>{VERIFIED.whyChooseBody}</p>
            <Team />
          </Reveal>
        </Container>
      </Section>

      <Section aria-labelledby="family-title">
        <Container size="wide" className={styles.split}>
          <SectionHeading id="family-title" title="Support for the whole family" />
          <Reveal className={styles.splitBody}>
            <p className={styles.big}>{VERIFIED.familySupport}</p>
            <TextLink to="/services#family-support">How family support works</TextLink>
            {familyPhoto && <Photo photo={familyPhoto} sizes="(min-width: 900px) 55vw, 90vw" className={styles.familyPhoto} />}
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
