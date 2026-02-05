// src/middleware.ts
// Centralised Next.js middleware that handles:
//    Gateway token lifecycle (init on first visit, proactive refresh)
//  Route protection for authenticated areas (/u/*)
//    Redirect already-authenticated users away from /auth/* pages

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  initGatewayToken,
  refreshGatewayToken,
  isTokenExpiringSoon,
  shouldReinit,
  getAuthConfigHash,
  TOKEN_LIFETIME_MS,
} from '@/lib/server/token-manager';

console.log('🔧 [Middleware] Middleware module loaded');

// Cookie options shared across all token cookies
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 h
  });
  response.cookies.set('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 5, // 5 h
  });
  
  // Set the config hash so we know which API key these tokens belong to
  response.cookies.set('authConfigHash', getAuthConfigHash(), {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  console.log('🍪 [Middleware] Cookies set (access, refresh, hash).');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Skip logging for static assets
  const isStaticAsset = pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf|eot|map|json)$/i);
  
  if (isStaticAsset) {
    return NextResponse.next();
  }

  console.log('🚦 [Middleware] ====== REQUEST ======');
  console.log('🚦 [Middleware] Path:', pathname);

  // ---------------------------------------------------------------
  // 1. GATEWAY TOKEN – ensure a valid accessToken cookie exists
  // ---------------------------------------------------------------
  let accessToken = request.cookies.get('accessToken')?.value;
  let refreshToken = request.cookies.get('refreshToken')?.value;
  const authConfigHash = request.cookies.get('authConfigHash')?.value;

  // Check if server config (API_KEY / CLIENT_ID) has changed
  const currentHash = getAuthConfigHash();
  console.log('🔐 [Middleware] Hash comparison:', { clientHash: authConfigHash?.slice(0,10), serverHash: currentHash?.slice(0,10), match: authConfigHash === currentHash });
  if (shouldReinit(authConfigHash)) {
      console.log('⚠️ [Middleware] API Config changed or missing hash. Forcing re-init...');
      // Clear local variables to force the "No token" logic below
      accessToken = undefined;
      refreshToken = undefined;
      // Note: We don't explicitly delete cookies here because setTokenCookies will overwrite them,
      // or if init fails, we might want to let them die naturally. 
      // But to be clean, we'll let the init logic handle obtaining new ones.
  }

  console.log('🚦 [Middleware] Cookies state:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  });

  if (!accessToken) {
    console.log('🔑 [Middleware] No accessToken found.');
    // No token at all – first connection or cookies expired
    if (refreshToken) {
      console.log('🔄 [Middleware] Refresh token found, attempting refresh...');
      // Try to refresh first
      const tokens = await refreshGatewayToken(refreshToken);
      if (tokens) {
        console.log('✅ [Middleware] Refresh successful, updating cookies.');
        setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
      } else {
        console.log('❌ [Middleware] Refresh failed, performing full init...',tokens);
        // Refresh failed – full init
        const initTokens = await initGatewayToken();
        if (initTokens) {
          console.log('✅ [Middleware] Init successful after failed refresh.');
          setTokenCookies(response, initTokens.accessToken, initTokens.refreshToken);
        }
      }
    } else {
      console.log(`🆕 [Middleware] No tokens at all for path: ${pathname}, performing fresh init...`);
      // No cookies at all – fresh init
      const tokens = await initGatewayToken();
      if (tokens) {
        console.log('✅ [Middleware] Fresh init successful.');
        setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
      } else {
        console.log('❌ [Middleware] Fresh init FAILED.');
      }
    }
  } else if (isTokenExpiringSoon(accessToken)) {
    console.log('⚠️ [Middleware] Access token expiring soon, proactive refresh...');
    // Token exists but expires within 1 minute – proactive refresh
    if (refreshToken) {
      const tokens = await refreshGatewayToken(refreshToken);
      if (tokens) {
        console.log('✅ [Middleware] Proactive refresh successful.');
        setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
      } else {
        console.log('❌ [Middleware] Proactive refresh failed.');
      }
    }
  } else {
    // Valid token, no refresh needed
    // console.log('✨ [Middleware] Access token is valid.');
  }

  // ---------------------------------------------------------------
  // 2. ROUTE PROTECTION – /u/* requires a userToken (logged-in user)
  // ---------------------------------------------------------------
  if (pathname.startsWith('/u')) {
    const userToken = request.cookies.get('userToken')?.value;
    if (!userToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---------------------------------------------------------------
  // 3. AUTH PAGES – redirect away if already logged in
  // ---------------------------------------------------------------
  if (pathname.startsWith('/auth/')) {
    const userToken = request.cookies.get('userToken')?.value;
    if (userToken) {
      return NextResponse.redirect(new URL('/u/feed/blog', request.url));
    }
  }

  return response;
}

// Only run middleware on pages, not on static assets or API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
