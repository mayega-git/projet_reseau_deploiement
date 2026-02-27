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
  deleteUser,
  updateUserRoles,
  updateUser,
  getUserByEmail,
  getOrganisationsForUser,
  getOrganisationMembers,
  addUserToOrganisation,
  deleteUserFromOrganisation,
} from '@/lib/fetchers/user';


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
  deleteUser,
  updateUserRoles,
  updateUser,
  getUserByEmail,
  getOrganisationsForUser,
  getOrganisationMembers,
  addUserToOrganisation,
  deleteUserFromOrganisation,
};

import { cookies } from 'next/headers';
import { assignRole as assignRoleFetcher } from '@/lib/fetchers/user';

export async function assignRole(userId: string, roleName: string) {
  const result = await assignRoleFetcher(userId, roleName);
  
  // result is the data object from the backend response
  // Based on the Java code: CreateUserResponseDto has a 'token' field
  if (result && typeof result === 'object' && 'token' in result) {
    const token = (result as { token: string }).token;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 h
      });
      console.log('[actions/user] Updated userToken cookie after role assignment');
    }
  }
  
  return result;
}
