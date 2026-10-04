import { logger } from '../utils/logger.js';

export function apiNotFound(_req, res) {
  res.status(404).json({ ok: false, code: 'NOT_FOUND', message: 'This endpoint does not exist.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Your message is too long to send.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, code: 'BAD_REQUEST', message: 'The request could not be read.' });
  }
  logger.error('server.unhandled_error', { requestId: req.id, name: err.name });
  if (res.headersSent) return;
  res.status(500).json({ ok: false, code: 'SERVER_ERROR', message: 'Something went wrong on our side. Try again later.' });
}
