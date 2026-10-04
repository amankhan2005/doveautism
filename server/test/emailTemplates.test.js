import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notificationEmail, confirmationEmail, applicationNotificationEmail, applicationConfirmationEmail } from '../src/services/emailTemplates.js';

const data = {
  name: 'Maria <b>Lopez</b>',
  email: 'maria@example.org',
  phone: '',
  preferredContact: 'email',
  service: 'in-home-aba',
  message: 'Line one\n<script>alert(1)</script>',
};

test('notification escapes user input and keeps personal details out of the subject', () => {
  const n = notificationEmail(data, { siteUrl: 'https://www.doveautism.com' });
  assert.equal(n.subject, 'New website inquiry — Dove Autism');
  assert.ok(!n.html.includes('<script>'));
  assert.ok(n.html.includes('&lt;b&gt;Lopez&lt;/b&gt;'));
  assert.ok(n.html.includes('https://www.doveautism.com/brand/dove-autism-logo.png'));
  assert.ok(n.text.includes('Service of interest: In-home ABA'));
});

test('confirmation does not repeat the message body', () => {
  const c = confirmationEmail(data, { siteUrl: 'https://www.doveautism.com' });
  assert.ok(!c.html.includes('Line one'));
  assert.ok(!c.text.includes('Line one'));
  assert.equal(c.subject, 'We received your message — Dove Autism');
});

test('templates fall back to a text wordmark when no site URL is configured', () => {
  const n = notificationEmail(data, {});
  assert.ok(!n.html.includes('<img'));
  assert.ok(n.html.includes('Dove Autism'));
});

const applicant = { firstName: 'Jordan', lastName: 'Lee <i>', email: 'jordan@example.org', phone: '555 010 2030', state: 'NJ', role: 'BCBA' };

test('careers notification has the requested subject and every detail, escaped', () => {
  const n = applicationNotificationEmail(applicant, { submittedAt: new Date('2026-10-05T14:30:00Z'), siteUrl: 'https://www.doveautism.com' });
  assert.equal(n.subject, 'New Careers Application — BCBA — Jordan Lee <i>');
  for (const part of ['Jordan Lee &lt;i&gt;', 'jordan@example.org', '555 010 2030', 'New Jersey', 'BCBA (Board Certified Behavior Analyst)', 'Oct 5, 2026']) {
    assert.ok(n.html.includes(part), part);
  }
  assert.ok(!n.html.includes('<i>'));
  assert.ok(n.text.includes('Position: BCBA (Board Certified Behavior Analyst)'));
  assert.ok(n.text.includes('Submitted: Oct 5, 2026'));
  assert.doesNotMatch(n.html + n.text, /captcha/i);
});

test('careers confirmation thanks the applicant without promising an outcome or timeline', () => {
  const c = applicationConfirmationEmail(applicant, { siteUrl: 'https://www.doveautism.com' });
  assert.equal(c.subject, 'Application Received — Dove Autism');
  assert.ok(c.text.startsWith('Hello Jordan,'));
  assert.ok(c.text.includes('application for the BCBA (Board Certified Behavior Analyst) position'));
  assert.ok(c.text.includes('Our team will review the information you submitted.'));
  assert.doesNotMatch(c.text, /interview|hire|hiring|within|days|business|offer/i);
  assert.ok(!c.text.includes('555 010 2030'), 'contact details are not repeated back');
});
