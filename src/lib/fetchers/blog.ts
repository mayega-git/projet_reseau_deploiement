// src/lib/fetchers/blog.ts
// Server-only blog & podcast data fetchers using authFetch.

import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import { EducationRoutes } from '@/lib/server/services';
import { authFetchJson, authFetchBinary } from '@/lib/server/auth-fetch';

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export async function getAllBlogsEverCreated(): Promise<BlogInterface[]> {
  return (await authFetchJson<BlogInterface[]>(EducationRoutes.blogs)) ?? [];
}

export async function getAllBlogs(status: string): Promise<BlogInterface[]> {
  const url = new URL(`${EducationRoutes.blogs}/published`);
  url.searchParams.set('status', status);
  return (await authFetchJson<BlogInterface[]>(url.toString())) ?? [];
}

export async function getAllBlogsByAuthorId(
  authorId: string,
  status: string,
): Promise<BlogInterface[]> {
  const url = new URL(EducationRoutes.blogs);
  url.searchParams.set('authorId', authorId);
  if (status !== '') url.searchParams.set('status', status);
  return (await authFetchJson<BlogInterface[]>(url.toString())) ?? [];
}

export async function fetchBlogById(id: string): Promise<BlogInterface | null> {
  const [blog, tags, categories] = await Promise.all([
    authFetchJson<BlogInterface>(`${EducationRoutes.blogs}/${id}`),
    authFetchJson<string[]>(`${EducationRoutes.blogs}/${id}/tags`),
    authFetchJson<string[]>(`${EducationRoutes.blogs}/${id}/categories`),
  ]);

  if (!blog) return null;
  return { ...blog, tags: tags ?? [], category: categories ?? [] };
}

export async function fetchBlogImages(
  blogs: BlogInterface[],
): Promise<Record<string, number[]>> {
  const imageMap: Record<string, number[]> = {};
  await Promise.all(
    blogs.map(async (blog) => {
      try {
        imageMap[blog.id] = await authFetchBinary(
          `${EducationRoutes.blogs}/${blog.id}/coverblog`,
        );
      } catch (err) {
        console.error(`Error fetching image for blog ${blog.id}:`, err);
      }
    }),
  );
  return imageMap;
}

export async function fetchBlogImage(
  blogId: string,
): Promise<Record<string, number[]>> {
  const imageMap: Record<string, number[]> = {};
  try {
    imageMap[blogId] = await authFetchBinary(
      `${EducationRoutes.blogs}/${blogId}/coverblog`,
    );
  } catch (err) {
    console.error(`Error fetching image for blog ${blogId}:`, err);
  }
  return imageMap;
}

export async function fetchBlogAudio(
  blogId: string,
): Promise<Record<string, number[]>> {
  const audioMap: Record<string, number[]> = {};
  try {
    audioMap[blogId] = await authFetchBinary(
      `${EducationRoutes.blogs}/${blogId}/audio`,
    );
  } catch (err) {
    console.error(`Error fetching audio for blog ${blogId}:`, err);
  }
  return audioMap;
}

// ---------------------------------------------------------------------------
// Podcasts
// ---------------------------------------------------------------------------

export async function getAllPodcastsEverCreated(): Promise<PodcastInterface[]> {
  return (await authFetchJson<PodcastInterface[]>(EducationRoutes.podcasts)) ?? [];
}

export async function getAllPodcasts(status: string): Promise<PodcastInterface[]> {
  const url = new URL(EducationRoutes.podcasts);
  url.searchParams.set('status', status);
  return (await authFetchJson<PodcastInterface[]>(url.toString())) ?? [];
}

export async function getAllPodcastsByAuthorId(
  authorId: string,
  status: string,
): Promise<PodcastInterface[]> {
  const url = new URL(EducationRoutes.podcasts);
  url.searchParams.set('authorId', authorId);
  if (status !== '') url.searchParams.set('status', status);
  return (await authFetchJson<PodcastInterface[]>(url.toString())) ?? [];
}

export async function fetchPodcastById(id: string): Promise<PodcastInterface | null> {
  const [podcast, tags, categories] = await Promise.all([
    authFetchJson<PodcastInterface>(`${EducationRoutes.podcasts}/${id}`),
    authFetchJson<string[]>(`${EducationRoutes.podcasts}/${id}/tags`),
    authFetchJson<string[]>(`${EducationRoutes.podcasts}/${id}/categories`),
  ]);

  if (!podcast) return null;
  return {
    ...podcast,
    tags: tags ?? [],
    categories: categories ?? [],
  };
}

export async function fetchPodcastImages(
  podcasts: PodcastInterface[],
): Promise<Record<string, number[]>> {
  const imageMap: Record<string, number[]> = {};
  await Promise.all(
    podcasts.map(async (podcast) => {
      try {
        imageMap[podcast.id] = await authFetchBinary(
          `${EducationRoutes.podcasts}/${podcast.id}/coverpodcast`,
        );
      } catch (err) {
        console.error(`Error fetching image for podcast ${podcast.id}:`, err);
      }
    }),
  );
  return imageMap;
}

export async function fetchPodcastImage(
  podcastId: string,
): Promise<Record<string, number[]>> {
  const imageMap: Record<string, number[]> = {};
  try {
    imageMap[podcastId] = await authFetchBinary(
      `${EducationRoutes.podcasts}/${podcastId}/coverpodcast`,
    );
  } catch (err) {
    console.error(`Error fetching image for podcast ${podcastId}:`, err);
  }
  return imageMap;
}

export async function fetchPodcastAudio(
  podcastId: string,
): Promise<Record<string, number[]>> {
  const audioMap: Record<string, number[]> = {};
  try {
    audioMap[podcastId] = await authFetchBinary(
      `${EducationRoutes.podcasts}/${podcastId}/stream`,
    );
  } catch (err) {
    console.error(`Error fetching audio for podcast ${podcastId}:`, err);
  }
  return audioMap;
}

// ---------------------------------------------------------------------------
// Blog count by author (used for user management pages)
// ---------------------------------------------------------------------------

export async function getUserBlogCount(userId: string): Promise<number> {
  const res = await authFetchJson<{ count?: number }>(
    `${EducationRoutes.blogs}/count-by-author/${userId}`,
  );
  return res?.count ?? 0;
}
