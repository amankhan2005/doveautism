import { rateLimit } from 'express-rate-limit';

export function contactRateLimiter({ windowMs, max }) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({
        ok: false,
        code: 'RATE_LIMITED',
        message: 'You have sent several messages in a short time. Wait a few minutes, then try again.',
      }),
  });
}
