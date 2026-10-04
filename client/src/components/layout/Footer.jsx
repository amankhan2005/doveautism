import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Logo } from '../ui/Logo.jsx';
import { Container } from '../ui/Container.jsx';
import { useSiteInfo, hasContactDetails } from '../../hooks/useSiteInfo.js';
import { FOOTER_NAV, LEGAL_NAV, COPYRIGHT, DEVELOPER_CREDIT } from '../../content/navigation.js';
import { SERVICES } from '../../content/services.js';
import { VERIFIED } from '../../content/site.js';
import styles from './Footer.module.css';

const SOCIAL_LABELS = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn' };

function ContactColumn() {
  const { status, info } = useSiteInfo();

  if (status === 'loading') {
    return (
      <div className={styles.skeleton} aria-hidden="true">
        <span />
        <span />
      </div>
    );
  }

  if (!hasContactDetails(info)) {
    return (
      <p className={styles.muted}>
        Questions about services for your child? <Link to="/contact">Send us a message</Link> and our team will get back to you.
      </p>
    );
  }

  return (
    <ul className={styles.contactList}>
      {info.phone && (
        <li>
          <Phone aria-hidden="true" />
          <a href={`tel:${info.phone.replace(/[^\d+]/g, '')}`}>{info.phone}</a>
        </li>
      )}
      {info.email && (
        <li>
          <Mail aria-hidden="true" />
          <a href={`mailto:${info.email}`}>{info.email}</a>
        </li>
      )}
      {info.address && (
        <li>
          <MapPin aria-hidden="true" />
          <span>{info.address}</span>
        </li>
      )}
      {info.hours && (
        <li>
          <Clock aria-hidden="true" />
          <span>{info.hours}</span>
        </li>
      )}
    </ul>
  );
}

function SocialLinks() {
  const { info } = useSiteInfo();
  const entries = Object.entries(info?.social || {});
  if (!entries.length) return null;
  return (
    <ul className={styles.social} aria-label="Dove Autism on social media">
      {entries.map(([key, url]) => (
        <li key={key}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {SOCIAL_LABELS[key] || key}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.stripe} aria-hidden="true" />
      <Container size="wide">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo panel loading="lazy" />
            <p className={styles.tagline}>{VERIFIED.tagline}</p>
            <p className={styles.muted}>ABA therapy for children with autism, and support for the whole family.</p>
            <SocialLinks />
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={styles.heading}>
              Explore
            </h2>
            <ul className={styles.list}>
              {FOOTER_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={styles.heading}>
              Services
            </h2>
            <ul className={styles.list}>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>Contact</h2>
            <ContactColumn />
          </div>
        </div>

        <div className={styles.bottom}>
          <ul className={styles.legal}>
            {LEGAL_NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.credit}>
            <span>{COPYRIGHT}</span>
            <a href={DEVELOPER_CREDIT.url} target="_blank" rel="noopener noreferrer">
              {DEVELOPER_CREDIT.label}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
