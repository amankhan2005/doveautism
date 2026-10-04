/**
 * Minimal structured logger (JSON lines).
 * Never pass names, emails, phone numbers or message bodies to it.
 */
function write(level, event, meta = {}) {
  if (process.env.NODE_ENV === 'test' && level !== 'error') return;
  const line = JSON.stringify({ time: new Date().toISOString(), level, event, ...meta });
  (level === 'error' ? console.error : console.log)(line);
}

export const logger = {
  info: (event, meta) => write('info', event, meta),
  warn: (event, meta) => write('warn', event, meta),
  error: (event, meta) => write('error', event, meta),
};
