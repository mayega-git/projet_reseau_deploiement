/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';

// Server Actions imports
import {
  getAllBlogsEverCreated as getAllBlogsEverCreatedAction,
  getAllBlogs as getAllBlogsAction,
  getAllBlogsByAuthorId as getAllBlogsByAuthorIdAction,
  fetchBlogById as fetchBlogByIdAction,
  getAllPodcastsEverCreated as getAllPodcastsEverCreatedAction,
  getAllPodcasts as getAllPodcastsAction,
  getAllPodcastsByAuthorId as getAllPodcastsByAuthorIdAction,
  fetchPodcastById as fetchPodcastByIdAction,
  getBlogImages as getBlogImagesAction,
  getPodcastImages as getPodcastImagesAction,
  fetchBlogImage as fetchBlogImageAction,
  fetchPodcastImage as fetchPodcastImageAction,
  fetchBlogAudio as fetchBlogAudioAction,
  fetchPodcastAudio as fetchPodcastAudioAction,
} from '@/actions/blog';

/**
 * Fetch all blogs ever created
 */
export const getAllBlogsEverCreated = async (): Promise<BlogInterface[]> => {
  try {
    return await getAllBlogsEverCreatedAction();
  } catch (error) {
    console.error('Failed to get all blogs ever created', error);
    return [];
  }
};

/**
 * Fetch all podcasts ever created
 */
export const getAllPodcastsEverCreated = async (): Promise<
  PodcastInterface[]
> => {
  try {
    return await getAllPodcastsEverCreatedAction();
  } catch (error) {
    console.error('Failed to get all podcasts ever created', error);
    return [];
  }
};

/**
 * Fetch all blogs based on status
 * @param {string} status - The status of blogs to fetch
 */
export const getAllBlogs = async (status: string): Promise<BlogInterface[]> => {
  try {
    return await getAllBlogsAction(status);
  } catch (error) {
    console.error('Failed to get all blogs by status', error);
    return [];
  }
};

/**
 * Fetch all blogs by author ID
 * @param {string} authorId - The ID of the author
 */
export const getAllBlogsByAuthorId = async (
  authorId: string,
  status: string
): Promise<BlogInterface[]> => {
  try {
    return await getAllBlogsByAuthorIdAction(authorId, status);
  } catch (error) {
    console.error('Failed to get all blogs by author', error);
    return [];
  }
};

/**
 * Fetch all podcasts based on status
 * @param {string} status - The status of podcasts to fetch
 */
export const getAllPodcasts = async (
  status: string
): Promise<PodcastInterface[]> => {
  try {
    return await getAllPodcastsAction(status);
  } catch (error) {
    console.error('Failed to get all podcasts by status', error);
    return [];
  }
};

/**
 * Fetch all podcasts by author ID
 * @param {string} authorId - The ID of the author
 */
export const getAllPodcastsByAuthorId = async (
  authorId: string,
  status: string
): Promise<PodcastInterface[]> => {
  try {
    return await getAllPodcastsByAuthorIdAction(authorId, status);
  } catch (error) {
    console.error('Failed to get all podcasts by author', error);
    return [];
  }
};

/**
 * Fetch a specific blog by ID
 * @param {string} id - The blog ID
 */
export const fetchBlogById = async (
  id: string
): Promise<BlogInterface | null> => {
  try {
    return await fetchBlogByIdAction(id);
  } catch (error) {
    console.error('Failed to fetch blog by id', error);
    return null;
  }
};


/**
 * Fetch a specific podcast by ID
 * @param {string} id - The podcast ID
 */
export const fetchPodcastById = async (
  id: string
): Promise<PodcastInterface | null> => {
  try {
    return await fetchPodcastByIdAction(id);
  } catch (error) {
    console.error('Failed to fetch podcast by id', error);
    return null;
  }
};

/**
 * Fetch images for an array of blogs
 * @param {BlogInterface[]} blogs - The blog ID
 */
export const fetchBlogImages = async (blogs: BlogInterface[]) => {
  try {
    return await getBlogImagesAction(blogs);
  } catch (error) {
    console.error('Failed to fetch blog images', error);
    return {};
  }
};

/**
 * Fetch images for an array of podcasts
 * @param {PodcastInterface[]} podcasts - The blog ID
 */
export const fetchPodcastImages = async (podcasts: PodcastInterface[]) => {
  try {
    return await getPodcastImagesAction(podcasts);
  } catch (error) {
    console.error('Failed to fetch podcast images', error);
    return {};
  }
};

//fetch single blog image
export const fetchBlogImage = async (blogId: string) => {
  try {
    return await fetchBlogImageAction(blogId);
  } catch (error) {
    console.error('Failed to fetch blog image', error);
    return {};
  }
};

export const fetchPodcastImage = async (podcastId: string) => {
  try {
    return await fetchPodcastImageAction(podcastId);
  } catch (error) {
    console.error('Failed to fetch podcast image', error);
    return {};
  }
};

// function to fetch blog audio
export const fetchBlogAudio = async (blogId: string) => {
  try {
    return await fetchBlogAudioAction(blogId);
  } catch (error) {
    console.error('Failed to fetch blog audio', error);
    return {};
  }
};

// function to fetch blog audio
export const fetchPodcastAudio = async (podcastId: string) => {
  try {
    return await fetchPodcastAudioAction(podcastId);
  } catch (error) {
    console.error('Failed to fetch podcast audio', error);
    return {};
  }
};
