# Dove Autism — website

Production source for the Dove Autism website: a React (Vite) front end, an Express
back end that serves the built site and handles the contact form, Resend for email,
and optional MongoDB for anonymous inquiry counts.

```
client/   React 18, React Router 7, Framer Motion, CSS Modules (Vite 7)
server/   Express 4 API, Resend email, optional Mongoose model, SEO routes, tests
shared/   Validation schema + SEO route table used by BOTH client and server
docs/     Launch checklist, content approval, privacy review, redirects, QA report, brand notes
```

Read these before launch:

| File | Purpose |
| --- | --- |
| `docs/LAUNCH_CHECKLIST.md` | Everything done, and everything still needed, grouped by owner |
| `docs/CLIENT_INPUTS.md` | The short list of information Dove Autism must provide or approve |
| `docs/CONTENT_APPROVAL.md` | Every piece of site copy: original, modified, or new |
| `docs/PRIVACY_REVIEW.md` | Technical privacy review of the contact form (not a legal opinion) |
| `docs/URL_REDIRECTS.md` | Verified old → new URL map |
| `docs/QA_REPORT.md` | Commands run and actual results |
| `docs/BRAND.md` | Logo usage rules and the logo-derived palette |

---

## 1. Requirements

- **Node.js 20.19+ or 22.12+** (Vite 7 requirement) and npm 10+
- A **Resend** account with a **verified sending domain** (for the contact form)
- **MongoDB** — optional

## 2. Local development

```bash
npm run install:all                     # installs client/ and server/ dependencies
cp server/.env.example server/.env      # then fill in values (section 5)
cp client/.env.example client/.env      # optional
```

Run two terminals:

```bash
npm run dev:server     # Express API on http://localhost:5050 (restarts on change)
npm run dev:client     # Vite on http://localhost:5173 — proxies /api, /sitemap.xml, /robots.txt to :5050
                       # (port 5000 is avoided: macOS AirPlay Receiver answers it with 403)
```

Open http://localhost:5173.

### Frontend (`client/`)

- Routes: `client/src/App.jsx` — `/`, `/about`, `/services`, `/contact`, `/privacy-policy`, `/team/:slug`, 404.
- **All copy lives in `client/src/content/`.** Check `docs/CONTENT_APPROVAL.md` before editing.
- Design tokens: `client/src/styles/tokens.css`. Logo component: `client/src/components/ui/Logo.jsx`.
- Brand files: `client/public/brand/` (official logo). Favicons: `client/public/`. Photos and placeholders: `client/public/images/` (see 2a).
- Animations use Framer Motion `LazyMotion` + `domAnimation`; `prefers-reduced-motion` is respected globally.

### Backend (`server/`)

- Entry: `server/src/server.js`. App factory: `server/src/app.js`.
- API: `GET /api/health`, `GET /api/site-info`, `POST /api/contact`.
- SEO: `GET /sitemap.xml`, `GET /robots.txt`. Every page request gets route-specific `<head>` tags injected server-side.
- Tests: `npm --prefix server test` (17 tests; a fake email sender is injected, so Resend is never called).

### MongoDB (optional)

The site runs fully without MongoDB. If `MONGODB_URI` is set **and** `STORE_INQUIRY_METADATA=true`,
the server records anonymous metadata per inquiry (service category, preferred contact method,
email delivery status, timestamp) in the `inquiries` collection, which expires records after 180 days.
**Names, emails, phone numbers and messages are never stored.** Changing that requires client and
privacy approval (see `docs/PRIVACY_REVIEW.md`).

## 2a. Photography (placeholders → licensed photos)

**All website image files live under `client/public/`** and are referenced with root-relative paths
(e.g. `/images/placeholders/home-why.jpg`). Nothing under `src/` is an image file.

```
client/public/images/placeholders/   black test placeholders currently shown (8 files, ~13 KB each)
client/public/images/photos/         final licensed photos (written by `npm run photos`)
client/src/content/photos.js         slot registry: id, path, alt, location, size, ratio, placeholder flag, license record
```

