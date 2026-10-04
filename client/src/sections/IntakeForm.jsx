import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { CircleCheck, CircleAlert, LoaderCircle, Send, Info } from 'lucide-react';
import {
  SERVICE_OPTIONS,
  CONTACT_METHODS,
  LIMITS,
  normalizeContact,
  validateContact,
  validateField,
  labelFor,
} from '@shared/contactSchema.js';
import { Field, TextInput, TextArea, Select, RadioPills, Checkbox } from '../components/form/Field.jsx';
import { Button } from '../components/ui/Button.jsx';
import { submitContact, ApiError } from '../utils/api.js';
import { PROPOSED } from '../content/site.js';
import styles from './IntakeForm.module.css';

const FIELD_ORDER = ['name', 'email', 'phone', 'preferredContact', 'service', 'message', 'consent'];
const fieldTarget = (field) => (field === 'preferredContact' ? 'preferredContact-email' : field);

function focusField(event, field) {
  const el = document.getElementById(fieldTarget(field));
  if (!el) return;
  event.preventDefault();
  el.scrollIntoView({ block: 'center' });
  el.focus({ preventScroll: true });
}

function emptyValues(service = '') {
  return {
    name: '',
    email: '',
    phone: '',
    preferredContact: '',
    service: SERVICE_OPTIONS.some((s) => s.value === service) ? service : '',
    message: '',
    consent: false,
    website: '', // honeypot
  };
}

