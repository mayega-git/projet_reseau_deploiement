'use server';

// src/actions/user.ts
// Server Actions exposing user service operations to Client Components.

import {
  fetchUserData,
  fetchAllUsers,
  getAllUsers,
  getAllUsersWithBlogCount,
  followUser,
  unfollowUser,
  isFollowing,
  getAllFollowersOfUser,
  getAllUsersAUserIsFollowing,
  assignRole,
  deleteUser,
  updateUserRoles,
  updateUser,
} from '@/lib/fetchers/user';
import type { UserWithBlogCount } from '@/lib/fetchers/user';

export type { UserWithBlogCount };

export {
  fetchUserData,
  fetchAllUsers,
  getAllUsers,
  getAllUsersWithBlogCount,
  followUser,
  unfollowUser,
  isFollowing,
  getAllFollowersOfUser,
  getAllUsersAUserIsFollowing,
  assignRole,
  deleteUser,
  updateUserRoles,
  updateUser,
};
