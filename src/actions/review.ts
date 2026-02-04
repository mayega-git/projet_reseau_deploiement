'use server';

// src/actions/review.ts
// Server Actions exposing review service operations to Client Components.

import {
  fetchAllLikesForEntityId,
  fetchAllDislikesForEntityId,
  fetchHasLikedStatusByUserId,
  fetchHasDislikedStatusByUserId,
  fetchAllCommentsByEntityId,
  createComment,
  replyComment,
  fetchAllCommentsRepliesForCommentId,
  likeOrDislikeEntity,
} from '@/lib/fetchers/review';

export {
  fetchAllLikesForEntityId as fetchLikesCount,
  fetchAllDislikesForEntityId as fetchDislikesCount,
  fetchHasLikedStatusByUserId as hasLiked,
  fetchHasDislikedStatusByUserId as hasDisliked,
  fetchAllCommentsByEntityId as fetchComments,
  createComment,
  replyComment,
  fetchAllCommentsRepliesForCommentId as fetchCommentReplies,
  likeOrDislikeEntity as likeOrDislike,
};
