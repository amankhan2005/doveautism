import { CLIENT } from '../../content/site.js';
import styles from './AvailabilityNote.module.css';

/** Client-confirmed availability message ("No waitlist"). */
export function AvailabilityNote({ className = '' }) {
  return (
    <p className={`${styles.note} ${className}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span>
        <strong className={styles.strong}>{CLIENT.noWaitlist}</strong> <span className={styles.rest}>— {CLIENT.acceptingFamilies}</span>
      </span>
    </p>
  );
}
