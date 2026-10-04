import { createApp } from './app.js';
import { env, missingEmailVars } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { logger } from './utils/logger.js';

const missing = missingEmailVars();
if (missing.length) {
  // Names only — never values.
  logger.warn('email.not_configured', { missing });
}

await connectDb();

const app = createApp();
const server = app.listen(env.port, () => {
  logger.info('server.started', { port: env.port, env: env.nodeEnv });
});

function shutdown(signal) {
  logger.info('server.stopping', { signal });
  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
