import { rateLimit } from 'express-rate-limit';

/** Per-IP limiter that answers in the API's JSON error shape. */
export function rateLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ ok: false, code: 'RATE_LIMITED', message }),
  });
}

export function contactRateLimiter({ windowMs, max }) {
  return rateLimiter({ windowMs, max, message: 'You have sent several messages in a short time. Wait a few minutes, then try again.' });
}
