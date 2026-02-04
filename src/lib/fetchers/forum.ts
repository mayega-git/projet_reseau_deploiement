// src/lib/fetchers/forum.ts
// Server-only forum service fetchers using authFetch.

import type { DiscussionGroup, Category, Post, Comment } from '@/types/forum';
import { ForumRoutes } from '@/lib/server/services';
import { authFetch } from '@/lib/server/auth-fetch';

// ---------------------------------------------------------------------------
// Normalizers (unchanged business logic from the original ForumAPI class)
// ---------------------------------------------------------------------------

function normalizeDate(rawDate: unknown): string {
  if (!rawDate) return '';
  if (typeof rawDate === 'number') {
    // If timestamp is in seconds (less than 10^12), convert to milliseconds
    const dateVal = rawDate < 10000000000 ? rawDate * 1000 : rawDate;
    return new Date(dateVal).toISOString();
  }
  return String(rawDate);
}

function normalizeGroup(group: Record<string, unknown>): DiscussionGroup {
  return {
    ...(group as unknown as DiscussionGroup),
    createdAt: normalizeDate(group.creationDate ?? group.createdAt),
  };
}

function normalizePost(post: Record<string, unknown>): Post {
  const authorName =
    (post.authorName as string) ||
    (post.authorFirstName && post.authorLastName
      ? `${post.authorFirstName} ${post.authorLastName}`
      : null) ||
    (post.firstName && post.lastName
      ? `${post.firstName} ${post.lastName}`
      : 'Utilisateur');

  return {
    ...(post as unknown as Post),
    likes: (post.numberOfLikes ?? post.likes ?? 0) as number,
    dislikes: (post.numberOfDislikes ?? post.dislikes ?? 0) as number,
    createdAt: normalizeDate(post.creationDate ?? post.createdAt),
    authorName: authorName as string,
  };
}

function normalizeComment(comment: Record<string, unknown>): Comment {
  const authorName =
    (comment.authorName as string) ||
    (comment.authorFirstName && comment.authorLastName
      ? `${comment.authorFirstName} ${comment.authorLastName}`
      : null) ||
    (comment.firstName && comment.lastName
      ? `${comment.firstName} ${comment.lastName}`
      : 'Utilisateur');

  return {
    ...(comment as unknown as Comment),
    createdAt: normalizeDate(comment.creationDate ?? comment.createdAt),
    authorName: authorName as string,
    replies: Array.isArray(comment.replies)
      ? (comment.replies as Record<string, unknown>[]).map(normalizeComment)
      : [],
  };
}

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

async function forumFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await authFetch(`${ForumRoutes.base}${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Forum API ${res.status}: ${text}`);
  }

  if (res.status === 204) return null as T;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return null as T;
}

// ---------------------------------------------------------------------------
// Discussion Groups
// ---------------------------------------------------------------------------

export async function getValidatedGroups(): Promise<DiscussionGroup[]> {
  const all = await forumFetch<Record<string, unknown>[]>('/groups/all');
  return all.map(normalizeGroup).filter((g) => g.status === 'VALIDATED');
}

export async function getAllGroups(): Promise<DiscussionGroup[]> {
  const all = await forumFetch<Record<string, unknown>[]>('/groups/all');
  return all.map(normalizeGroup);
}

export async function validateGroup(groupId: string): Promise<void> {
  await forumFetch(`/groups/${groupId}/validate`, { method: 'PUT' });
}

export async function rejectGroup(groupId: string): Promise<void> {
  await forumFetch(`/groups/${groupId}/reject`, { method: 'PUT' });
}

export async function deleteGroup(groupId: string): Promise<void> {
  await forumFetch(`/groups/${groupId}`, { method: 'DELETE' });
}

export async function createGroup(
  name: string,
  description: string,
  creatorId: string,
): Promise<DiscussionGroup> {
  const group = await forumFetch<Record<string, unknown>>('/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, type: 'FORUM', creatorId }),
  });
  return normalizeGroup(group);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategoriesByGroup(groupId: string): Promise<Category[]> {
  return forumFetch(`/categories/groupe/${groupId}`);
}

export async function getAllCategories(): Promise<Category[]> {
  return forumFetch('/categories/all');
}

export async function createCategory(
  groupId: string,
  categorieName: string,
): Promise<Category> {
  return forumFetch(`/categories/${groupId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categorieName }),
  });
}

export async function updateCategory(
  categorieId: string,
  categorie: Category,
): Promise<Category> {
  return forumFetch(`/categories/${categorieId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categorie),
  });
}

export async function deleteCategory(categorieId: string): Promise<void> {
  return forumFetch(`/categories/${categorieId}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export async function getPostsByGroup(groupId: string): Promise<Post[]> {
  const posts = await forumFetch<Record<string, unknown>[]>(`/posts/groupe/${groupId}`);
  return posts.map(normalizePost);
}

export async function getPostById(postId: string): Promise<Post> {
  const post = await forumFetch<Record<string, unknown>>(`/posts/${postId}`);
  return normalizePost(post);
}

export async function createPost(
  groupId: string,
  title: string,
  content: string,
  memberId: string,
  categoryId?: string,
): Promise<Post> {
  const body = {
    authorId: memberId,
    groupId,
    title,
    content,
    categoriesIds: categoryId ? [categoryId] : [],
  };
  return forumFetch(`/posts?memberId=${memberId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function likePost(postId: string, memberId: string): Promise<Post> {
  const post = await forumFetch<Record<string, unknown>>(
    `/posts/${postId}/like?memberId=${memberId}`,
    { method: 'POST' },
  );
  return normalizePost(post);
}

export async function dislikePost(postId: string, memberId: string): Promise<Post> {
  const post = await forumFetch<Record<string, unknown>>(
    `/posts/${postId}/dislike?memberId=${memberId}`,
    { method: 'POST' },
  );
  return normalizePost(post);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const comments = await forumFetch<Record<string, unknown>[]>(
    `/commentaires/post/${postId}`,
  );
  return comments.map(normalizeComment);
}

export async function createForumComment(
  postId: string,
  content: string,
  memberId: string,
  parentCommentId?: string,
): Promise<Comment> {
  return forumFetch('/commentaires/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postId,
      authorId: memberId,
      content,
      parentCommentId: parentCommentId ?? null,
    }),
  });
}

export async function updateForumComment(
  commentId: string,
  content: string,
): Promise<Comment> {
  return forumFetch(`/commentaires/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function deleteForumComment(
  commentId: string,
  memberId: string,
): Promise<void> {
  await forumFetch(`/commentaires/${commentId}?memberId=${memberId}`, {
    method: 'DELETE',
  });
}
