import { escapeHtml, escapeMultiline } from '../utils/escapeHtml.js';
import { SERVICE_OPTIONS, CONTACT_METHODS, labelFor } from '../../../shared/contactSchema.js';

/**
 * Email-safe templates: table layout, inline styles, system fonts,
 * and a plain-text alternative for every message.
 * Palette mirrors the website design tokens.
 */
const C = {
  ink: '#182E47',
  slate: '#4A5568',
  navy: '#1E4C78',
  navyTint: '#EAF1F8',
  mist: '#F3F6F9',
  line: '#DBE3EC',
};
// The six AUTISM letter colors from the official logo, in order.
const STRIPE = ['#9EC05B', '#BD2829', '#E48744', '#53B7F5', '#922E8C', '#5E2C8D'];
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function brandStripe() {
  const colors = STRIPE;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>${colors
    .map((c) => `<td height="6" style="height:6px;line-height:6px;font-size:0;background:${c};">&nbsp;</td>`)
    .join('')}</tr></table>`;
}

/**
 * The logo is loaded from the public site (SITE_URL/brand/dove-autism-logo.png).
 * Many mail clients block remote images until allowed, so the alt text
 * carries the name and the layout does not depend on the image.
 */
function logoBlock(siteUrl) {
  if (!siteUrl) return `<p style="margin:0;font-size:20px;font-weight:700;color:${C.navy};">Dove Autism</p>`;
  const src = `${siteUrl.replace(/\/+$/, '')}/brand/dove-autism-logo.png`;
  return `<img src="${escapeHtml(src)}" width="150" height="64" alt="Dove Autism" style="display:block;width:150px;height:auto;border:0;font-size:20px;font-weight:700;color:${C.navy};" />`;
}

function layout({ preheader, heading, intro, body, footerNote, siteUrl }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.mist};">
<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${C.mist};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${C.line};">
      <tr><td>${brandStripe()}</td></tr>
      <tr><td style="padding:28px 36px 8px 36px;font-family:${FONT};">
        ${logoBlock(siteUrl)}
      </td></tr>
      <tr><td style="padding:8px 36px 0 36px;font-family:${FONT};">
        <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;color:${C.ink};font-weight:700;">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:${C.slate};">${intro}</p>
      </td></tr>
      <tr><td style="padding:0 36px 32px 36px;font-family:${FONT};">${body}</td></tr>
      <tr><td style="padding:20px 36px;background:${C.navyTint};font-family:${FONT};">
        <p style="margin:0;font-size:13px;line-height:1.5;color:${C.slate};">${footerNote}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function detailRows(rows) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
${rows
  .map(
    ([label, value]) => `  <tr>
    <td style="padding:12px 0;border-top:1px solid ${C.line};width:38%;vertical-align:top;font-size:14px;color:${C.slate};">${escapeHtml(label)}</td>
    <td style="padding:12px 0;border-top:1px solid ${C.line};vertical-align:top;font-size:15px;color:${C.ink};font-weight:600;">${value}</td>
  </tr>`
  )
  .join('\n')}
</table>`;
}

export function notificationEmail(data, { submittedAt = new Date(), siteUrl } = {}) {
  const service = labelFor(SERVICE_OPTIONS, data.service);
  const method = labelFor(CONTACT_METHODS, data.preferredContact) || 'No preference';
  const when = submittedAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
  // Generic subject on purpose: subjects appear in lock-screen and notification
  // previews, so names and service details stay in the message body.
  const subject = 'New website inquiry — Dove Autism';

  const rows = [
    ['Name', escapeHtml(data.name)],
    ['Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${C.navy};">${escapeHtml(data.email)}</a>`],
    ['Phone', data.phone ? escapeHtml(data.phone) : '<span style="color:#4A5568;font-weight:400;">Not provided</span>'],
    ['Preferred contact', escapeHtml(method)],
    ['Service of interest', escapeHtml(service)],
    ['Received', escapeHtml(when)],
  ];

  const body = `${detailRows(rows)}
<p style="margin:24px 0 8px 0;font-size:14px;color:${C.slate};">Message</p>
<div style="padding:18px 20px;background:${C.mist};border-radius:14px;font-size:15px;line-height:1.6;color:${C.ink};">${escapeMultiline(data.message)}</div>
<p style="margin:24px 0 0 0;"><a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;padding:12px 22px;background:${C.navy};color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;font-size:15px;">Reply to ${escapeHtml(data.name)}</a></p>`;

  const html = layout({
    siteUrl,
    preheader: `${data.name} asked about ${service}.`,
    heading: 'New website inquiry',
    intro: 'A family sent a message through the contact form on the Dove Autism website. Replying to this email goes straight to them.',
    body,
    footerNote:
      'Sent automatically by the doveautism.com contact form. This message may contain personal information — handle it according to your privacy policy.',
  });

  const text = [
    'New website inquiry — Dove Autism',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Preferred contact: ${method}`,
    `Service of interest: ${service}`,
    `Received: ${when}`,
    '',
    'Message:',
    data.message,
  ].join('\n');

  return { subject, html, text };
}

export function confirmationEmail(data, { siteUrl } = {}) {
  const service = labelFor(SERVICE_OPTIONS, data.service);
  const method = labelFor(CONTACT_METHODS, data.preferredContact);
  const firstName = data.name.split(' ')[0];
  const subject = 'We received your message — Dove Autism';

  const rows = [['Service of interest', escapeHtml(service)]];
  if (method) rows.push(['Preferred contact', escapeHtml(method)]);

  const body = `${detailRows(rows)}
<p style="margin:24px 0 0 0;font-size:16px;line-height:1.6;color:${C.ink};">A member of our team will review your message and reach out using the details you shared. If anything changes in the meantime, you can reply to this email.</p>`;

  const html = layout({
    siteUrl,
    preheader: 'Thank you for reaching out to Dove Autism.',
    heading: `Thank you, ${firstName}`,
    intro: 'We received your message through the Dove Autism website.',
    body,
    footerNote:
      'You are receiving this email because this address was entered in the contact form on doveautism.com. If you did not send a message, you can ignore this email.',
  });

  const text = [
    `Thank you, ${firstName}`,
    '',
    'We received your message through the Dove Autism website.',
    `Service of interest: ${service}`,
    method ? `Preferred contact: ${method}` : '',
    '',
    'A member of our team will review your message and reach out using the details you shared.',
    '',
    'You are receiving this email because this address was entered in the contact form on doveautism.com.',
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n');

  return { subject, html, text };
}
