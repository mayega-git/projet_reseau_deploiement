'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
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
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [status, setStatus] = useState<RedacteurRequestStatus | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAccess = async () => {
      const email = user?.sub;

      console.log('[RedacteurAccessGuard] Checking access for email:', email);

      // If no email from auth context, user is not logged in
      if (!email) {
        console.log('[RedacteurAccessGuard] No email found, denying access');
        setStatus(null);
        setChecking(false);
        return;
      }

      try {
        // Always verify email against the backend
        console.log('[RedacteurAccessGuard] Calling fetchRedacteurByEmail with:', email);
        const result = await fetchRedacteurByEmail(email);
        console.log('[RedacteurAccessGuard] API result:', result, 'type:', typeof result);
        
        // The API can return:
        // - true (boolean): user is an approved redacteur
        // - false (boolean): user is not a redacteur
        // - RedacteurResponse object: contains id, status, etc.
        // - null: error or not found
        
        if (result === true) {
          // API returned true = user is an approved redacteur
          console.log('[RedacteurAccessGuard] User is approved (boolean response)');
          // We need to get the redacteur ID - use user.id as fallback since API doesn't provide it
          // The backend should ideally return the full object with ID
          localStorage.setItem('newsletterRedacteurEmail', email);
          setStatus('APPROVED');
          setAllowed(true);
        } else if (result && typeof result === 'object') {
          // API returned a RedacteurResponse object
          const normalizedStatus = normalizeStatus(result?.status);
          console.log('[RedacteurAccessGuard] Normalized status:', normalizedStatus);
          setStatus(normalizedStatus);

          if (normalizedStatus === 'APPROVED') {
            if (result?.id) {
              localStorage.setItem('newsletterRedacteurId', result.id);
              console.log('[RedacteurAccessGuard] Stored redacteurId:', result.id);
            }
            localStorage.setItem('newsletterRedacteurEmail', email);
            setAllowed(true);
          } else {
            localStorage.removeItem('newsletterRedacteurId');
            localStorage.removeItem('newsletterRedacteurEmail');
            setAllowed(false);
          }
        } else {
          // false or null = not a redacteur
          console.log('[RedacteurAccessGuard] User is not a redacteur');
          localStorage.removeItem('newsletterRedacteurId');
          localStorage.removeItem('newsletterRedacteurEmail');
          setStatus(null);
          setAllowed(false);
        }
      } catch (error) {
        console.error('[RedacteurAccessGuard] Error checking access:', error);
        localStorage.removeItem('newsletterRedacteurId');
        localStorage.removeItem('newsletterRedacteurEmail');
        setStatus(null);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [user?.sub]);

  if (checking) {
    return (
      <div className="container py-8">
        <p className="paragraph-medium-normal text-black-300">Chargement...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold">Acces redacteur requis</h2>
          {status === 'PENDING' && (
            <p className="text-black-300">Votre demande est en attente d&apos;approbation.</p>
          )}
          {status === 'REJECTED' && (
            <p className="text-red-500">Votre demande a ete rejetee.</p>
          )}
          {!status && (
            <p className="text-black-300">Vous devez etre approuve comme redacteur pour acceder a cette page.</p>
          )}
          <Link 
            href="/newsletter/redacteur" 
            className="inline-block px-4 py-2 bg-primaryPurple-500 text-white rounded-lg hover:bg-primaryPurple-600 transition-colors"
          >
            Demander l&apos;acces redacteur
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RedacteurAccessGuard;