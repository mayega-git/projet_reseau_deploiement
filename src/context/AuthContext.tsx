'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';
import { AppRoles } from '@/constants/roles';
import {
  login as serverLogin,
  logout as serverLogout,
  signup as serverSignup,
  signupOrganisation as serverSignupOrganisation,
  type AuthResult,
} from '@/actions/auth';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthContextType {
  
  /** Decoded user info (from the HttpOnly cookie) — null when not logged in */
  user: User | null;
  /** User roles shortcut */
  role: string[] | null;
  /** True while a login/signup request is in flight */
  isLoading: boolean;
  /** Call the server action to log in, then update local state */
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Call the server action to sign up */
  signup: (
    firstName: string,
    lastName: string,
    bio: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  /** Call the server action to sign up an organisation */
  signupOrganisation: (
    firstName: string,
    domain: string,
    bio: string,
    description: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  /** Clear session cookies and reset state */
  logout: () => Promise<void>;
  /** Update local user state after a role change (e.g. become author) */
  refreshUser: (user: User) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  /** Pre-loaded user from the Server Component (RootLayout) */
  initialUser?: User | null;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialUser = null,
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [role, setRole] = useState<string[] | null>(initialUser?.roles ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Determine where to redirect based on roles
  const redirectByRole = useCallback(
    (roles: string[]) => {
      if (
        roles.includes(AppRoles.SUPER_ADMIN) ||
        roles.includes(AppRoles.ADMIN) ||
        roles.includes(AppRoles.AUTHOR) ||
        roles.includes(AppRoles.PENDING_ORGANISATION)
      ) {
        router.push('/u/dashboard');
      } else if (roles.length === 1 && roles.includes(AppRoles.USER)) {
        router.push('/u/feed/blog');
      }
    },
    [router],
  );

  // ---- Login ----
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await serverLogin(email, password);
        if (result.success && result.user) {
          setUser(result.user);
          setRole(result.user.roles ?? null);
          redirectByRole(result.user.roles ?? []);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectByRole],
  );

  // ---- Signup ----
  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      bio: string,
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await serverSignup(firstName, lastName, bio, email, password);
        if (result.success && result.user) {
          setUser(result.user);
          setRole(result.user.roles ?? null);
          redirectByRole(result.user.roles ?? []);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectByRole],
  );

  // ---- Signup Organisation ----
  const signupOrganisation = useCallback(
    async (
      firstName: string,
      domain: string,
      bio: string,
      description: string,
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await serverSignupOrganisation(firstName, domain, bio, description, email, password);
        if (result.success && result.user) {
          setUser(result.user);
          setRole(result.user.roles ?? null);
          redirectByRole(result.user.roles ?? []);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectByRole],
  );

  // ---- Logout ----
  const logout = useCallback(async () => {
    await serverLogout();
    setUser(null);
    setRole(null);
    router.push('/auth/login');
  }, [router]);

  // ---- Refresh user (after role upgrade, etc.) ----
  const refreshUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setRole(updatedUser.roles ?? null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, isLoading, login, signup, signupOrganisation, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
