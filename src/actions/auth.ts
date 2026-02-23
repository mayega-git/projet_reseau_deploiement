'use server';

// src/actions/auth.ts
// Server Actions for authentication: login, signup, logout, getCurrentUser.
// The user JWT is stored in a HttpOnly cookie — never exposed to JS.

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { authFetch } from '@/lib/server/auth-fetch';
import { UserRoutes } from '@/lib/server/services';
import { User } from '@/types/User';

const USER_TOKEN_COOKIE = 'userToken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 h
};

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await authFetch(UserRoutes.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message ?? `Login failed (${res.status})`,
      };
    }

    const data = await res.json();
    // The user service may return the token at data.token or data.data.token
    const token: string = data.token ?? data.data?.token ?? '';

    if (!token) {
      return { success: false, error: 'No token received from server' };
    }

    // Store user JWT in HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(USER_TOKEN_COOKIE, token, COOKIE_OPTIONS);

    // Decode and return user info for the client context
    const decoded = jwtDecode<User>(token);
    return { success: true, user: decoded };
  } catch (err) {
    console.error('[auth action] login error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function loginOrganisation(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await authFetch(UserRoutes.organisationLogin, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message ?? `Login failed (${res.status})`,
      };
    }

    const data = await res.json();
    const token: string = data.token ?? data.data?.token ?? '';

    if (!token) {
      return { success: false, error: 'No token received from server' };
    }

    const cookieStore = await cookies();
    cookieStore.set(USER_TOKEN_COOKIE, token, COOKIE_OPTIONS);

    const decoded = jwtDecode<User>(token);
    return { success: true, user: decoded };
  } catch (err) {
    console.error('[auth action] loginOrganisation error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signup(
  firstName: string,
  lastName: string,
  bio: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const res = await authFetch(UserRoutes.create, {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, bio, email, password }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message ?? `Signup failed (${res.status})`,
      };
    }

    const data = await res.json();
    const token: string = data.token ?? data.data?.token ?? '';

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set(USER_TOKEN_COOKIE, token, COOKIE_OPTIONS);
      const decoded = jwtDecode<User>(token);
      return { success: true, user: decoded };
    }

    // Some backends don't return a token on signup, user has to login
    return { success: true };
  } catch (err) {
    console.error('[auth action] signup error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signupOrganisation(
  name: string,
  domain: string,
  bio: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const res = await authFetch(UserRoutes.organisation, {
      method: 'POST',
      body: JSON.stringify({ name, domain, bio, email, password }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.message ?? `Signup failed (${res.status})`,
      };
    }

    const data = await res.json();
    const token: string = data.token ?? data.data?.token ?? '';

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set(USER_TOKEN_COOKIE, token, COOKIE_OPTIONS);
      const decoded = jwtDecode<User>(token);
      return { success: true, user: decoded };
    }

    // Some backends don't return a token on signup, user has to login
    return { success: true };
  } catch (err) {
    console.error('[auth action] signupOrganisation error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_TOKEN_COOKIE);
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
}

export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USER_TOKEN_COOKIE)?.value ?? null;
}
