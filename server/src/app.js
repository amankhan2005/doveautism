import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { env as defaultEnv, isEmailConfigured as defaultIsEmailConfigured } from './config/env.js';
import { REDIRECTS } from './config/redirects.js';
import { requestId } from './middleware/requestId.js';
import { redirects } from './middleware/redirects.js';
import { apiNotFound, errorHandler } from './middleware/errorHandler.js';
import { apiRoutes } from './routes/api.routes.js';
import { seoRoutes } from './routes/seo.routes.js';
import { sendInquiryEmails as defaultSender, sendApplicationEmails as defaultApplicationSender } from './services/email.service.js';
import { recordInquiry as defaultRecorder } from './services/inquiryLog.service.js';
import { renderPage } from './utils/renderPage.js';

/**
 * App factory. Dependencies are injectable so tests can replace the email
 * senders without touching Resend.
 */
export function createApp({
  env = defaultEnv,
  sendInquiryEmails = defaultSender,
  sendApplicationEmails = defaultApplicationSender,
  isEmailConfigured = defaultIsEmailConfigured,
  recordInquiry = defaultRecorder,
  serveClient = true,
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  app.use(requestId);
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'"],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'"],
          'connect-src': ["'self'"],
          'frame-ancestors': ["'none'"],
          'form-action': ["'self'"],
          'upgrade-insecure-requests': env.isProd ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: env.isProd ? undefined : false,
    })
  );
  app.use(compression());
  app.use(redirects(REDIRECTS));

  // API: same-origin by default; extra origins only via CORS_ORIGINS.
  app.use(
    '/api',
    cors({
      origin(origin, cb) {
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    }),
    express.json({ limit: '10kb' }),
    apiRoutes({ env, sendInquiryEmails, sendApplicationEmails, isEmailConfigured, recordInquiry }),
    apiNotFound
  );

  app.use(seoRoutes({ siteUrl: env.siteUrl }));

  const hasClientBuild = serveClient && fs.existsSync(path.join(env.clientDist, 'index.html'));
  if (hasClientBuild) {
    app.use(
      '/assets',
      express.static(path.join(env.clientDist, 'assets'), { immutable: true, maxAge: '1y', index: false })
    );
    app.use(express.static(env.clientDist, { index: false, maxAge: '1d' }));
    app.get('*', async (req, res, next) => {
      try {
        const { html, status } = await renderPage(req.path);
        res.status(status).set('Cache-Control', 'no-cache').type('html').send(html);
      } catch (err) {
        next(err);
      }
    });
  }

  app.use(errorHandler);
  return app;
}
