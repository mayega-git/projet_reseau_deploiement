'use client';

import React, { useEffect, useState } from 'react';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import Footer from '@/components/Footer';
import NavTabsNewsLetter from '@/components/Navigation/NavTabsNewsLetter';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import EmptyState from '@/components/EmptyState/EmptyState';
import NewsletterDataTable from '@/components/DataTable/NewsletterDataTable';
import { useAuth } from '@/context/AuthContext';
import RedacteurAccessGuard from '@/components/NewsLetter/RedacteurAccesGuard';
import { fetchNewslettersByRedacteur } from '@/lib/FetchNewsletterData';
import type { NewsletterResponse } from '@/types/newsletter';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NewsletterDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<NewsletterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [redacteurId, setRedacteurId] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('newsletterRedacteurId') || '';
    if (storedId) {
      setRedacteurId(storedId);
    }
  }, []);

  const loadNewsletters = async () => {
    // Use redacteurId from localStorage (newsletter module ID), NOT user?.id
    const activeRedacteurId = redacteurId;
    if (!activeRedacteurId) {
      setLoading(false);
      return;
    }
    const data = await fetchNewslettersByRedacteur(activeRedacteurId);
    setNewsletters(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNewsletters();
  }, [redacteurId, user?.id]);

  return (
    <RedacteurAccessGuard>
      <div className="w-full flex flex-col justify-between min-h-screen">
        <HeaderWrapper />
        <NavTabsNewsLetter />
        <div className="container py-6 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <SidebarPageHeading
              title="Newsletters"
              subtitle="Gere et soumets tes newsletters."
            />
            <Button onClick={() => router.push('/newsletter/create')}>
              Create Newsletter
            </Button>
          </div>

          {loading ? (
            <p className="paragraph-medium-normal text-black-300 mt-6">
              Chargement...
            </p>
          ) : newsletters.length === 0 ? (
            <div className="mt-8">
              <EmptyState />
            </div>
          ) : (
            <div className="mt-8">
              <NewsletterDataTable
                data={newsletters}
                variant="redacteur"
                redacteurId={redacteurId}
                onRefresh={loadNewsletters}
                onEdit={(id) => router.push(`/newsletter/update?id=${id}`)}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </RedacteurAccessGuard>
  );
};

export default NewsletterDashboard;