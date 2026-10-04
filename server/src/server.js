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

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // On macOS, port 5000 belongs to AirPlay Receiver; anything calling the API would get its 403 instead.
    logger.error('server.port_in_use', { port: env.port, hint: 'Another program is using this port. Set PORT in server/.env to a free port and match it in the Vite proxy.' });
  } else {
    logger.error('server.listen_failed', { port: env.port, code: err.code });
  }
  process.exit(1);
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
