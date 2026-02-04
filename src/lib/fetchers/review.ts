// src/lib/fetchers/review.ts
// Server-only review service fetchers using authFetch.

import {
  CreateCommentInterface,
  GetCommentInteface,
  LikeDislikeRequest,
  ReplyCommentInterface,
  ReplyCommentResponseInterface,
} from '@/types/comment';
import { ReviewRoutes } from '@/lib/server/services';
import { authFetch, authFetchJson } from '@/lib/server/auth-fetch';

export async function fetchAllLikesForEntityId(entityId: string): Promise<number | null> {
  const params = new URLSearchParams({ entityId }).toString();
  return authFetchJson<number>(`${ReviewRoutes.ratings}/totalLikes?${params}`);
}

export async function fetchAllDislikesForEntityId(entityId: string): Promise<number | null> {
  const params = new URLSearchParams({ entityId }).toString();
  return authFetchJson<number>(`${ReviewRoutes.ratings}/totalDislikes?${params}`);
}

export async function fetchHasLikedStatusByUserId(
  userId: string,
  entityId: string,
): Promise<boolean | null> {
  const url = new URL(`${ReviewRoutes.ratings}/hasLiked`);
  url.searchParams.set('userId', userId);
  url.searchParams.set('entityId', entityId);
  return authFetchJson<boolean>(url.toString());
}

export async function fetchHasDislikedStatusByUserId(
  userId: string,
  entityId: string,
): Promise<boolean | null> {
  const url = new URL(`${ReviewRoutes.ratings}/hasDisliked`);
  url.searchParams.set('userId', userId);
  url.searchParams.set('entityId', entityId);
  return authFetchJson<boolean>(url.toString());
}

export async function fetchAllCommentsByEntityId(
  entityId: string,
): Promise<GetCommentInteface[] | null> {
  const params = new URLSearchParams({ entityId }).toString();
  return authFetchJson<GetCommentInteface[]>(
    `${ReviewRoutes.comments}/by-entityId?${params}`,
  );
}

export async function createComment(
  commentData: CreateCommentInterface,
): Promise<GetCommentInteface | null> {
  return authFetchJson<GetCommentInteface>(ReviewRoutes.comments, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export async function replyComment(
  replyData: ReplyCommentInterface,
): Promise<ReplyCommentResponseInterface | null> {
  return authFetchJson<ReplyCommentResponseInterface>(
    `${ReviewRoutes.commentReply}/${replyData.commentId}`,
    {
      method: 'POST',
      body: JSON.stringify(replyData),
    },
  );
}

export async function fetchAllCommentsRepliesForCommentId(
  commentId: string,
): Promise<ReplyCommentResponseInterface[] | null> {
  return authFetchJson<ReplyCommentResponseInterface[]>(
    `${ReviewRoutes.commentReply}/${commentId}`,
  );
}

export async function likeOrDislikeEntity(
  params: LikeDislikeRequest,
): Promise<unknown | null> {
  const url = new URL(`${ReviewRoutes.ratings}/like-or-dislike`);
  url.searchParams.set('userId', params.userId);
  url.searchParams.set('entityId', params.entityId);
  url.searchParams.set('entityType', params.entityType);
  url.searchParams.set('isLike', params.isLike.toString());

  return authFetchJson<unknown>(url.toString(), { method: 'POST' });
}
