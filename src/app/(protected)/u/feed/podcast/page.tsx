/* eslint-disable @typescript-eslint/no-unused-vars */
import BlogCard from '@/components/Blog/blogCard';
import BlogContent from '@/components/Blog/BlogContent';
import EmptyState from '@/components/EmptyState/EmptyState';
import PodcastCard from '@/components/Podcast/podcastCard';
import {
  fetchPodcastImages,
  getAllPodcasts,
} from '@/lib/fetchers/blog';
import { PodcastInterface } from '@/types/podcast';
import React, { Suspense } from 'react';

const PodcastFeed = async () => {
  const allPodcastData = await getAllPodcasts('PUBLISHED');
  const allPodcastImages = await fetchPodcastImages(allPodcastData);

  if (!allPodcastData || allPodcastData.length === 0) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <PodcastCard data={allPodcastData} images={allPodcastImages} />
    </>
  );
};

const PodcastPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading podcasts...</div>}>
        <PodcastFeed />
      </Suspense>
    </div>
  );
};

export default PodcastPage;
