'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let cachedToken = null;
let tokenExpiry = 0;

export async function getJwtToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  const res = await fetch('/api/auth/token', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = data.token;
  tokenExpiry = Date.now() + 1000 * 60 * 10; // cache for 10 mins
  return cachedToken;
}

export function clearCachedToken() {
  cachedToken = null;
  tokenExpiry = 0;
}

export async function apiFetch(endpoint, options = {}) {
  const { authRequired = false, headers = {}, body, ...rest } = options;
  const reqHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (authRequired) {
    const token = await getJwtToken();
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: reqHeaders,
    body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
