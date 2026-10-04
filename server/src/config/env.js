import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const list = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const optional = (value) => {
  const v = (value || '').trim();
  return v.length ? v : null;
};

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

export const env = Object.freeze({
  nodeEnv,
  isProd,
  port: Number(process.env.PORT) || 5000,
  siteUrl: (process.env.SITE_URL || 'https://www.doveautism.com').replace(/\/+$/, ''),
  corsOrigins: list(process.env.CORS_ORIGINS),
  // Number of reverse proxies in front of the app (needed for correct client IPs in rate limiting).
  trustProxy: Number(process.env.TRUST_PROXY ?? (isProd ? 1 : 0)),
  clientDist: path.resolve(__dirname, '../../../client/dist'),

  resend: Object.freeze({
    apiKey: optional(process.env.RESEND_API_KEY),
    contactEmails: list(process.env.CONTACT_EMAIL),
    fromEmail: optional(process.env.FROM_EMAIL),
    sendConfirmation: process.env.SEND_CONFIRMATION_EMAIL !== 'false',
  }),

  contactRateLimit: Object.freeze({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.CONTACT_RATE_LIMIT_MAX) || 5,
  }),

  mongoUri: optional(process.env.MONGODB_URI),
  storeInquiryMetadata: process.env.STORE_INQUIRY_METADATA === 'true',

  // Public contact details shown on the site. Empty values are hidden in the UI.
  // These require client confirmation — see the architecture doc, section J.
  publicInfo: Object.freeze({
    phone: optional(process.env.PUBLIC_PHONE),
    email: optional(process.env.PUBLIC_EMAIL),
    address: optional(process.env.PUBLIC_ADDRESS),
    hours: optional(process.env.PUBLIC_HOURS),
    social: Object.freeze({
      facebook: optional(process.env.PUBLIC_SOCIAL_FACEBOOK),
      instagram: optional(process.env.PUBLIC_SOCIAL_INSTAGRAM),
      linkedin: optional(process.env.PUBLIC_SOCIAL_LINKEDIN),
    }),
  }),
});

export function missingEmailVars(config = env.resend) {
  const missing = [];
  if (!config.apiKey) missing.push('RESEND_API_KEY');
  if (!config.contactEmails.length) missing.push('CONTACT_EMAIL');
  if (!config.fromEmail) missing.push('FROM_EMAIL');
  return missing;
}

export const isEmailConfigured = () => missingEmailVars().length === 0;
