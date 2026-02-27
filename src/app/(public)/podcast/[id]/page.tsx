import NotFoundPage from '@/app/not-found';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import PodcastContent from '@/components/Podcast/PodcastContent';

import {
  fetchPodcastById,
  fetchPodcastImage,
} from '@/lib/fetchers/blog';
import { fetchUserData } from '@/lib/fetchers/user';
import React from 'react';

export default async function PodcastPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const PodcastPost = await fetchPodcastById(id);
  if (!PodcastPost) {
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }
  const PodcastImage = await fetchPodcastImage(id);
  const UserData = await fetchUserData(PodcastPost.authorId);

  // server api call
  // const blogPost = await getBlogPostById(params.id);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <HeaderWrapper />
      <React.Suspense fallback={<div>Loading...</div>}>
        <section className="flex flex-col gap-16 sm:gap-32">
          <div className="w-full min-h-screen max-w-[1000px] mx-auto mt-6 sm:mt-12 px-3 sm:px-4">
            <PodcastContent
              podcast={PodcastPost}
              images={PodcastImage}
              userData={UserData}
            />
          </div>
        </section>
      </React.Suspense>
      <Footer />
    </div>
  );
}
