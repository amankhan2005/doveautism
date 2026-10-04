import { useCallback, useState } from 'react';

/**
 * Lightweight math check that keeps Submit disabled until a simple question is solved.
 * Generated and checked entirely in the browser — nothing is sent to the server.
 * It deters accidental and casual automated submissions; it is not bot-proof
 * (the honeypot, timing check and rate limits on the API still apply).
 */

export const MATH_CAPTCHA_MESSAGES = Object.freeze({
  wrong: 'Please solve the math question correctly.',
  missing: 'Answer the math question to continue.',
});

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

/** Random addition (1–10 + 1–10) or subtraction with a positive result (6–18 − 1–9). */
function makeQuestion(previous) {
  for (;;) {
    const op = Math.random() < 0.5 ? '+' : '-';
    const a = op === '+' ? randomInt(1, 10) : randomInt(6, 18);
    const b = op === '+' ? randomInt(1, 10) : randomInt(1, Math.min(a - 1, 9));
    const q = { a, b, op, text: `What is ${a} ${op} ${b}?`, result: op === '+' ? a + b : a - b };
    if (q.text !== previous?.text) return q; // "New question" always shows a different one
  }
}

export function useMathCaptcha() {
  const [question, setQuestion] = useState(() => makeQuestion());
  const [answer, setAnswerState] = useState('');
  const [touched, setTouched] = useState(false);
  const [attempted, setAttempted] = useState(false);

  /** New question: clears the answer and any message, so Submit is disabled again. */
  const refresh = useCallback(() => {
    setQuestion((prev) => makeQuestion(prev));
    setAnswerState('');
    setTouched(false);
    setAttempted(false);
  }, []);

  const trimmed = answer.trim();
  const solved = /^\d{1,3}$/.test(trimmed) && Number(trimmed) === question.result;

  let error = '';
  if (!solved) {
    if (trimmed && (touched || attempted)) error = MATH_CAPTCHA_MESSAGES.wrong;
    else if (attempted) error = MATH_CAPTCHA_MESSAGES.missing;
  }

  return {
    question: question.text,
    answer,
    solved,
    error,
    /** What to say in the error summary if the visitor submits right now. */
    problem: solved ? '' : trimmed ? MATH_CAPTCHA_MESSAGES.wrong : MATH_CAPTCHA_MESSAGES.missing,
    refresh,
    setAnswer: (v) => setAnswerState(String(v).replace(/\D/g, '').slice(0, 3)),
    blur: () => setTouched(true),
    /** Call when the visitor tries to submit, so an empty answer gets a message too. */
    markAttempted: () => setAttempted(true),
  };
}
