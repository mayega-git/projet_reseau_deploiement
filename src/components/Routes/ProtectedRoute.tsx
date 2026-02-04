/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { token } = useAuth();
  const { logout } = useAuth();
  const [token, setToken] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  // const token = localStorage.getItem('token');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRedacteurId = localStorage.getItem('newsletterRedacteurId');
    const isNewsletterRoute =
      pathname.startsWith('/u/newsletter') ||
      pathname.startsWith('/newsletter/create') ||
      pathname.startsWith('/newsletter/update');
    if (storedToken) {
      setToken(storedToken);
    } else if (!storedToken && isNewsletterRoute) {
      setToken(storedRedacteurId || 'redacteur-check');
    } else if (!storedToken) {
      // console.log(token, 'token logged in protectedroute');
      console.log(storedToken, 'storedtoken logged in protectedroute');
      logout();
    }
  }, [logout, pathname, router]);

  return <>{token ? children : null}</>;
};

export default ProtectedRoute;