export function IntakeForm() {
  const [params] = useSearchParams();
  const [values, setValues] = useState(() => emptyValues(params.get('service') || ''));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('');
  const [summary, setSummary] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const startedAt = useRef(Date.now());
  const summaryRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  // The success panel mounts only after the form's exit animation finishes,
  // so focus it from a callback ref the moment it exists.
  const focusOnMount = (el) => {
    successRef.current = el;
    if (el) requestAnimationFrame(() => el.focus());
  };

  function update(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-check live once a field has been visited or already shows an error.
    if (touched[field] || errors[field]) {
      const normalized = normalizeContact(next);
      setErrors((prev) => {
        const out = { ...prev, [field]: validateField(field, normalized) };
        // Phone requirement depends on preferred contact method.
        if (field === 'preferredContact' || field === 'phone') out.phone = validateField('phone', normalized);
        return out;
      });
    }
  }

  function onBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, normalizeContact(values)) }));
  }

  const bind = (field) => ({
    name: field,
    value: values[field],
    onChange: (e) => update(field, e.target.value),
    onBlur: () => onBlur(field),
  });

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'submitting') return;

    const data = normalizeContact({ ...values, startedAt: startedAt.current });
    const result = validateContact(data);
    if (!result.valid) {
      setErrors(result.errors);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
      const list = FIELD_ORDER.filter((f) => result.errors[f]).map((f) => ({ field: f, message: result.errors[f] }));
      setSummary(list);
      setAttempt((n) => n + 1);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setSummary([]);
    setStatus('submitting');
    setServerMessage('');
    try {
      const response = await submitContact(data);
      setConfirmationSent(Boolean(response?.confirmationSent));
      setStatus('success');
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(err.errors);
        setSummary(FIELD_ORDER.filter((f) => err.errors[f]).map((f) => ({ field: f, message: err.errors[f] })));
        setStatus('idle');
        setAttempt((n) => n + 1);
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setServerMessage(err.message);
      setStatus('error');
      setAttempt((n) => n + 1);
    }
  }

  function reset() {
    setValues(emptyValues());
    setErrors({});
    setTouched({});
    setSummary([]);
    setServerMessage('');
    setConfirmationSent(false);
    startedAt.current = Date.now();
    setStatus('idle');
  }

  const messageLength = values.message.length;
  const nearLimit = messageLength > LIMITS.messageMax * 0.9;

  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.successIcon} aria-hidden="true">
              <CircleCheck strokeWidth={1.75} />
            </span>
            <h2 ref={focusOnMount} tabIndex={-1} className={styles.successTitle}>
              Message sent
            </h2>
            <p className="lead">
              Thank you, {values.name.split(' ')[0]}. Your message about{' '}
              <strong>{labelFor(SERVICE_OPTIONS, values.service).toLowerCase()}</strong> reached the Dove Autism team, and someone will
              get back to you{values.preferredContact ? ` by ${labelFor(CONTACT_METHODS, values.preferredContact).toLowerCase()}` : ''}.
            </p>
            {confirmationSent && (
              <p className={styles.successNote}>We also sent a confirmation email to {values.email}. If it does not arrive, check your spam folder.</p>
            )}
            <div className={styles.successActions}>
              <Button variant="secondary" onClick={reset}>
                Send another message
              </Button>
              <Link to="/services" className={styles.successLink}>
                Explore our services
              </Link>
            </div>
          </m.div>
        ) : (
          <m.form
            key="form"
            className={styles.form}
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.head}>
              <h2 id="form-title" className={styles.title}>
                Send us a message
              </h2>
              <p className={styles.legend}>
                Fields marked <strong className={styles.req}>Required</strong> must be filled in. Everything else is optional.
              </p>
            </div>

            <AnimatePresence>
              {summary.length > 0 && (
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
                    {summary.length === 1 ? 'One field needs attention' : `${summary.length} fields need attention`}
                  </p>
                  <ul>
                    {summary.map((s) => (
                      <li key={s.field}>
                        <a href={`#${fieldTarget(s.field)}`} onClick={(e) => focusField(e, s.field)}>
                          {s.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                </m.div>
              )}
            </AnimatePresence>

            <div className={styles.notice}>
              <Info aria-hidden="true" strokeWidth={2} />
              <p>{PROPOSED.medicalNotice}</p>
            </div>

            <div className={styles.row}>
              <Field id="name" label="Parent or caregiver name" required error={touched.name && errors.name}>
                {(a11y) => <TextInput {...a11y} {...bind('name')} autoComplete="name" maxLength={LIMITS.nameMax} />}
              </Field>
              <Field id="email" label="Email" required error={touched.email && errors.email}>
                {(a11y) => (
                  <TextInput {...a11y} {...bind('email')} type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.emailMax} />
                )}
              </Field>
            </div>

            <div className={styles.row}>
              <Field id="phone" label="Phone" required={values.preferredContact === 'phone'} error={touched.phone && errors.phone}>
                {(a11y) => <TextInput {...a11y} {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phoneMax} />}
              </Field>
              <RadioPills
                name="preferredContact"
                legend="Preferred contact method"
                options={CONTACT_METHODS.map((o) => ({ ...o, id: `preferredContact-${o.value}` }))}
                value={values.preferredContact}
                onChange={(e) => update('preferredContact', e.target.value)}
                error={touched.preferredContact && errors.preferredContact}
              />
            </div>

            <Field id="service" label="Service of interest" required error={touched.service && errors.service}>
              {(a11y) => <Select {...a11y} {...bind('service')} options={SERVICE_OPTIONS} placeholder="Choose a service" />}
            </Field>

            <Field
              id="message"
              label="How can we help?"
              required
              hint={`Tell us a little about your family and what you are looking for. Up to ${LIMITS.messageMax.toLocaleString('en-US')} characters.`}
              error={touched.message && errors.message}
            >
              {(a11y) => (
                <div className={styles.messageWrap}>
                  <TextArea {...a11y} {...bind('message')} rows={6} maxLength={LIMITS.messageMax} />
                  <span className={`${styles.counter} ${nearLimit ? styles.counterWarn : ''}`} aria-hidden="true">
                    {messageLength.toLocaleString('en-US')} / {LIMITS.messageMax.toLocaleString('en-US')}
                  </span>
                </div>
              )}
            </Field>

            <Checkbox
              id="consent"
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              onBlur={() => onBlur('consent')}
              error={touched.consent && errors.consent}
            >
              Dove Autism may contact me about this inquiry. I have read the{' '}
              <Link to="/privacy-policy" target="_blank" rel="noopener">
                Privacy Policy
                <span className="visually-hidden"> (opens in a new tab)</span>
              </Link>
              .
            </Checkbox>

            {/* Honeypot — hidden from people and assistive technology; bots fill it. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update('website', e.target.value)} />
            </div>

            <AnimatePresence>
              {status === 'error' && (
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
                    <p className={styles.serverErrorTitle}>Your message was not sent</p>
                    <p>{serverMessage} Your answers are still here, so you can send again.</p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            <div className={styles.actions}>
              <Button type="submit" size="lg" disabled={status === 'submitting'} aria-describedby="submit-status">
                {status === 'submitting' ? (
                  <>
                    <LoaderCircle className={styles.spinner} aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className={styles.sendIcon} aria-hidden="true" strokeWidth={2} />
                    {status === 'error' ? 'Try sending again' : 'Send message'}
                  </>
                )}
              </Button>
              <p id="submit-status" className="visually-hidden" aria-live="polite">
                {status === 'submitting' ? 'Sending your message.' : ''}
              </p>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
