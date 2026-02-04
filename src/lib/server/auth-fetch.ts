// src/lib/server/auth-fetch.ts
// Server-only authenticated fetch utility.
// Reads the gateway accessToken from cookies, injects the Authorization
// header, and calls the target microservice directly — no extra HTTP hop.
//
// Usable in: Server Components, Server Actions, API Routes.

import { cookies } from 'next/headers';

/**
 * Perform an authenticated fetch to a backend microservice.
 *
 * - Reads `accessToken` from the request cookies (HttpOnly).
 * - Injects `Authorization: Bearer <token>` automatically.
 * - If no token is available the request is still sent (some endpoints
 *   may be public); the backend will decide.
 */
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // Debug log to verify the exact URL being requested
  console.log('🌐 [authFetch] Requesting:', url);
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Ensure Content-Type is set for requests with a body, unless it is
  // FormData (the browser/node will set the correct multipart boundary).
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
    // Disable Next.js cache for API calls by default to avoid stale data
    cache: 'no-store',
  });
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/**
 * Authenticated fetch that parses the JSON response.
 * Returns `null` when the response is not ok.
 */
export async function authFetchJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> {
  const res = await authFetch(url, options);
  if (!res.ok) return null;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  // If not JSON, return null or potentially the text if T allows it
  return null;
}

/**
 * Same as authFetchJson but unwraps a `{ data: T }` envelope which
 * several of the backend services return.
 */
export async function authFetchData<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> {
  const res = await authFetch(url, options);
  if (!res.ok) return null;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = await res.json();
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data as T;
    }
    return json as T;
  }

  return null;
}

/**
 * Authenticated fetch for binary data (images, audio).
 * Returns the body as a number[] (Uint8Array contents).
 */
export async function authFetchBinary(url: string): Promise<number[]> {
  const res = await authFetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch binary from ${url}: ${res.status}`);
  }
  const buf = await res.arrayBuffer();
  return Array.from(new Uint8Array(buf));
}
