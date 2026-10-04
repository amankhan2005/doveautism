import { useSeo } from '../hooks/useSeo.js';
import { HomeHero } from '../sections/HomeHero.jsx';
import { MissionBand } from '../sections/MissionBand.jsx';
import { ServicesOverview } from '../sections/ServicesOverview.jsx';
import { SkillAreas } from '../sections/SkillAreas.jsx';
import { WhyChooseUs } from '../sections/WhyChooseUs.jsx';
import { GettingStarted } from '../sections/GettingStarted.jsx';
import { CtaBand } from '../sections/CtaBand.jsx';
import styles from './Home.module.css';

export default function Home() {
  useSeo('home');
  return (
    <div className={styles.page} data-page="home">
      <HomeHero />
      <MissionBand />
      <ServicesOverview />
      <SkillAreas />
      <WhyChooseUs />
      <GettingStarted />
      <CtaBand photoSlot="home-cta" />
    </div>
  );
}
