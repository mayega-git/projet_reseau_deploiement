// src/lib/fetchers/user.ts
// Server-only user service fetchers using authFetch.

import { GetUser } from '@/types/User';
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import { UserRoutes } from '@/lib/server/services';
import { authFetch, authFetchData } from '@/lib/server/auth-fetch';
import { getUserBlogCount } from './blog';

// ---------------------------------------------------------------------------
// User data
// ---------------------------------------------------------------------------

export async function fetchUserData(authorId: string): Promise<GetUser | null> {
  return authFetchData<GetUser>(`${UserRoutes.base}/${authorId}`);
}

export async function fetchAllUsers(
  data: (PodcastInterface | BlogInterface)[],
): Promise<Record<string, GetUser>> {
  const usersMap: Record<string, GetUser> = {};

  await Promise.all(
    [...data].reverse().map(async (row) => {
      try {
        const authorData = await fetchUserData(row.authorId);
        usersMap[row.id] = {
          id: authorData?.id || 'unknown',
          firstName: authorData?.firstName || 'Unknown',
          lastName: authorData?.lastName || '',
          email: authorData?.email || '',
          roles: Array.isArray(authorData?.roles)
            ? authorData.roles
            : authorData?.roles
              ? [authorData.roles as unknown as string]
              : [],
          token: null,
        };
      } catch {
        usersMap[row.id] = {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: '',
          email: '',
          roles: [],
          token: null,
        };
      }
    }),
  );

  return usersMap;
}

export async function getAllUsers(): Promise<GetUser[]> {
  return (await authFetchData<GetUser[]>(UserRoutes.base)) ?? [];
}

export interface UserWithBlogCount extends GetUser {
  blogCount?: number;
}

export async function getAllUsersWithBlogCount(): Promise<UserWithBlogCount[]> {
  const users = await getAllUsers();
  return Promise.all(
    users.map(async (user) => {
      try {
        const blogCount = await getUserBlogCount(user.id);
        return { ...user, blogCount };
      } catch {
        return { ...user, blogCount: 0 };
      }
    }),
  );
}

// ---------------------------------------------------------------------------
// Connections (follow / unfollow)
// ---------------------------------------------------------------------------

export async function followUser(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const url = new URL(UserRoutes.follow);
  url.searchParams.set('followerId', followerId);
  url.searchParams.set('followingId', followingId);

  const res = await authFetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok;
}

export async function unfollowUser(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const url = new URL(UserRoutes.unfollow);
  url.searchParams.set('followerId', followerId);
  url.searchParams.set('followingId', followingId);

  const res = await authFetch(url.toString(), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok;
}

export async function isFollowing(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const url = new URL(UserRoutes.isFollowing);
  url.searchParams.set('followerId', followerId);
  url.searchParams.set('followingId', followingId);

  const data = await authFetchData<boolean>(url.toString());
  return data ?? false;
}

export async function getAllFollowersOfUser(userId: string): Promise<unknown[]> {
  const url = new URL(UserRoutes.allFollowers);
  url.searchParams.set('userId', userId);
  return (await authFetchData<unknown[]>(url.toString())) ?? [];
}

export async function getAllUsersAUserIsFollowing(userId: string): Promise<unknown[]> {
  const url = new URL(UserRoutes.allFollowing);
  url.searchParams.set('userId', userId);
  return (await authFetchData<unknown[]>(url.toString())) ?? [];
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export async function assignRole(userId: string, roleName: string): Promise<unknown> {
  const url = new URL(`${UserRoutes.role}/assign`);
  url.searchParams.set('userId', userId);
  url.searchParams.set('roleName', roleName);

  const res = await authFetch(url.toString(), { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to assign role: ${res.statusText}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function deleteUser(userId: string): Promise<void> {
  const res = await authFetch(`${UserRoutes.base}/${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<void> {
  const res = await authFetch(`${UserRoutes.role}/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ roles }),
  });
  if (!res.ok) throw new Error(`Failed to update user roles: ${res.status}`);
}
// ---------------------------------------------------------------------------
// Profile Management
// ---------------------------------------------------------------------------

export async function updateUser(
  userId: string,
  data: Partial<GetUser> & { password?: string }
): Promise<GetUser | null> {
  const res = await authFetch(`${UserRoutes.base}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? json; // Adjust based on actual API response structure
}
