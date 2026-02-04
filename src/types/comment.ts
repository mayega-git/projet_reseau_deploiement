export interface GetCommentInteface {
  id: string;
  content: string;
  commentByUser: string;
  createdAt: string;
  updatedAt: string;
  entityId: string;
  entityType: string;
}

export interface CreateCommentInterface {
  content: string;
  commentByUser: string;
  entityId: string;
  entityType: string;
 
}

export interface ReplyCommentInterface {
  content: string;
  replyByUserId: string;
  commentId: string;
  
}

export interface ReplyCommentResponseInterface {
  id: string;
  content: string;
  replyByUserId: string;
  createdAt: string;
  updatedAt: string;
  commentId: string;
}

export interface LikeDislikeRequest {
  userId: string; // ID of the user giving the like/dislike
  entityId: string; // ID of the entity being liked/disliked
  entityType: string; // Type of entity (e.g., 'BLOG', 'PODCAST')
  isLike: boolean; // true for like, false for dislike
}

export const parseReplyToComment = (
  reply: ReplyCommentResponseInterface,
  entityId: string, // You may need to pass this from context or another source
  entityType: string
): GetCommentInteface => {
  return {
    id: reply.id,
    content: reply.content,
    commentByUser: reply.replyByUserId, // Use replyByUserId as commentByUser
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    entityId: entityId, // You can assign entityId here, based on the context or pass it as an argument
    entityType: entityType
  };
};
