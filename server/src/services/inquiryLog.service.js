import { env } from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import { Inquiry } from '../models/Inquiry.js';
import { logger } from '../utils/logger.js';

/** Record anonymous metadata when enabled. Never blocks or fails the request. */
export async function recordInquiry({ service, preferredContact, emailStatus, confirmationSent = false }) {
  if (!env.storeInquiryMetadata || !isDbConnected()) return;
  try {
    await Inquiry.create({ service, preferredContact, emailStatus, confirmationSent });
  } catch (err) {
    logger.warn('inquiry_log.write_failed', { reason: err.name });
  }
}
