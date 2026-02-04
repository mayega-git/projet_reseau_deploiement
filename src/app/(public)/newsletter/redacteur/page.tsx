'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import Footer from '@/components/Footer';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { Button } from '@/components/ui/button';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { useAuth } from '@/context/AuthContext';
import {
  fetchRedacteurByEmail,
  fetchRedacteurRequestStatus,
  submitRedacteurRequest,
} from '@/lib/FetchNewsletterData';
import type {
  RedacteurRequestResponse,
  RedacteurRequestStatus,
} from '@/types/newsletter';

const REDACTEUR_EMAIL_KEY = 'newsletterRedacteurEmail';
const REDACTEUR_REQUEST_ID_KEY = 'newsletterRedacteurRequestId';
const REDACTEUR_ID_KEY = 'newsletterRedacteurId';

type Step = 'lookup' | 'register' | 'status';

const statusLabel: Record<RedacteurRequestStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvee',
  REJECTED: 'Rejetee',
};

const RedacteurAccessPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('lookup');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [request, setRequest] = useState<RedacteurRequestResponse | null>(null);
  const [redacteurSessionId, setRedacteurSessionId] = useState('');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedRedacteurId = localStorage.getItem(REDACTEUR_ID_KEY) || '';
    if (storedRedacteurId) {
      setRedacteurSessionId(storedRedacteurId);
    }
  }, []);

  useEffect(() => {
    if (redacteurSessionId) {
      router.replace('/u/newsletter');
    }
  }, [redacteurSessionId, router]);

  useEffect(() => {
    if (user?.sub && user.sub.includes('@')) {
      setEmail(user.sub);
    }
    if (user?.firstName) {
      setFirstName(user.firstName);
    }
    if (user?.lastName) {
      setLastName(user.lastName);
    }
  }, [user?.firstName, user?.lastName, user?.sub]);

  const checkStatus = useCallback(
    async (requestId: string, silent = false) => {
      if (!requestId) {
        return;
      }

      setChecking(true);
      const result = await fetchRedacteurRequestStatus(requestId);
      setChecking(false);

      if (!result) {
        if (!silent) {
          GlobalNotifier('Impossible de verifier la demande.', 'error');
        }
        return;
      }

      setRequest(result);
      setStep('status');

      if (result.status === 'APPROVED') {
        localStorage.setItem(REDACTEUR_ID_KEY, result.id || requestId);
        router.push('/u/newsletter');
      }
    },
    [router]
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem(REDACTEUR_EMAIL_KEY) || '';
    const storedRequestId = localStorage.getItem(REDACTEUR_REQUEST_ID_KEY) || '';

    if (storedEmail) {
      setEmail((current) => current || storedEmail);
    }

    const emailToCheck = storedEmail || user?.sub || '';
    if (emailToCheck) {
      fetchRedacteurByEmail(emailToCheck).then((result) => {
        const status = result?.status?.toUpperCase();
        if (status === 'APPROUVED' || status === 'APPROVED') {
          localStorage.setItem(REDACTEUR_ID_KEY, result?.id || '');
          localStorage.setItem(REDACTEUR_EMAIL_KEY, emailToCheck);
          router.replace('/u/newsletter');
          return;
        }
        if (result?.status) {
          setRequest(result);
          setStep('status');
        }
      });
    }

    if (storedRequestId) {
      void checkStatus(storedRequestId, true);
    }
  }, [checkStatus, router, user?.sub]);

  const handleLookup = async () => {
    if (!email.trim()) {
      GlobalNotifier('Email requis.', 'warning');
      return;
    }

    const existing = await fetchRedacteurByEmail(email.trim());
    const existingStatus = existing?.status?.toUpperCase();
    if (existingStatus === 'APPROUVED' || existingStatus === 'APPROVED') {
      localStorage.setItem(REDACTEUR_ID_KEY, existing?.id || '');
      localStorage.setItem(REDACTEUR_EMAIL_KEY, email.trim());
      router.replace('/u/newsletter');
      return;
    }
    if (existing?.status) {
      setRequest(existing);
      setStep('status');
      return;
    }

    const storedEmail = localStorage.getItem(REDACTEUR_EMAIL_KEY) || '';
    const storedRequestId = localStorage.getItem(REDACTEUR_REQUEST_ID_KEY) || '';

    if (storedEmail && storedRequestId && storedEmail === email) {
      await checkStatus(storedRequestId);
      return;
    }

    setStep('register');
  };

  const handleRegister = async () => {
    if (!email.trim()) {
      GlobalNotifier('Email requis.', 'warning');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      GlobalNotifier('Nom et prenom requis.', 'warning');
      return;
    }

    setSubmitting(true);
    const result = await submitRedacteurRequest({
      email,
      nom: lastName,
      prenom: firstName,
      password: password,
    });
    setSubmitting(false);

    if (!result?.id) {
      GlobalNotifier('Impossible de soumettre la demande.', 'error');
      return;
    }

    localStorage.setItem(REDACTEUR_EMAIL_KEY, email);
    localStorage.setItem(REDACTEUR_REQUEST_ID_KEY, result.id);
    setRequest(result);
    setStep('status');

    if (result.status === 'APPROVED') {
      localStorage.setItem(REDACTEUR_ID_KEY, result.id);
      router.push('/u/newsletter');
      return;
    }

    GlobalNotifier('Demande envoyee. Nous revenons vers toi.', 'success');
  };

  const handleReset = () => {
    localStorage.removeItem(REDACTEUR_EMAIL_KEY);
    localStorage.removeItem(REDACTEUR_REQUEST_ID_KEY);
    localStorage.removeItem(REDACTEUR_ID_KEY);
    setRequest(null);
    setStep('lookup');
  };

  return (
    <div className="w-full flex flex-col justify-between min-h-screen">
      <HeaderWrapper />
      <div className="container py-8 flex-1">
        <SidebarPageHeading
          title="Acces redacteur"
          subtitle="Verifie ton email ou soumets ta demande pour gerer les newsletters."
        />

        <div className="mt-6 max-w-xl rounded-xl border border-grey-100 bg-white p-6 shadow-sm">
          {step === 'lookup' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="redacteur-email" className="form-label">
                  Email
                </label>
                <input
                  id="redacteur-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="custom-input"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleLookup} disabled={checking}>
                  {checking ? 'Verification...' : 'Continuer'}
                </Button>
              </div>
            </div>
          )}

          {step === 'register' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="redacteur-email-register" className="form-label">
                  Email
                </label>
                <input
                  id="redacteur-email-register"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="custom-input"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="redacteur-first-name" className="form-label">
                    First name
                  </label>
                  <input
                    id="redacteur-first-name"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label htmlFor="redacteur-last-name" className="form-label">
                    Last name
                  </label>
                  <input
                    id="redacteur-last-name"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="custom-input"
                  />
                  
                </div>
                <div>
                  <label htmlFor="redacteur-password" className="form-label">
                      Password
                  </label>
                  <input
                    id="redacteur-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="custom-input"
                  />
                  
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setStep('lookup')}>
                  Retour
                </Button>
                <Button onClick={handleRegister} disabled={submitting}>
                  {submitting ? 'Envoi...' : 'Soumettre'}
                </Button>
              </div>
            </div>
          )}

          {step === 'status' && request && (
            <div className="space-y-4">
              <div className="rounded-lg border border-grey-100 bg-grey-50 p-4">
                <p className="paragraph-medium-medium">
                  Statut: {request.status ? statusLabel[request.status] : '-'}
                </p>
                <p className="paragraph-small-normal text-black-300 mt-1">
                  Email: {request.email || email}
                </p>
                {request.rejectionReason && (
                  <p className="paragraph-small-normal text-red-500 mt-2">
                    Motif: {request.rejectionReason}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() =>
                    request.id ? checkStatus(request.id) : undefined
                  }
                  disabled={checking}
                >
                  {checking ? 'Verification...' : 'Verifier le statut'}
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  Nouvelle demande
                </Button>
              </div>
            </div>
          )}

          {step === 'status' && !request && (
            <div className="space-y-4">
              <p className="paragraph-medium-normal text-black-300">
                Aucune demande trouvee.
              </p>
              <Button variant="outline" onClick={handleReset}>
                Recommencer
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RedacteurAccessPage;