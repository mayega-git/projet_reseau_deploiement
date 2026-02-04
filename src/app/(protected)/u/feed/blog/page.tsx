/* eslint-disable @typescript-eslint/no-unused-vars */
import BlogCard from '@/components/Blog/blogCard';
import BlogContent from '@/components/Blog/BlogContent';
import EmptyState from '@/components/EmptyState/EmptyState';
import PodcastCard from '@/components/Podcast/podcastCard';
import { fetchBlogImages, getAllBlogs } from '@/lib/fetchers/blog';
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import React, { Suspense } from 'react';

const BlogFeed = async () => {
  const allBlogData = await getAllBlogs('PUBLISHED');

  if (!allBlogData || allBlogData.length === 0) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <BlogCard data={allBlogData}  />
    </>
  );
};

const BlogPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading blogs...</div>}>
        <BlogFeed />
      </Suspense>
    </div>
  );
};

export default BlogPage;