| Slot id | Page / location | Frame ratio | Placeholder path |
| --- | --- | --- | --- |
| `home-why` | Home › Why choose us? | 4 : 5 | `/images/placeholders/home-why.jpg` (960×1200) |
| `home-cta` | Home › closing CTA panel | 4 : 3 | `/images/placeholders/home-cta.jpg` (1200×900) |
| `about-hero` | About › page header (high priority) | 4 : 3 | `/images/placeholders/about-hero.jpg` (1200×900) |
| `about-family` | About › Support for the whole family | 16 : 9 | `/images/placeholders/about-family.jpg` (1280×720) |
| `services-early-intervention` | Services › Early intervention | 4 : 3* | `/images/placeholders/services-early-intervention.jpg` (1200×900) |
| `services-in-home-aba` | Services › In-home ABA | 4 : 3* | `/images/placeholders/services-in-home-aba.jpg` (1200×900) |
| `services-school-readiness` | Services › School readiness | 4 : 3* | `/images/placeholders/services-school-readiness.jpg` (1200×900) |
| `services-family-support` | Services › Family training & coordinated care | 4 : 3* | `/images/placeholders/services-family-support.jpg` (1200×900) |

\* Service panels cap at 400 px tall on tablet/desktop, so the photo is cover-cropped inside the panel.

Every frame uses `object-fit: cover` with a fixed aspect ratio, so a real photo occupies exactly the
placeholder's space. To replace a placeholder:

1. Get a licensed photo (stock license on file, or an owned photo with signed releases for every identifiable person).
2. **Recommended:** save the original as `client/photos-src/<slot-id>.jpg` and run `npm run photos` from `client/`
   (AVIF + WebP at 480–1600 px into `public/images/photos/`, EXIF/GPS stripped, ~3 s per photo).
   **Or:** put one optimized file in `client/public/images/photos/`, set the slot's `src` to its path and update `width`/`height`.
3. In `photos.js`, set `placeholder: false`, write accurate `alt`, and fill `license`, `source`, `sourceUrl`, `credit`.
   A non-placeholder slot will not render without `alt` and `license`.
4. `npm run build`, check the page, and optionally delete the unused placeholder file.

Stock photos are illustrative only: never imply the people shown are Dove Autism clients, families or staff.

## 3. Production build

```bash
npm run install:all
npm run build          # → client/dist (hashed assets + index.html with an SEO placeholder)
```

## 4. Production start

```bash
npm start              # runs server/ with NODE_ENV=production; serves the API and client/dist on PORT
```

On Windows (no POSIX env syntax), set `NODE_ENV=production` in the environment and run
`node server/src/server.js`, or use your process manager.

Health check for your host or load balancer: `GET /api/health` → `{"ok":true,...}`.

## 5. Environment variables

### `server/.env` — server only, never sent to the browser

| Variable | Secret? | Required | Used in | Purpose |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | no | yes (prod) | `config/env.js` | `production` enables template caching, HSTS, HTTPS upgrade |
| `PORT` | no | no | `server.js` | Listen port (default 5000) |
| `SITE_URL` | no | **yes** | SEO head, sitemap, robots, email logo URL | Final public URL, e.g. `https://www.doveautism.com` (no trailing slash) |
| `TRUST_PROXY` | no | yes behind a proxy | `app.js` | Number of proxies in front of Node (usually `1`) so rate limiting sees real IPs |
| `CORS_ORIGINS` | no | no | `app.js` | Extra origins allowed to call `/api`, comma-separated. Leave empty: the site is same-origin |
| `RESEND_API_KEY` | **YES** | **yes** | `services/email.service.js` | Resend API key |
| `CONTACT_EMAIL` | private | **yes** | `services/email.service.js` | Inbox(es) that receive inquiries, comma-separated |
| `FROM_EMAIL` | no | **yes** | `services/email.service.js` | Sender on a Resend-verified domain, e.g. `Dove Autism <website@doveautism.com>` |
| `SEND_CONFIRMATION_EMAIL` | no | no | `services/email.service.js` | `true` (default) emails the family a confirmation |
| `CONTACT_RATE_LIMIT_MAX` | no | no | `middleware/rateLimit.js` | Submissions per 15 min per IP (default 5) |
| `MONGODB_URI` | **YES** | no | `config/db.js` | Enables the optional anonymous inquiry log |
| `STORE_INQUIRY_METADATA` | no | no | `services/inquiryLog.service.js` | `true` to record anonymous metadata |
| `PUBLIC_PHONE`, `PUBLIC_EMAIL`, `PUBLIC_ADDRESS`, `PUBLIC_HOURS` | no | no | `GET /api/site-info` → footer + contact page | Public contact details; hidden when empty |
| `PUBLIC_SOCIAL_FACEBOOK`, `_INSTAGRAM`, `_LINKEDIN` | no | no | `GET /api/site-info` → footer | Social links; hidden when empty |

### `client/.env` — build time and **public** (baked into the JavaScript)

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Must equal `SITE_URL`. Used for canonical/OG tags during client-side navigation. Rebuild after changing |
| `VITE_API_URL` | Leave empty (same origin). Only set if the API is hosted elsewhere |

