import { Resend } from 'resend';
import { env, missingEmailVars } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { notificationEmail, confirmationEmail, applicationNotificationEmail, applicationConfirmationEmail } from './emailTemplates.js';

export class EmailDeliveryError extends Error {
  constructor(reason, { statusCode = null, detail = null } = {}) {
    super('Email delivery failed');
    this.name = 'EmailDeliveryError';
    this.reason = reason;
    // Server-log only (never sent to the browser): Resend's HTTP status and message,
    // e.g. 403 "The doveautism.com domain is not verified".
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

// Resend messages can quote addresses; the logger must never receive them.
const redact = (message) =>
  typeof message === 'string' ? message.replace(/[^\s@<>()"']+@[^\s@<>()"']+/g, '[email]').slice(0, 300) : null;

let client = null;
function resend() {
  if (!client) client = new Resend(env.resend.apiKey);
  return client;
}

async function send(payload) {
  let result;
  try {
    result = await resend().emails.send(payload);
  } catch (err) {
    throw new EmailDeliveryError(err?.name || 'network_error', { detail: redact(err?.message) });
  }
  if (result?.error) {
    throw new EmailDeliveryError(result.error.name || 'resend_error', {
      statusCode: result.error.statusCode ?? null,
      detail: redact(result.error.message),
    });
  }
  return result?.data?.id ?? null;
}

/**
 * Send the team notification (required) and the family confirmation (best effort).
 * Resolves only if Resend accepted the notification; otherwise throws.
 */
export async function sendInquiryEmails(data, { requestId } = {}) {
  const missing = missingEmailVars();
  if (missing.length) throw new EmailDeliveryError('not_configured');

  const notification = notificationEmail(data, { siteUrl: env.siteUrl });
  const notificationId = await send({
    from: env.resend.fromEmail,
    to: env.resend.contactEmails,
    replyTo: data.email,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
    tags: [{ name: 'category', value: 'website_inquiry' }],
  });

  let confirmationSent = false;
  if (env.resend.sendConfirmation) {
    const confirmation = confirmationEmail(data, { siteUrl: env.siteUrl });
    try {
      await send({
        from: env.resend.fromEmail,
        to: [data.email],
        replyTo: env.resend.contactEmails[0],
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
        tags: [{ name: 'category', value: 'inquiry_confirmation' }],
      });
      confirmationSent = true;
    } catch (err) {
      // The team already has the inquiry, so this does not fail the request.
      logger.warn('contact.confirmation_failed', { requestId, reason: err.reason, statusCode: err.statusCode ?? null, detail: err.detail ?? null });
    }
  }

  return { notificationId, confirmationSent };
}

/**
 * Careers: team notification (required) + applicant confirmation (best effort,
 * reported back so the page never claims an email that was not accepted).
 */
export async function sendApplicationEmails(data, { requestId } = {}) {
  const missing = missingEmailVars();
  if (missing.length) throw new EmailDeliveryError('not_configured');

  const notification = applicationNotificationEmail(data, { siteUrl: env.siteUrl });
  const notificationId = await send({
    from: env.resend.fromEmail,
    to: env.resend.contactEmails,
    replyTo: data.email,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
    tags: [{ name: 'category', value: 'careers_application' }],
  });

  let confirmationSent = false;
  const confirmation = applicationConfirmationEmail(data, { siteUrl: env.siteUrl });
  try {
    await send({
      from: env.resend.fromEmail,
      to: [data.email],
      replyTo: env.resend.contactEmails[0],
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      tags: [{ name: 'category', value: 'careers_confirmation' }],
    });
    confirmationSent = true;
  } catch (err) {
    // The team already has the application, so this does not fail the request.
    logger.warn('careers.confirmation_failed', { requestId, reason: err.reason, statusCode: err.statusCode ?? null, detail: err.detail ?? null });
  }

  return { notificationId, confirmationSent };
}
