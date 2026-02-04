// src/lib/server/token-manager.ts
// Server-only gateway token lifecycle: init & refresh.
// These functions talk to the backend API Gateway and return raw tokens.
// Cookie persistence is handled by the caller (middleware or Server Action).

import { ServiceURLs } from './services';

const API_KEY = process.env.API_KEY ?? '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID ?? '';

// Token lifetime in milliseconds (1 hour)
export const TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generates a simple hash/signature of the current API configuration.
 * Used to detect if the server-side API_KEY or CLIENT_ID has changed.
 */
export function getAuthConfigHash(): string {
  // Simple Base64 of the combined keys is sufficient to detect changes.
  // We aren't hiding this from the client (cookies are HttpOnly), but even if we were,
  // this is just for change detection.
  if (typeof btoa === 'function') {
      return btoa(`${API_KEY}:${CLIENT_ID}`);
  } else {
      return Buffer.from(`${API_KEY}:${CLIENT_ID}`).toString('base64');
  }
}

/**
 * Checks if the provided client-side config hash matches the current server config.
 */
export function shouldReinit(clientHash: string | undefined): boolean {
  const currentHash = getAuthConfigHash();
  // If no client hash (first visit) or mismatch -> re-init
  return !clientHash || clientHash !== currentHash;
}

/**
 * First-connection flow: obtains an initial gateway token pair.
 * Uses X-API-KEY-GATEWAY + X-API-KEY-GATEWAY-CLIENT headers.
 */
export async function initGatewayToken(): Promise<TokenPair | null> {
  try {
    const res = await fetch(
      `${ServiceURLs.gateway}/apikeygateway/generateFirstConnection/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY-GATEWAY': API_KEY,
          'X-API-KEY-GATEWAY-CLIENT': CLIENT_ID,
        },
        body: JSON.stringify({}),
      },
    );

    if (!res.ok) {
      console.error('[token-manager] init failed:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log('[token-manager] init: Raw data received', {
      hasAccessToken: !!(data.access_token ?? data.accessToken),
      hasRefreshToken: !!(data.refresh_token ?? data.refreshToken),
    });

    const accessToken: string = data.access_token ?? data.accessToken ?? '';
    const refreshToken: string = data.refresh_token ?? data.refreshToken ?? '';

    if (!accessToken || !refreshToken) {
      console.error('[token-manager] init: missing tokens in response');
      return null;
    }

    console.log('[token-manager] init: SUCCESS. Tokens obtained.');
    return { accessToken, refreshToken };
  } catch (err) {
    console.error('[token-manager] init exception:', err);
    return null;
  }
}

/**
 * Refresh flow: exchanges a refresh token for a new token pair.
 */
export async function refreshGatewayToken(
  currentRefreshToken: string,
): Promise<TokenPair | null> {
  try {
    const res = await fetch(
      `${ServiceURLs.gateway}/apikeygateway/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      },
    );

    if (!res.ok) {
      console.error('[token-manager] refresh failed:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log('[token-manager] refresh: Raw data received', {
      hasAccessToken: !!(data.accessToken ?? data.access_token),
      hasRefreshToken: !!(data.refreshToken ?? data.refresh_token),
    });

    const accessToken: string = data.accessToken ?? data.access_token ?? '';
    const refreshToken: string = data.refreshToken ?? data.refresh_token ?? '';

    if (!accessToken) {
      console.error('[token-manager] refresh: missing accessToken');
      return null;
    }

    console.log('[token-manager] refresh: SUCCESS. New access token obtained.');
    return { accessToken, refreshToken: refreshToken || currentRefreshToken };
  } catch (err) {
    console.error('[token-manager] refresh exception:', err);
    return null;
  }
}

/**
 * Decode a JWT payload without verification (for reading `exp`).
 * Returns null on any parsing error.
 * Uses atob() for Edge Runtime compatibility.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[token-manager] JWT decode error: Token does not have 3 parts (header.payload.signature)');
      return null;
    }
    
    // Convert base64url to base64, then decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    // console.log('[token-manager] Decoded payload:', payload); // Uncomment to see full payload
    return payload;
  } catch (err) {
    console.error('[token-manager] JWT decode exception:', err);
    return null;
  }
}

/**
 * Returns true when the token expires within `marginMs` milliseconds.
 */
export function isTokenExpiringSoon(token: string, marginMs = 60_000): boolean {
  const payload = decodeJwtPayload(token);
  
  if (!payload || typeof payload.exp !== 'number') {
    console.log('[token-manager] isTokenExpiringSoon: Invalid payload or NO exp claim:', { 
      hasPayload: !!payload, 
      exp: payload?.exp 
    });
    return true; // treat as expired
  }
  
  const expiresAt = new Date(payload.exp * 1000);
  const now = Date.now();
  const timeLeftMs = payload.exp * 1000 - now;
  const timeLeftMinutes = (timeLeftMs / 60000).toFixed(2);
  
  // Log every check to debug the loop
  console.log('[token-manager] Token Check:', {
    expiresAt: expiresAt.toISOString(),
    now: new Date(now).toISOString(),
    timeLeftMinutes: `${timeLeftMinutes} min`,
    isExpiringSoon: timeLeftMs < marginMs
  });
  
  return timeLeftMs < marginMs;
}
