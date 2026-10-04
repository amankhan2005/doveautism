import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { CircleCheck, LoaderCircle, Send, Info } from 'lucide-react';
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
import { MathCaptcha } from '../components/form/MathCaptcha.jsx';
import { ErrorSummary, ServerError } from '../components/form/FormFeedback.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useForm } from '../hooks/useForm.js';
import { useMathCaptcha } from '../hooks/useMathCaptcha.js';
import { submitContact, ApiError } from '../utils/api.js';
import { PROPOSED } from '../content/site.js';
import styles from '../components/form/FormShell.module.css';

const FIELD_ORDER = ['name', 'email', 'phone', 'preferredContact', 'service', 'message', 'consent'];
const fieldTarget = (field) => (field === 'preferredContact' ? 'preferredContact-email' : field);
const LINKED = { preferredContact: ['phone'] };

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
  const form = useForm({
    initial: emptyValues(params.get('service') || ''),
    normalize: normalizeContact,
    validateField,
    fields: FIELD_ORDER,
    linked: LINKED,
  });
  const { values, errors, touched, update, blur, bind } = form;
  const captcha = useMathCaptcha();
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('');
  const [summary, setSummary] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const startedAt = useRef(Date.now());
  // Set synchronously: React state would not stop a second click in the same tick.
  const inFlight = useRef(false);
  const summaryRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);

  const canSubmit = form.isComplete && captcha.solved;

  useEffect(() => {
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  // The success panel mounts only after the form's exit animation finishes,
  // so focus it from a callback ref the moment it exists.
  const focusOnMount = (el) => {
    successRef.current = el;
    if (el) requestAnimationFrame(() => el.focus());
  };

  function showSummary(fieldErrors, captchaError = '') {
    const list = FIELD_ORDER.filter((f) => fieldErrors[f]).map((f) => ({ field: f, message: fieldErrors[f] }));
    if (captchaError) list.push({ field: 'captcha', message: captchaError });
    setSummary(list);
    setAttempt((n) => n + 1);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return; // no accidental double submissions

    // Re-checked here, not just via the button state, so calling submit directly cannot skip it.
    const data = normalizeContact({ ...values, startedAt: startedAt.current });
    const result = validateContact(data);
    if (!result.valid || !captcha.solved) {
      form.showErrors(result.errors);
      captcha.markAttempted();
      showSummary(result.errors, captcha.problem);
      return;
    }

    inFlight.current = true;
    setSummary([]);
    setStatus('submitting');
    setServerMessage('');
    try {
      const response = await submitContact(data);
      setConfirmationSent(Boolean(response?.confirmationSent));
      setStatus('success');
      captcha.refresh(); // a fresh question for the next submission
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        form.showErrors(err.errors);
        setStatus('idle');
        showSummary(err.errors);
        return;
      }
      setServerMessage(err.message);
      setStatus('error');
      setAttempt((n) => n + 1);
    } finally {
      inFlight.current = false;
    }
  }

  function reset() {
    form.reset(emptyValues());
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

            <ErrorSummary items={summary} attempt={attempt} summaryRef={summaryRef} targetFor={fieldTarget} />

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
              onBlur={() => blur('consent')}
              error={touched.consent && errors.consent}
            >
              Dove Autism may contact me about this inquiry. I have read the{' '}
              <Link to="/privacy-policy" target="_blank" rel="noopener">
                Privacy Policy
                <span className="visually-hidden"> (opens in a new tab)</span>
              </Link>
              .
            </Checkbox>

            <MathCaptcha captcha={captcha} />

            {/* Honeypot — hidden from people and assistive technology; bots fill it. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update('website', e.target.value)} />
            </div>

            <ServerError show={status === 'error'} attempt={attempt} errorRef={errorRef} title="Your message was not sent">
              {serverMessage} Your answers are still here, so you can send again.
            </ServerError>

            <div className={styles.actions}>
              <Button
                type="submit"
                size="lg"
                disabled={status === 'submitting'}
                aria-disabled={!canSubmit || undefined}
                aria-describedby={canSubmit ? 'submit-status' : 'submit-status submit-hint'}
              >
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
              {!canSubmit && status !== 'submitting' && (
                <p id="submit-hint" className={styles.submitHint}>
                  Complete the required fields and the security check to send your message.
                </p>
              )}
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
