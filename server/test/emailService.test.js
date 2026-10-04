import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Configure fake Resend settings BEFORE the env module loads, then intercept the SDK's HTTP calls.
process.env.RESEND_API_KEY = 're_test_not_a_real_key';
process.env.CONTACT_EMAIL = 'team@example.org';
process.env.FROM_EMAIL = 'Dove Autism <website@example.org>';

const realFetch = globalThis.fetch;
let requests = [];
let failFor = null; // recipient whose send should fail

before(() => {
  globalThis.fetch = async (url, init = {}) => {
    const body = JSON.parse(init.body);
    requests.push({ url: String(url), headers: init.headers, body });
    if (failFor && body.to.includes(failFor)) {
      return new Response(JSON.stringify({ name: 'validation_error', message: 'nope', statusCode: 422 }), { status: 422, headers: { 'content-type': 'application/json' } });
    }
    return new Response(JSON.stringify({ id: `email_${requests.length}` }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
});
after(() => {
  globalThis.fetch = realFetch;
});

const applicant = { firstName: 'Jordan', lastName: 'Lee', email: 'jordan@example.com', phone: '555 010 2030', state: 'NJ', role: 'RBT' };

test('careers application sends the admin notification and the applicant confirmation through Resend', async () => {
  requests = [];
  const { sendApplicationEmails } = await import('../src/services/email.service.js');
  const result = await sendApplicationEmails(applicant);
  assert.equal(result.confirmationSent, true);
  assert.equal(requests.length, 2);
  for (const r of requests) assert.match(r.url, /^https:\/\/api\.resend\.com\/emails/);

  const [admin, confirm] = requests.map((r) => r.body);
  assert.deepEqual(admin.to, ['team@example.org']);
  assert.equal(admin.subject, 'New Careers Application — RBT — Jordan Lee');
  assert.equal(admin.reply_to ?? admin.replyTo, 'jordan@example.com');
  assert.deepEqual(confirm.to, ['jordan@example.com']);
  assert.equal(confirm.subject, 'Application Received — Dove Autism');
  assert.equal(confirm.from, 'Dove Autism <website@example.org>');
});

test('a failed applicant confirmation is reported, a failed admin notification throws', async () => {
  const { sendApplicationEmails } = await import('../src/services/email.service.js');
  failFor = 'jordan@example.com';
  const partial = await sendApplicationEmails(applicant);
  assert.equal(partial.confirmationSent, false);

  failFor = 'team@example.org';
  await assert.rejects(() => sendApplicationEmails(applicant), { name: 'EmailDeliveryError' });
  failFor = null;
});
