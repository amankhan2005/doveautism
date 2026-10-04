import { ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { Field } from './Field.jsx';
import styles from './Form.module.css';

/**
 * "Security check" math question. `captcha` comes from useMathCaptcha().
 * The question is the input's label, so screen readers announce it with the field.
 */
export function MathCaptcha({ captcha, id = 'captcha' }) {
  const { question, answer, solved, error } = captcha;

  return (
    <div className={styles.captcha} role="group" aria-labelledby={`${id}-title`}>
      <p id={`${id}-title`} className={styles.captchaTitle}>
        <ShieldCheck aria-hidden="true" strokeWidth={2} />
        Security check
      </p>

      <Field
        id={id}
        // Typographic minus sign: reads better, and screen readers say "minus".
        label={<span className={styles.captchaQuestion}>{question.replace(' - ', ' − ')}</span>}
        required
        error={error}
      >
        {(a11y) => (
          <div className={styles.captchaRow}>
            <input
              {...a11y}
              className={`${styles.control} ${styles.captchaInput}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              maxLength={3}
              value={answer}
              onChange={(e) => captcha.setAnswer(e.target.value)}
              onBlur={captcha.blur}
            />
            {solved && (
              <span className={styles.captchaOk}>
                <Check aria-hidden="true" strokeWidth={2.5} />
                Correct
              </span>
            )}
            <button type="button" className={styles.captchaRefresh} onClick={captcha.refresh}>
              <RefreshCw aria-hidden="true" strokeWidth={2} />
              New question
            </button>
          </div>
        )}
      </Field>
    </div>
  );
}
