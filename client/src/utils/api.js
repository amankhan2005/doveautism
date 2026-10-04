/**
 * API client. Same-origin by default (Express serves the app in production,
 * Vite proxies /api in development). VITE_API_URL can point elsewhere.
 */
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', errors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: 'same-origin',
    });
  } catch (err) {
    clearTimeout(timer);
    if (signal?.aborted) throw err;
    throw new ApiError('We could not reach our server. Check your internet connection and try again.');
  }
  clearTimeout(timer);

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || payload?.ok === false) {
    if (import.meta.env.DEV && !payload) {
      // An empty, non-JSON error usually means something other than the Express API answered
      // (e.g. macOS AirPlay Receiver on port 5000 replies 403). Check the Vite proxy target and that the API is running.
      console.error(`[api] ${method} ${path} → HTTP ${res.status} with no JSON body (server: ${res.headers.get('server') || 'unknown'}).`);
    }
    throw new ApiError(payload?.message || 'Something went wrong. Try again in a few minutes.', {
      status: res.status,
      code: payload?.code || 'HTTP_ERROR',
      errors: payload?.errors || null,
    });
  }
  return payload;
}

export const submitContact = (data, opts) => request('/api/contact', { method: 'POST', body: data, ...opts });
export const submitApplication = (data, opts) => request('/api/careers/apply', { method: 'POST', body: data, ...opts });

export const fetchSiteInfo = (opts) => request('/api/site-info', opts);
