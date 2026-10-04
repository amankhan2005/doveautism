/**
 * GET /api/site-info — public, non-secret contact details configured on the server.
 * Values that are not configured are returned as null and hidden by the client.
 */
export function makeSiteInfoController(publicInfo) {
  return function getSiteInfo(_req, res) {
    res.set('Cache-Control', 'public, max-age=300');
    res.json({
      phone: publicInfo.phone,
      email: publicInfo.email,
      address: publicInfo.address,
      hours: publicInfo.hours,
      social: Object.fromEntries(Object.entries(publicInfo.social).filter(([, url]) => Boolean(url))),
    });
  };
}
