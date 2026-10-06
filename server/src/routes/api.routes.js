import { Router } from 'express';
import { contactRateLimiter, rateLimiter } from '../middleware/rateLimit.js';
import { makeContactController } from '../controllers/contact.controller.js';
import { makeCareersController } from '../controllers/careers.controller.js';
import { makeSiteInfoController } from '../controllers/siteInfo.controller.js';
import { isDbConnected } from '../config/db.js';

// Express 4 ignores rejected promises from async handlers; on Node 15+ an unhandled
// rejection exits the process (Render then answers 502). Route them to errorHandler instead.
const guard = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export function apiRoutes({ env, sendInquiryEmails, sendApplicationEmails, isEmailConfigured, recordInquiry }) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ ok: true, email: isEmailConfigured() ? 'configured' : 'not_configured', database: isDbConnected() ? 'connected' : 'disabled' });
  });

  router.get('/site-info', makeSiteInfoController(env.publicInfo));

  router.post(
    '/contact',
    contactRateLimiter(env.contactRateLimit),
    guard(makeContactController({ sendInquiryEmails, isEmailConfigured, recordInquiry }))
  );

  router.post(
    '/careers/apply',
    rateLimiter({ ...env.careersRateLimit, message: 'You have sent several applications in a short time. Wait a few minutes, then try again.' }),
    guard(makeCareersController({ sendApplicationEmails, isEmailConfigured }))
  );

  return router;
}
