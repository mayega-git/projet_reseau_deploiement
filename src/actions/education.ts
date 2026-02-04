'use server';

// src/actions/education.ts
// Server Actions for categories, tags, and generic CRUD on education service.

import { authFetch, authFetchJson } from '@/lib/server/auth-fetch';
import { EducationRoutes, ReviewRoutes } from '@/lib/server/services';

// ---------------------------------------------------------------------------
// Fetch all tags
// ---------------------------------------------------------------------------

export async function fetchAllTags(): Promise<unknown[]> {
  const res = await authFetch(EducationRoutes.tags, { method: 'GET' });
  if (!res.ok) return [];
  return res.json();
}

// ---------------------------------------------------------------------------
// Fetch all categories
// ---------------------------------------------------------------------------

export async function fetchAllCategories(): Promise<unknown[]> {
  const res = await authFetch(EducationRoutes.category, { method: 'GET' });
  if (!res.ok) return [];
  return res.json();
}

// ---------------------------------------------------------------------------
// Publish blog / podcast
// ---------------------------------------------------------------------------

export async function publishBlog(id: string): Promise<{ ok: boolean; data?: unknown }> {
  const res = await authFetch(`${EducationRoutes.blogs}/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) return { ok: false };
  const data = await res.json().catch(() => null);
  return { ok: true, data };
}

export async function publishPodcast(id: string): Promise<{ ok: boolean; data?: unknown }> {
  const res = await authFetch(`${EducationRoutes.podcasts}/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) return { ok: false };
  const data = await res.json().catch(() => null);
  return { ok: true, data };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function createCategory(data: {
  name: string;
  description: string;
  domain: string;
}): Promise<boolean> {
  const res = await authFetch(EducationRoutes.category, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export async function createTag(data: {
  name: string;
  description: string;
  domain: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await authFetch(EducationRoutes.tags, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.ok) return { ok: true };
  const err = await res.json().catch(() => null);
  return { ok: false, error: err?.message ?? 'Unknown error' };
}

// ---------------------------------------------------------------------------
// Generic delete (tag, category, comment, blog, podcast)
// ---------------------------------------------------------------------------

const DELETE_URL_MAP: Record<string, string> = {
  tag: EducationRoutes.tags,
  category: EducationRoutes.category,
  comment: ReviewRoutes.comments,
  blog: EducationRoutes.blogs,
  podcast: EducationRoutes.podcasts,
};

// ---------------------------------------------------------------------------
// Blog CRUD
// ---------------------------------------------------------------------------

export async function createBlog(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await authFetch(EducationRoutes.blogs, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.message ?? `Status ${res.status}` };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function updateBlog(id: string, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await authFetch(`${EducationRoutes.blogs}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.message ?? `Status ${res.status}` };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function updateBlogStatus(id: string, status: string): Promise<boolean> {
  const res = await authFetch(`${EducationRoutes.blogs}/${id}/status?status=${status}`, {
    method: 'PATCH',
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Podcast CRUD
// ---------------------------------------------------------------------------

export async function createPodcast(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await authFetch(EducationRoutes.podcasts, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.message ?? `Status ${res.status}` };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function updatePodcast(id: string, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await authFetch(`${EducationRoutes.podcasts}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.message ?? `Status ${res.status}` };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function updatePodcastStatus(id: string, status: string): Promise<boolean> {
  const res = await authFetch(`${EducationRoutes.podcasts}/${id}/status?status=${status}`, {
    method: 'PATCH',
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

export async function rateApplication(
  userId: string,
  entityId: string,
  score: number,
  feedback: string,
): Promise<boolean> {
  const url = new URL(`${ReviewRoutes.ratings}/rate-application`);
  url.searchParams.set('userId', userId);
  url.searchParams.set('entityId', entityId);
  url.searchParams.set('score', score.toString());
  url.searchParams.set('feedback', feedback);

  const res = await authFetch(url.toString(), { method: 'POST' });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Generic delete (tag, category, comment, blog, podcast)
// ---------------------------------------------------------------------------

export async function deleteEntity(
  type: string,
  id: string,
): Promise<boolean> {
  const base = DELETE_URL_MAP[type];
  if (!base) {
    console.error('[deleteEntity] Invalid type:', type);
    return false;
  }
  const res = await authFetch(`${base}/${id}`, { method: 'DELETE' });
  return res.ok;
}
