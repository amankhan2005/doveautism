import { AnimatePresence, m } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import styles from './FormShell.module.css';

/** Move focus to a field from an error-summary link. */
export function focusField(event, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  event.preventDefault();
  el.scrollIntoView({ block: 'center' });
  el.focus({ preventScroll: true });
}

/** "N fields need attention" box with links to each field. Focus it after it mounts. */
export function ErrorSummary({ items, attempt, summaryRef, targetFor = (f) => f }) {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <m.div
          key={`summary-${attempt}`}
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className={styles.summary}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -4, 4, -2, 2, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className={styles.summaryTitle}>
            <CircleAlert aria-hidden="true" strokeWidth={2} />
            {items.length === 1 ? 'One field needs attention' : `${items.length} fields need attention`}
          </p>
          <ul>
            {items.map((s) => (
              <li key={s.field}>
                <a href={`#${targetFor(s.field)}`} onClick={(e) => focusField(e, targetFor(s.field))}>
                  {s.message}
                </a>
              </li>
            ))}
          </ul>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/** Delivery / network failure box. Never shown together with a success state. */
export function ServerError({ show, attempt, errorRef, title, children }) {
  return (
    <AnimatePresence>
      {show && (
        <m.div
          key={`error-${attempt}`}
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className={styles.serverError}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0, x: [0, -4, 4, -2, 2, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CircleAlert aria-hidden="true" strokeWidth={2} />
          <div>
            <p className={styles.serverErrorTitle}>{title}</p>
            <p>{children}</p>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
