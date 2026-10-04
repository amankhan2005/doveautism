import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';

process.env.NODE_ENV = 'test';

const valid = () => ({
  name: 'Maria Lopez',
  email: 'Maria@Example.com',
  phone: '',
  preferredContact: 'email',
  service: 'in-home-aba',
  message: 'We would like to learn more about in-home sessions.',
  consent: true,
  website: '',
  startedAt: Date.now() - 10_000,
});

function serve(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}

async function post(base, body) {
  const res = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}

let calls = [];
let mode = 'ok';
let configured = true;
let ctx;

before(async () => {
  const app = createApp({
    env: { ...env, contactRateLimit: { windowMs: 60_000, max: 100 } },
    serveClient: true,
    isEmailConfigured: () => configured,
    recordInquiry: () => {},
    sendInquiryEmails: async (data) => {
      calls.push(data);
      if (mode === 'fail') {
        const err = new Error('fail');
        err.reason = 'resend_error';
        throw err;
      }
      return { notificationId: 'test', confirmationSent: mode !== 'noconfirm' };
    },
  });
  ctx = await serve(app);
});
after(() => ctx.server.close());

test('valid submission sends email and returns ok', async () => {
  calls = [];
  mode = 'ok';
  const r = await post(ctx.base, valid());
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.equal(r.body.confirmationSent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].email, 'maria@example.com', 'email is normalized');
});

test('reports when the confirmation email was not sent', async () => {
  mode = 'noconfirm';
  const r = await post(ctx.base, valid());
  assert.equal(r.status, 200);
  assert.equal(r.body.confirmationSent, false);
  mode = 'ok';
});

test('invalid fields return 400 with field errors and send nothing', async () => {
  calls = [];
  const r = await post(ctx.base, { ...valid(), name: '', email: 'nope', service: 'surgery', message: 'hi', consent: false });
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'VALIDATION_ERROR');
  assert.deepEqual(Object.keys(r.body.errors).sort(), ['consent', 'email', 'message', 'name', 'service']);
  assert.equal(calls.length, 0);
});

test('phone becomes required when phone is the preferred method', async () => {
  const r = await post(ctx.base, { ...valid(), preferredContact: 'phone', phone: '' });
  assert.equal(r.status, 400);
  assert.ok(r.body.errors.phone);
});

test('honeypot submissions get a generic 200 and send nothing', async () => {
  calls = [];
  const r = await post(ctx.base, { ...valid(), website: 'http://spam.example' });
  assert.equal(r.status, 200);
  assert.equal(calls.length, 0);
});

test('submissions faster than the minimum fill time are rejected', async () => {
  calls = [];
  const r = await post(ctx.base, { ...valid(), startedAt: Date.now() });
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'SUBMISSION_CHECK_FAILED');
  assert.equal(calls.length, 0);
});

test('returns 503 when email is not configured', async () => {
  configured = false;
  const r = await post(ctx.base, valid());
  configured = true;
  assert.equal(r.status, 503);
  assert.equal(r.body.ok, false);
});

test('returns 502 and never claims success when delivery fails', async () => {
  mode = 'fail';
  const r = await post(ctx.base, valid());
  mode = 'ok';
  assert.equal(r.status, 502);
  assert.equal(r.body.ok, false);
  assert.equal(r.body.code, 'DELIVERY_FAILED');
});

test('rejects malformed JSON and oversized bodies', async () => {
  const bad = await fetch(`${ctx.base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
  assert.equal(bad.status, 400);
  const big = await fetch(`${ctx.base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...valid(), message: 'x'.repeat(20_000) }),
  });
  assert.equal(big.status, 413);
});

test('rate limiter returns 429 after the limit', async () => {
  const app = createApp({
    env: { ...env, contactRateLimit: { windowMs: 60_000, max: 2 } },
    serveClient: false,
    isEmailConfigured: () => true,
    recordInquiry: () => {},
    sendInquiryEmails: async () => ({ confirmationSent: true }),
  });
  const { server, base } = await serve(app);
  const statuses = [];
  for (let i = 0; i < 3; i++) statuses.push((await post(base, valid())).status);
  server.close();
  assert.deepEqual(statuses, [200, 200, 429]);
});

test('site-info exposes only public fields', async () => {
  const res = await fetch(`${ctx.base}/api/site-info`);
  const body = await res.json();
  assert.deepEqual(Object.keys(body).sort(), ['address', 'email', 'hours', 'phone', 'social']);
});

test('sitemap and robots are generated from the route table', async () => {
  const sitemap = await (await fetch(`${ctx.base}/sitemap.xml`)).text();
  for (const p of ['/about', '/services', '/contact', '/privacy-policy']) assert.ok(sitemap.includes(`${env.siteUrl}${p}`), p);
  const robots = await (await fetch(`${ctx.base}/robots.txt`)).text();
  assert.match(robots, /Sitemap: .*\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/api\//);
});

test('pages get route-specific head tags; unknown routes return 404', async () => {
  const about = await fetch(`${ctx.base}/about`);
  const html = await about.text();
  assert.equal(about.status, 200);
  assert.match(html, /<title>About Us \| Dove Autism<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.doveautism\.com\/about"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.equal((html.match(/<title>/g) || []).length, 1, 'only one title tag');

  const services = await (await fetch(`${ctx.base}/services`)).text();
  assert.equal((services.match(/"@type":"Service"/g) || []).length, 4);

  const missing = await fetch(`${ctx.base}/no-such-page`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /noindex/);

  const slash = await fetch(`${ctx.base}/about/`, { redirect: 'manual' });
  assert.equal(slash.status, 301);
  assert.equal(slash.headers.get('location'), '/about');
});

test('security headers are set and secrets never reach the client', async () => {
  const res = await fetch(`${ctx.base}/`);
  assert.ok(res.headers.get('content-security-policy'));
  assert.equal(res.headers.get('x-powered-by'), null);
  const html = await res.text();
  assert.doesNotMatch(html, /RESEND|re_[A-Za-z0-9]{8,}/);
});
