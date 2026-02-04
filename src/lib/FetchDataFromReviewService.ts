/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateCommentInterface,
  GetCommentInteface,
  LikeDislikeRequest,
  ReplyCommentInterface,
  ReplyCommentResponseInterface,
} from '@/types/comment';

// Server Actions imports
import {
  fetchLikesCount as fetchAllLikesForEntityIdAction,
  fetchDislikesCount as fetchAllDislikesForEntityIdAction,
  hasLiked as fetchHasLikedStatusByUserIdAction,
  hasDisliked as fetchHasDislikedStatusByUserIdAction,
  fetchComments as fetchAllCommentsByEntityIdAction,
  createComment as createCommentAction,
  replyComment as replyCommentAction,
  fetchCommentReplies as fetchAllCommentsRepliesForCommentIdAction,
  likeOrDislike as likeOrDislikeEntityAction,
} from '@/actions/review';

// Fetch total likes for an entity
export const fetchAllLikesForEntityId = async (entityId: string) => {
  try {
    return await fetchAllLikesForEntityIdAction(entityId);
  } catch (error) {
    console.error('Failed to fetch total likes', error);
    return null;
  }
};

// Fetch total dislikes for an entity
export const fetchAllDislikesForEntityId = async (entityId: string) => {
  try {
    return await fetchAllDislikesForEntityIdAction(entityId);
  } catch (error) {
    console.error('Failed to fetch total dislikes', error);
    return null;
  }
};

// Fetch "has liked" status by userId and entityId
export const fetchHasLikedStatusByUserId = async (
  userId: string,
  entityId: string
) => {
  try {
    return await fetchHasLikedStatusByUserIdAction(userId, entityId);
  } catch (error) {
    console.error('Failed to fetch has liked status', error);
    return false;
  }
};

// Fetch "has disliked" status by userId and entityId
export const fetchHasDislikedStatusByUserId = async (
  userId: string,
  entityId: string
) => {
  try {
    return await fetchHasDislikedStatusByUserIdAction(userId, entityId);
  } catch (error) {
    console.error('Failed to fetch has disliked status', error);
    return false;
  }
};

// Fetch all comments on an entity ID
export const fetchAllCommentsByEntityId = async (entityId: string) => {
  try {
    return await fetchAllCommentsByEntityIdAction(entityId);
  } catch (error) {
    console.error('Failed to fetch comments', error);
    return [];
  }
};

// Function to create a comment
export const createComment = async (commentData: CreateCommentInterface) => {
  try {
    return await createCommentAction(commentData);
  } catch (error) {
    console.error('Failed to create comment', error);
    return null;
  }
};

// Function to reply to a comment
export const replyComment = async (replyCommentData: ReplyCommentInterface) => {
  try {
    return await replyCommentAction(replyCommentData);
  } catch (error) {
    console.error('Failed to reply comment', error);
    return null;
  }
};

// Fetch all comment replies on an comment ID
export const fetchAllCommentsRepliesForCommentId = async (
  commentId: string
) => {
  try {
    return await fetchAllCommentsRepliesForCommentIdAction(commentId);
  } catch (error) {
    console.error('Failed to fetch comment replies', error);
    return [];
  }
};

//function to like or dislike entity
export const likeOrDislikeEntity = async (params: LikeDislikeRequest) => {
  try {
    return await likeOrDislikeEntityAction(params);
  } catch (error) {
    console.error('Error making POST request for like/dislike', error);
    return null;
  }
};
