'use server';

// src/actions/forum.ts
// Server Actions exposing forum operations to Client Components.

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
} from '@/lib/fetchers/forum';

export {
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
};
