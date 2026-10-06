import { normalizeApplication, validateApplication } from '../../../shared/careersSchema.js';
import { MIN_FILL_MS } from '../../../shared/contactSchema.js';
import { logger } from '../utils/logger.js';

const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * POST /api/careers/apply — basic candidate details only (no files).
 * Same order as the contact form: honeypot → fields → timing → email.
 */
export function makeCareersController({ sendApplicationEmails, isEmailConfigured }) {
  return async function submitApplication(req, res) {
    const requestId = req.id;
    const data = normalizeApplication(req.body);

    if (data.website) {
      logger.info('careers.spam_rejected', { requestId, reason: 'honeypot' });
      return res.status(200).json({ ok: true });
    }

    const { valid, errors } = validateApplication(data);
    if (!valid) {
      return res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Some fields need attention. Check the highlighted fields and try again.',
        errors,
      });
    }

    const elapsed = Date.now() - data.startedAt;
    if (!data.startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
      logger.info('careers.spam_rejected', { requestId, reason: 'timing' });
      return res.status(400).json({
        ok: false,
        code: 'SUBMISSION_CHECK_FAILED',
        message: 'Your application could not be verified. Review your details and submit it again.',
      });
    }

    if (!isEmailConfigured()) {
      logger.warn('careers.email_not_configured', { requestId });
      return res.status(503).json({
        ok: false,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Our application service is not available right now. Try again later.',
      });
    }

    try {
      const { confirmationSent } = await sendApplicationEmails(data, { requestId });
      logger.info('careers.sent', { requestId, role: data.role, confirmationSent });
      return res.status(200).json({ ok: true, confirmationSent });
    } catch (err) {
      logger.error('careers.delivery_failed', { requestId, role: data.role, reason: err.reason || err.name, statusCode: err.statusCode ?? null, detail: err.detail ?? null });
      return res.status(502).json({
        ok: false,
        code: 'DELIVERY_FAILED',
        message: 'Your application was not sent because of a problem on our side. Try again in a few minutes.',
      });
    }
  };
}
