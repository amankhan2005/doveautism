import { normalizeContact, validateContact, MIN_FILL_MS } from '../../../shared/contactSchema.js';
import { logger } from '../utils/logger.js';

const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Factory so tests can inject the email sender and configuration check.
 * POST /api/contact
 */
export function makeContactController({ sendInquiryEmails, isEmailConfigured, recordInquiry }) {
  return async function submitContact(req, res) {
    const requestId = req.id;
    const data = normalizeContact(req.body);

    // Honeypot filled → automated submission. Respond generically, send nothing.
    if (data.website) {
      logger.info('contact.spam_rejected', { requestId, reason: 'honeypot' });
      return res.status(200).json({ ok: true });
    }

    const { valid, errors } = validateContact(data);
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
      logger.info('contact.spam_rejected', { requestId, reason: 'timing' });
      return res.status(400).json({
        ok: false,
        code: 'SUBMISSION_CHECK_FAILED',
        message: 'Your message could not be verified. Review your details and send it again.',
      });
    }

    if (!isEmailConfigured()) {
      logger.warn('contact.email_not_configured', { requestId });
      return res.status(503).json({
        ok: false,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Our message service is not available right now. Try again later.',
      });
    }

    try {
      const { confirmationSent } = await sendInquiryEmails(data, { requestId });
      logger.info('contact.sent', { requestId, service: data.service, confirmationSent });
      recordInquiry({ service: data.service, preferredContact: data.preferredContact, emailStatus: 'sent', confirmationSent });
      return res.status(200).json({ ok: true, confirmationSent });
    } catch (err) {
      logger.error('contact.delivery_failed', { requestId, service: data.service, reason: err.reason || err.name });
      recordInquiry({ service: data.service, preferredContact: data.preferredContact, emailStatus: 'failed' });
      return res.status(502).json({
        ok: false,
        code: 'DELIVERY_FAILED',
        message: 'Your message was not sent because of a problem on our side. Try again in a few minutes.',
      });
    }
  };
}
