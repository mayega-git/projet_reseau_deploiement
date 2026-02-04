'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchRedacteurByEmail } from '@/lib/FetchNewsletterData';
import type { RedacteurRequestStatus } from '@/types/newsletter';

const normalizeStatus = (status?: string | null): RedacteurRequestStatus | null => {
  if (!status) return null;
  const normalized = status.toUpperCase();
  if (normalized === 'APPROUVED') return 'APPROVED';
  if (normalized === 'PENDING') return 'PENDING';
  if (normalized === 'APPROVED') return 'APPROVED';
  if (normalized === 'REJECTED') return 'REJECTED';
  return null;
};

const RedacteurAccessGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const storedEmail = localStorage.getItem('newsletterRedacteurEmail') || '';
      const email = user?.sub || storedEmail;

      if (!email) {
        router.replace('/newsletter/redacteur');
        return;
      }

      const result = await fetchRedacteurByEmail(email);
      const status = normalizeStatus(result?.status);

      if (status === 'APPROVED') {
        if (result?.id) {
          localStorage.setItem('newsletterRedacteurId', result.id);
        }
        localStorage.setItem('newsletterRedacteurEmail', email);
        setAllowed(true);
      } else {
        router.replace('/newsletter/redacteur');
      }
    };

    checkAccess().finally(() => setChecking(false));
  }, [router, user?.sub]);

  if (checking) {
    return (
      <div className="container py-8">
        <p className="paragraph-medium-normal text-black-300">Chargement...</p>
      </div>
    );
  }

  return allowed ? <>{children}</> : null;
};

export default RedacteurAccessGuard;