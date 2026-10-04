import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { CircleCheck, LoaderCircle, Send } from 'lucide-react';
import {
  ROLE_OPTIONS,
  US_STATES,
  APPLICATION_FIELDS,
  APPLICATION_LIMITS,
  normalizeApplication,
  validateApplication,
  validateApplicationField,
} from '@shared/careersSchema.js';
import { Field, TextInput, Select, RadioCards } from '../components/form/Field.jsx';
import { MathCaptcha } from '../components/form/MathCaptcha.jsx';
import { ErrorSummary, ServerError } from '../components/form/FormFeedback.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useForm } from '../hooks/useForm.js';
import { useMathCaptcha } from '../hooks/useMathCaptcha.js';
import { submitApplication, ApiError } from '../utils/api.js';
import styles from '../components/form/FormShell.module.css';

const fieldTarget = (field) => (field === 'role' ? `role-${ROLE_OPTIONS[0].value}` : field);
const ROLE_CARDS = ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label, description: r.title }));

const emptyValues = () => ({ firstName: '', lastName: '', email: '', phone: '', state: '', role: '', website: '' });

/** RBT / BT / BCBA application — basic details only, no uploads. */
export function CareersForm() {
  const form = useForm({ initial: emptyValues(), normalize: normalizeApplication, validateField: validateApplicationField, fields: APPLICATION_FIELDS });
  const { values, errors, touched, update, bind } = form;
  const captcha = useMathCaptcha();
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('');
  const [summary, setSummary] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState(null); // { email, confirmationSent } of the last application
  const startedAt = useRef(Date.now());
  // Set synchronously: React state would not stop a second click in the same tick.
  const inFlight = useRef(false);
  const summaryRef = useRef(null);
  const errorRef = useRef(null);

  const canSubmit = form.isComplete && captcha.solved;

  useEffect(() => {
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  const focusOnMount = (el) => {
    if (el) requestAnimationFrame(() => el.focus());
  };

  function showSummary(fieldErrors, captchaError = '') {
    const list = APPLICATION_FIELDS.filter((f) => fieldErrors[f]).map((f) => ({ field: f, message: fieldErrors[f] }));
    if (captchaError) list.push({ field: 'captcha', message: captchaError });
    setSummary(list);
    setAttempt((n) => n + 1);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return; // no accidental double submissions

    // Re-checked here, not just via the button state, so calling submit directly cannot skip it.
    const data = normalizeApplication({ ...values, startedAt: startedAt.current });
    const result = validateApplication(data);
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
      const response = await submitApplication(data);
      setSent({ email: data.email, confirmationSent: Boolean(response?.confirmationSent) });
      form.reset(emptyValues());
      startedAt.current = Date.now();
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

  function startAnother() {
    setSent(null);
    setStatus('idle');
  }

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
              Application received
            </h2>
            <p className="lead">
              Thank you for your interest in joining Dove Autism. We’ve received your application and will review your information.
            </p>
            {sent?.confirmationSent && (
              <p className={styles.successNote}>We also sent a confirmation email to {sent.email}. If it does not arrive, check your spam folder.</p>
            )}
            <div className={styles.successActions}>
              <Button variant="secondary" onClick={startAnother}>
                Submit another application
              </Button>
              <Link to="/about" className={styles.successLink}>
                Learn about Dove Autism
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
                Your application
              </h2>
              <p className={styles.legend}>All fields are required. It takes a minute or two — there is nothing to upload.</p>
            </div>

            <ErrorSummary items={summary} attempt={attempt} summaryRef={summaryRef} targetFor={fieldTarget} />

            <div className={styles.row}>
              <Field id="firstName" label="First name" required error={touched.firstName && errors.firstName}>
                {(a11y) => <TextInput {...a11y} {...bind('firstName')} autoComplete="given-name" maxLength={APPLICATION_LIMITS.nameMax} />}
              </Field>
              <Field id="lastName" label="Last name" required error={touched.lastName && errors.lastName}>
                {(a11y) => <TextInput {...a11y} {...bind('lastName')} autoComplete="family-name" maxLength={APPLICATION_LIMITS.nameMax} />}
              </Field>
            </div>

            <div className={styles.row}>
              <Field id="email" label="Email" required error={touched.email && errors.email}>
                {(a11y) => (
                  <TextInput {...a11y} {...bind('email')} type="email" inputMode="email" autoComplete="email" maxLength={APPLICATION_LIMITS.emailMax} />
                )}
              </Field>
              <Field id="phone" label="Phone" required error={touched.phone && errors.phone}>
                {(a11y) => (
                  <TextInput {...a11y} {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={APPLICATION_LIMITS.phoneMax} />
                )}
              </Field>
            </div>

            <Field id="state" label="State" required error={touched.state && errors.state}>
              {(a11y) => <Select {...a11y} {...bind('state')} options={US_STATES} placeholder="Choose your state" autoComplete="address-level1" />}
            </Field>

            <RadioCards
              name="role"
              legend="What position are you applying for?"
              required
              options={ROLE_CARDS}
              value={values.role}
              onChange={(e) => update('role', e.target.value)}
              error={touched.role && errors.role}
            />

            <MathCaptcha captcha={captcha} />

            {/* Honeypot — hidden from people and assistive technology; bots fill it. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update('website', e.target.value)} />
            </div>

            <ServerError show={status === 'error'} attempt={attempt} errorRef={errorRef} title="Your application was not sent">
              {serverMessage} Your answers are still here, so you can submit again.
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
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className={styles.sendIcon} aria-hidden="true" strokeWidth={2} />
                    {status === 'error' ? 'Try submitting again' : 'Submit application'}
                  </>
                )}
              </Button>
              {!canSubmit && status !== 'submitting' && (
                <p id="submit-hint" className={styles.submitHint}>
                  Complete every field and the security check to submit.
                </p>
              )}
              <p id="submit-status" className="visually-hidden" aria-live="polite">
                {status === 'submitting' ? 'Submitting your application.' : ''}
              </p>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
