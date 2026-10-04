import { useSeo } from '../hooks/useSeo.js';
import { Container } from '../components/ui/Container.jsx';
import { ButtonLink, TextLink } from '../components/ui/Button.jsx';
import { Dove } from '../assets/illustrations/Dove.jsx';
import styles from './NotFound.module.css';

export default function NotFound() {
  useSeo('notFound');
  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <Container className={styles.inner}>
        <svg className={styles.mark} viewBox="92 78 336 272" aria-hidden="true" focusable="false">
          <Dove animateIn={false} />
        </svg>
        <h1 id="nf-title">This page flew away</h1>
        <p className="lead">The page you were looking for is not here. It may have moved when our website was updated.</p>
        <div className={styles.actions}>
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/services" variant="secondary">
            Our services
          </ButtonLink>
        </div>
        <TextLink to="/contact">Contact our team</TextLink>
      </Container>
    </section>
  );
}
