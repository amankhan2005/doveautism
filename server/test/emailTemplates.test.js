import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notificationEmail, confirmationEmail } from '../src/services/emailTemplates.js';

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