Never put secrets in `client/.env`; anything prefixed `VITE_` is visible to visitors.
Never commit `.env` files (they are git-ignored). In production, set variables in the host's
environment/secret settings.

## 6. Resend setup

1. Create a Resend account and **add the sending domain** (e.g. `doveautism.com` or a subdomain such as `mail.doveautism.com`).
2. Add the DNS records Resend shows (SPF/DKIM, plus the recommended DMARC record) at the domain's DNS provider. Wait until Resend marks the domain **Verified**.
3. Create an API key with **sending access only** and store it as `RESEND_API_KEY` in the server environment.
4. Set `FROM_EMAIL` to an address on the verified domain and `CONTACT_EMAIL` to the inbox that should receive inquiries.
5. Restart the server. `GET /api/health` must now show `"email":"configured"`.

**End-to-end test (required before launch — not yet performed; no credentials were available):**

1. On the deployed site, open `/contact` and submit the form using an inbox you control as the family email.
2. Confirm the team inbox receives "New website inquiry — Dove Autism", that **Reply** addresses the family, and that the logo loads (it is served from `SITE_URL`).
3. Confirm the family inbox receives "We received your message — Dove Autism".
4. Check the Resend dashboard shows both as delivered.
5. Optional failure test: set an invalid `RESEND_API_KEY` temporarily; the form must say the message was **not** sent.

Without configuration, `POST /api/contact` returns **503** and the form tells the visitor the message
was not sent. The UI never shows success unless Resend accepted the team notification.

## 7. Deployment

No hosting provider is configured in this project. Any host that runs a long-lived Node.js
process works (a VPS with Nginx, or a managed Node platform):

1. Provision Node 20.19+ / 22.12+.
2. `npm run install:all && npm run build` (on the host or in CI).
3. Set the server environment variables (section 5) in the host's settings.
4. Start with `npm start` under a process manager (systemd, PM2, or the platform's runner).
5. Put HTTPS in front (platform TLS or a reverse proxy) and set `TRUST_PROXY=1`.
6. Point the health check at `/api/health`.

Example Nginx reverse proxy:

```nginx
server {
  listen 443 ssl http2;
  server_name www.doveautism.com;
  # ssl_certificate ...; ssl_certificate_key ...;
  location / {
    proxy_pass http://127.0.0.1:5050;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 8. Domain configuration

- The canonical domain in this project is **`https://www.doveautism.com`** (the current site's address). Confirm it.
- Point DNS for `www` and the apex domain at the host.
- Redirect `http://` → `https://` and `doveautism.com` → `www.doveautism.com` with **301** at the proxy/platform.
- Set `SITE_URL` (server) and `VITE_SITE_URL` (client, then rebuild) to the same value.
- HSTS is sent automatically in production, so enable production mode only once TLS works.

## 9. SEO configuration

- Titles, descriptions and structured data for every route: `shared/seo.js` (used by server and client).
- Metadata is already in the HTML each page is served with, so crawlers and link previews need no JavaScript.
- `/sitemap.xml` and `/robots.txt` are generated from `shared/seo.js` and `SITE_URL`.
- Structured data uses only verified facts (Organization, WebSite, WebPage, BreadcrumbList, Service).
  Add `LocalBusiness` (address, phone, hours) **only after** those details are confirmed.
- After launch: verify the domain in Google Search Console and submit `/sitemap.xml`.

## 10. URL redirects

- Legacy redirects: `server/src/config/redirects.js` (`'/old-path': '/new-path'`, served as 301).
- Trailing slashes are normalized automatically (`/about/` → `/about`).
- Only the current site's homepage URL is verified; the old subpage URLs must come from the client
  before they can be mapped. See `docs/URL_REDIRECTS.md`.

## 11. Security notes

- The Resend key and MongoDB URI are server-only. The client bundle and HTML were scanned for secrets in QA.
- Helmet sets a strict Content-Security-Policy (`self` only), `X-Content-Type-Options`, `Referrer-Policy`, frame blocking, and HSTS in production.
- `POST /api/contact`: 10 kB body limit, rate limit, server-side validation and normalization, honeypot plus minimum fill time, HTML-escaped email output.
- Logs contain request id, status and service category — never names, emails, phone numbers or messages.

## 12. Tests and checks

```bash
npm --prefix server test       # 17 tests
npm --prefix client audit      # dependency audit
npm --prefix server audit
```

Lint/type checking is not configured (plain JavaScript). Browser QA results (functional,
accessibility, performance) are recorded in `docs/QA_REPORT.md`.

## Credits

Designed & Developed by WebieApp Solutions LLC — https://www.webieapp.com/
