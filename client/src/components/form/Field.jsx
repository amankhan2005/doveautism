import { AnimatePresence, m } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import styles from './Form.module.css';

/** Label + required/optional marker + hint + animated error, wired for screen readers. */
export function Field({ id, label, required = false, hint, error, children, className = '' }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <span className={required ? styles.required : styles.optional}>{required ? 'Required' : 'Optional'}</span>
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, 'aria-required': required || undefined })}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={errorId}
            className={styles.error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <CircleAlert aria-hidden="true" className={styles.errorIcon} strokeWidth={2} />
            <span>{error}</span>
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TextInput(props) {
  return <input className={styles.control} {...props} />;
}

export function TextArea(props) {
  return <textarea className={`${styles.control} ${styles.textarea}`} {...props} />;
}

export function Select({ options, placeholder, ...props }) {
  return (
    <div className={styles.selectWrap}>
      <select className={`${styles.control} ${styles.select}`} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Radio pills inside a fieldset — label + optional marker in the legend. */
export function RadioPills({ name, legend, options, value, onChange, required = false, error, hint }) {
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <fieldset className={`${styles.field} ${styles.fieldset}`} aria-describedby={hintId}>
      <legend className={styles.label}>
        {legend}
        <span className={required ? styles.required : styles.optional}>{required ? 'Required' : 'Optional'}</span>
      </legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={styles.pills}>
        {options.map((o) => (
          <label key={o.value} className={`${styles.pill} ${value === o.value ? styles.pillOn : ''}`}>
            <input id={o.id} type="radio" name={name} value={o.value} checked={value === o.value} onChange={onChange} className={styles.pillInput} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className={styles.error}>
          <CircleAlert aria-hidden="true" className={styles.errorIcon} strokeWidth={2} />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}

export function Checkbox({ id, checked, onChange, error, children, onBlur }) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={id} className={styles.check}>
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          aria-required="true"
          className={styles.checkInput}
        />
        <span className={styles.checkText}>
          {children} <span className={styles.required}>Required</span>
        </span>
      </label>
      {error && (
        <p id={errorId} className={styles.error}>
          <CircleAlert aria-hidden="true" className={styles.errorIcon} strokeWidth={2} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Larger radio options with a short title and description each (e.g. job roles).
 * The error is tied to the group so screen readers announce it with the question.
 */
export function RadioCards({ name, legend, options, value, onChange, required = false, error, idFor = (v) => `${name}-${v}` }) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset className={`${styles.field} ${styles.fieldset} ${error ? styles.hasError : ''}`} aria-describedby={errorId}>
      <legend className={styles.label}>
        {legend}
        <span className={required ? styles.required : styles.optional}>{required ? 'Required' : 'Optional'}</span>
      </legend>
      <div className={styles.cards}>
        {options.map((o) => (
          <label key={o.value} className={`${styles.card} ${value === o.value ? styles.cardOn : ''}`}>
            <input
              id={idFor(o.value)}
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              aria-invalid={error ? true : undefined}
              className={styles.cardInput}
            />
            <span className={styles.cardMark} aria-hidden="true" />
            <span className={styles.cardText}>
              <span className={styles.cardTitle}>{o.label}</span>
              {o.description && <span className={styles.cardDesc}>{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          <CircleAlert aria-hidden="true" className={styles.errorIcon} strokeWidth={2} />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
