import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Lock } from 'lucide-react';
import { useSiteInfo, hasContactDetails } from '../hooks/useSiteInfo.js';
import { STEPS } from '../content/steps.js';
import styles from './ContactPanel.module.css';

function Details() {
  const { status, info } = useSiteInfo();
  if (status === 'loading') {
    return (
      <div className={styles.skeleton} role="status">
        <span />
        <span />
        <span className="visually-hidden">Loading contact details</span>
      </div>
    );
  }
  if (!hasContactDetails(info)) return null;

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Other ways to reach us</h2>
      <ul className={styles.details}>
        {info.phone && (
          <li>
            <Phone aria-hidden="true" />
            <span>
              <span className={styles.detailLabel}>Phone</span>
              <a href={`tel:${info.phone.replace(/[^\d+]/g, '')}`}>{info.phone}</a>
            </span>
          </li>
        )}
        {info.email && (
          <li>
            <Mail aria-hidden="true" />
            <span>
              <span className={styles.detailLabel}>Email</span>
              <a href={`mailto:${info.email}`}>{info.email}</a>
            </span>
          </li>
        )}
        {info.address && (
          <li>
            <MapPin aria-hidden="true" />
            <span>
              <span className={styles.detailLabel}>Address</span>
              {info.address}
            </span>
          </li>
        )}
        {info.hours && (
          <li>
            <Clock aria-hidden="true" />
            <span>
              <span className={styles.detailLabel}>Hours</span>
              {info.hours}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

export function ContactPanel() {
  return (
    <aside className={styles.panel} aria-label="Contact information">
      <div className={styles.card}>
        <h2 className={styles.heading}>What happens next</h2>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={styles.num} aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <strong>{s.title}</strong>
                <span className={styles.stepText}>{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className={`${styles.card} ${styles.privacy}`}>
        <Lock aria-hidden="true" />
        <p>
          Your message goes directly to the Dove Autism team. Read how this website handles your information in our{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
      {/* Last, so details arriving from the API never push other content. */}
      <Details />
    </aside>
  );
}
