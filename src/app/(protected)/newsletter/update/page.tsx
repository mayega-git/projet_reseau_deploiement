'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import Footer from '@/components/Footer';
import NavTabsNewsLetter from '@/components/Navigation/NavTabsNewsLetter';
import CreateNewsLetterComponents from '@/components/NewsLetter/CreateNewsLetterComponents';
import EmptyState from '@/components/EmptyState/EmptyState';
import { useAuth } from '@/context/AuthContext';
import RedacteurAccessGuard from '@/components/NewsLetter/RedacteurAccesGuard';
import { fetchNewslettersByRedacteur } from '@/lib/FetchNewsletterData';
import type { NewsletterResponse } from '@/types/newsletter';
import { Button } from '@/components/ui/button';

const UpdateNewsletterPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const newsletterId = searchParams.get('id');
  const [newsletter, setNewsletter] = useState<NewsletterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [redacteurId, setRedacteurId] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('newsletterRedacteurId') || '';
    if (storedId) {
      setRedacteurId(storedId);
    }
  }, []);

  useEffect(() => {
    const loadNewsletter = async () => {
      const activeRedacteurId = user?.id || redacteurId;
      if (!activeRedacteurId || !newsletterId) {
        setLoading(false);
        return;
      }

      const data = await fetchNewslettersByRedacteur(activeRedacteurId);
      const match = data.find((item) => item.id === newsletterId) || null;
      setNewsletter(match);
      setLoading(false);
    };

    loadNewsletter();
  }, [newsletterId, redacteurId, user?.id]);

  return (
    <RedacteurAccessGuard>
      <div className="w-full flex flex-col justify-between min-h-screen">
        <HeaderWrapper />
        <NavTabsNewsLetter />
        <div className="container create-blog-form-height py-6">
          {loading ? (
            <p className="paragraph-medium-normal text-black-300">
              Chargement...
            </p>
          ) : !newsletter ? (
            <div className="flex flex-col gap-4">
              <EmptyState />
              <Button
                variant="outline"
                onClick={() => router.push('/u/newsletter')}
              >
                Retour aux newsletters
              </Button>
            </div>
          ) : (
            <CreateNewsLetterComponents
              mode="update"
              initialNewsletter={newsletter}
              onUpdated={() => router.push('/u/newsletter')}
            />
          )}
        </div>
        <Footer />
      </div>
    </RedacteurAccessGuard>
  );
};

export default UpdateNewsletterPage;