import EmptyState from '@/components/EmptyState/EmptyState';
import Footer from '@/components/Footer';
import Header1 from '@/components/Header/Header1';
import NavTabsMain from '@/components/Navigation/NavTabsMain';
import PodcastPage from '@/components/Podcast/HomePage';
import LandingPageWelcomeSection from '@/components/ui/LandingPageWelcomeSection';
import { getAllPodcasts } from '@/lib/fetchers/blog';
import React, { Suspense } from 'react';

const PodcastFeed = async () => {
  const allPodcastData = await getAllPodcasts('PUBLISHED');

  if (!allPodcastData || allPodcastData.length === 0) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <PodcastPage data={allPodcastData} />
    </>
  );
};

const Podcast = () => {
  return (
    <div>
      <Header1 />
      <main className=" min-h-screen">
        {/* background-overlay */}
        <LandingPageWelcomeSection />

        <div className="min-h-screen flex flex-col gap-10 ">
          <NavTabsMain />

          <Suspense
            fallback={<div className="container">Loading podcasts...</div>}
          >
            <PodcastFeed />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Podcast;
