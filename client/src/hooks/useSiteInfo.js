import { useEffect, useState } from 'react';
import { fetchSiteInfo } from '../utils/api.js';

let cache = null;
let inflight = null;

/**
 * Public contact details configured on the server (GET /api/site-info).
 * Returns { status: 'loading' | 'ready' | 'error', info }.
 * Unconfigured values are null and should be hidden by the caller.
 */
export function useSiteInfo() {
  const [state, setState] = useState(() => (cache ? { status: 'ready', info: cache } : { status: 'loading', info: null }));

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    inflight ??= fetchSiteInfo().then((info) => (cache = info));
    inflight
      .then((info) => active && setState({ status: 'ready', info }))
      .catch(() => {
        inflight = null;
        if (active) setState({ status: 'error', info: null });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export const hasContactDetails = (info) => Boolean(info && (info.phone || info.email || info.address || info.hours));
