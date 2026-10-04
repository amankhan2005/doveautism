/** Trailing-slash normalization + legacy URL redirects (301). */
export function redirects(map) {
  return function redirectMiddleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const target = map[req.path];
    if (target) return res.redirect(301, target);
    if (req.path.length > 1 && req.path.endsWith('/') && !req.path.startsWith('/api/')) {
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(301, req.path.replace(/\/+$/, '') + query);
    }
    next();
  };
}
