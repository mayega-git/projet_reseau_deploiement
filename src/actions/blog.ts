'use server';

// src/actions/blog.ts
// Server Actions exposing blog/podcast fetchers to Client Components.

import {
  getAllBlogs,
  getAllBlogsEverCreated,
  getAllBlogsByAuthorId,
  fetchBlogById,
  fetchBlogImages,
  fetchBlogImage,
  fetchBlogAudio,
  getAllPodcasts,
  getAllPodcastsEverCreated,
  getAllPodcastsByAuthorId,
  fetchPodcastById,
  fetchPodcastImages,
  fetchPodcastImage,
  fetchPodcastAudio,
} from '@/lib/fetchers/blog';
import type { BlogInterface } from '@/types/blog';
import type { PodcastInterface } from '@/types/podcast';

// Re-export fetchers as Server Actions so Client Components can call them
export {
  getAllBlogs,
  getAllBlogsEverCreated,
  getAllBlogsByAuthorId,
  fetchBlogById,
  fetchBlogImage,
  fetchBlogAudio,
  getAllPodcasts,
  getAllPodcastsEverCreated,
  getAllPodcastsByAuthorId,
  fetchPodcastById,
  fetchPodcastImage,
  fetchPodcastAudio,
};

// Wrappers that need explicit parameter types for serialization
export async function getBlogImages(
  blogs: BlogInterface[],
): Promise<Record<string, number[]>> {
  return fetchBlogImages(blogs);
}

export async function getPodcastImages(
  podcasts: PodcastInterface[],
): Promise<Record<string, number[]>> {
  return fetchPodcastImages(podcasts);
}
