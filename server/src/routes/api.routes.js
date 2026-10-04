import { Router } from 'express';
import { contactRateLimiter } from '../middleware/rateLimit.js';
import { makeContactController } from '../controllers/contact.controller.js';
import { makeSiteInfoController } from '../controllers/siteInfo.controller.js';
import { isDbConnected } from '../config/db.js';

export function apiRoutes({ env, sendInquiryEmails, isEmailConfigured, recordInquiry }) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ ok: true, email: isEmailConfigured() ? 'configured' : 'not_configured', database: isDbConnected() ? 'connected' : 'disabled' });
  });

  router.get('/site-info', makeSiteInfoController(env.publicInfo));

  router.post(
    '/contact',
    contactRateLimiter(env.contactRateLimit),
    makeContactController({ sendInquiryEmails, isEmailConfigured, recordInquiry })
  );

  return router;
}
