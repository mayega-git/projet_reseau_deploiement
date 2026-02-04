
import type { DiscussionGroup, Category, Post, Comment } from '@/types/forum';
import { API_BASE_URL } from '@/types/constantsForum';
// Server Actions imports
import {
  getValidatedGroups,
  getAllGroups,
  validateGroup,
  rejectGroup,
  deleteGroup,
  createGroup,
  getCategoriesByGroup,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPostsByGroup,
  getPostById,
  createPost,
  likePost,
  dislikePost,
  getCommentsByPost,
  createForumComment,
  updateForumComment,
  deleteForumComment,
} from '@/actions/forum';

// Mapper function to normalize backend Post response to frontend format
function normalizePost(post: any): Post {
  const authorName = post.authorName ||
    (post.authorFirstName && post.authorLastName ? `${post.authorFirstName} ${post.authorLastName}` : null) ||
    (post.firstName && post.lastName ? `${post.firstName} ${post.lastName}` : null) ||
    (post.firstname && post.lastname ? `${post.firstname} ${post.lastname}` : null) ||
    (post.author?.firstName && post.author?.lastName ? `${post.author.firstName} ${post.author.lastName}` : null) ||
    (post.author?.firstname && post.author?.lastname ? `${post.author.firstname} ${post.author.lastname}` : null) ||
    post.authorFirstName ||
    post.firstName ||
    post.firstname ||
    post.author?.firstName ||
    post.author?.firstname ||
    'Utilisateur';

  return {
    ...post,
    likes: post.numberOfLikes ?? post.likes ?? 0,
    dislikes: post.numberOfDislikes ?? post.dislikes ?? 0,
    commentCount: post.numberOfCommentaires ?? post.numberOfComments ?? post.commentCount ?? post.postCommentaires?.length ?? 0,
    createdAt: post.creationDate ?? post.createdAt,
    authorName,
  };
}

function normalizeComment(comment: any): Comment {
  const authorName = comment.authorName ||
    (comment.authorFirstName && comment.authorLastName ? `${comment.authorFirstName} ${comment.authorLastName}` : null) ||
    (comment.firstName && comment.lastName ? `${comment.firstName} ${comment.lastName}` : null) ||
    (comment.firstname && comment.lastname ? `${comment.firstname} ${comment.lastname}` : null) ||
    (comment.author?.firstName && comment.author?.lastName ? `${comment.author.firstName} ${comment.author.lastName}` : null) ||
    (comment.author?.firstname && comment.author?.lastname ? `${comment.author.firstname} ${comment.author.lastname}` : null) ||
    comment.authorFirstName ||
    comment.firstName ||
    comment.firstname ||
    comment.author?.firstName ||
    comment.author?.firstname ||
    'Utilisateur';

  return {
    ...comment,
    createdAt: comment.creationDate ?? comment.createdAt,
    authorName,
    replies: comment.replies ? comment.replies.map(normalizeComment) : []
  };
}

/**
 * Utility to build a nested comment tree from a flat list
 */
export function buildCommentTree(flatComments: any[]): Comment[] {
  if (!flatComments || !Array.isArray(flatComments)) return [];

  const normalized = flatComments.map(normalizeComment);
  const commentMap = new Map<string, Comment>();
  const roots: Comment[] = [];

  // First pass: put everything in the map
  normalized.forEach(comment => {
    commentMap.set(comment.commentaireId, { ...comment, replies: [] });
  });

  // Second pass: link children to parents or identify roots
  normalized.forEach(comment => {
    const current = commentMap.get(comment.commentaireId)!;
    const parentId = comment.parentCommentId || comment.parentId;

    if (parentId && commentMap.has(parentId)) {
      commentMap.get(parentId)!.replies!.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
}

class ForumAPI {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  // Discussion Groups
  async getValidatedGroups(): Promise<DiscussionGroup[]> {
    try {
      return await getValidatedGroups();
    } catch (error) {
      console.error('Failed to get validated rules', error);
      return [];
    }
  }

  async getAllGroups(): Promise<DiscussionGroup[]> {
    try {
      return await getAllGroups();
    } catch (error) {
      console.error('Failed to get all groups', error);
      return [];
    }
  }

  async validateGroup(groupId: string): Promise<void> {
    await validateGroup(groupId);
  }

  async rejectGroup(groupId: string): Promise<void> {
    await rejectGroup(groupId);
  }

  async deleteGroup(groupId: string): Promise<void> {
    await deleteGroup(groupId);
  }

  async createGroup(name: string, description: string, creatorId: string): Promise<DiscussionGroup> {
    return await createGroup(name, description, creatorId);
  }


  // Categories
  async getCategoriesByGroup(groupId: string): Promise<Category[]> {
    try {
      return await getCategoriesByGroup(groupId);
    } catch (error) {
      console.error('Failed to get categories by group', error);
      return [];
    }
  }


  async createCategory(groupId: string, categorieName: string): Promise<Category> {
    return await createCategory(groupId, categorieName);
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await getAllCategories();
    } catch (error) {
      console.error('Failed to get all categories', error);
      return [];
    }
  }


  async getCategoriesByGroupId(groupeId: string): Promise<Category[]> {
    return this.getCategoriesByGroup(groupeId);
  }

  async updateCategory(categorieId: string, categorie: Category): Promise<Category> {
    return await updateCategory(categorieId, categorie);
  }

  async deleteCategory(categorieId: string): Promise<void> {
    await deleteCategory(categorieId);
  }


  // Posts
  async getPostsByGroup(groupId: string): Promise<Post[]> {
    try {
      return await getPostsByGroup(groupId);
    } catch (error) {
      console.error('Failed to get posts by group', error);
      return [];
    }
  }

  async getPostById(postId: string): Promise<Post> {
    return await getPostById(postId);
  }


  async createPost(
    groupId: string,
    title: string,
    content: string,
    memberId: string,
    categoryId?: string
  ) {
    return await createPost(groupId, title, content, memberId, categoryId);
  }



  async likePost(postId: string, memberId: string): Promise<Post> {
    return await likePost(postId, memberId);
  }
  async dislikePost(postId: string, memberId: string): Promise<Post> {
    return await dislikePost(postId, memberId);
  }


  // Comments
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    try {
      return await getCommentsByPost(postId);
    } catch (error) {
      console.error('Failed to get comments by post', error);
      return [];
    }
  }

  async createComment(
    postId: string,
    content: string,
    memberId: string,
    parentCommentId?: string
  ): Promise<Comment> {
    return await createForumComment(postId, content, memberId, parentCommentId);
  }


  async updateComment(commentId: string, content: string) {
    return await updateForumComment(commentId, content);
  }


  async deleteComment(commentId: string, memberId: string): Promise<void> {
    await deleteForumComment(commentId, memberId);
  }
}

// Factory function to create API instance with token
export function createForumAPI(token?: string): ForumAPI {
  return new ForumAPI(token);
}

// Default instance for backward compatibility
export const api = new ForumAPI();

