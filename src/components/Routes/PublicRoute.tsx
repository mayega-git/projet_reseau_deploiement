'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
  authOnlyRedirect?: boolean; // optionnel, si true redirige les utilisateurs connectés
}

const PublicRoute = ({ children, authOnlyRedirect = true }: PublicRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;

    // Redirection uniquement pour les pages d'auth
    if (token && authOnlyRedirect && (path === '/auth/login' || path === '/auth/register')) {
      router.push('/u/feed/blog');
      return;
    }

    // Laisser l'utilisateur connecté accéder à la page d'accueil
    setLoading(false);
  }, [router, authOnlyRedirect]);

  if (loading) {
    return <div>Loading...</div>; // ou un spinner
  }

  return <>{children}</>;
};

export default PublicRoute;
