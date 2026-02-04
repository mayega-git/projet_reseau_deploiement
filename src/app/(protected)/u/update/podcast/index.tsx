/* eslint-disable react/jsx-no-undef */
import EmptyState from '@/components/EmptyState/EmptyState';
import UpdatePodcastComponent from '@/components/Podcast/UpdatePodcastComponent';
import { fetchPodcastById } from '@/lib/fetchers/blog';
import React from 'react';

export default async function UpdatePodcast({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const PodcastPost = await fetchPodcastById(id);
  if (!PodcastPost) {
    return <EmptyState />;
  }

  return (
    <div>
      <UpdatePodcastComponent podcast={PodcastPost} />
    </div>
  );
}
