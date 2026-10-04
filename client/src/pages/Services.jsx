import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo.js';
import { PageHero } from '../sections/PageHero.jsx';
import { ServiceDetail } from '../sections/ServiceDetail.jsx';
import { SkillAreas } from '../sections/SkillAreas.jsx';
import { FaqSection } from '../sections/FaqSection.jsx';
import { CtaBand } from '../sections/CtaBand.jsx';
import { SERVICES } from '../content/services.js';
import { ServicesArt } from '../assets/illustrations/ServicesArt.jsx';
import { VERIFIED, PROPOSED } from '../content/site.js';
import styles from './Services.module.css';

export default function Services() {
  useSeo('services');
  return (
    <>
      <PageHero crumb="Services" title={PROPOSED.servicesPageHeading} lead={VERIFIED.servicesParagraph} art={<ServicesArt />}>
        <nav aria-label="Jump to a service">
          <ul className={styles.jump}>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <Link to={`#${s.id}`} className={styles.jumpLink} style={{ '--dot': s.accent }}>
                    <Icon aria-hidden="true" strokeWidth={1.75} />
                    {s.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </PageHero>

      {SERVICES.map((s, i) => (
        <ServiceDetail key={s.id} service={s} flip={i % 2 === 1} tone={i % 2 === 1 ? 'mist' : 'white'} />
      ))}

      <SkillAreas tone="dawn" />
      <FaqSection />
      <CtaBand heading="Not sure which service fits?" body="That is a normal place to start. Send us a message and we will talk it through with you." secondary={{ to: '/about', label: 'About Dove Autism' }} />
    </>
  );
}
