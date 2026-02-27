// src/lib/fetchers/user.ts
// Server-only user service fetchers using authFetch.

import type { GetUser, UserWithBlogCount } from '@/types/User';
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

// ---------------------------------------------------------------------------
// Connections (follow / unfollow)

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

// ---------------------------------------------------------------------------
// Organisation Members
// ---------------------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<GetUser | null> {
  const url = UserRoutes.userByEmail.replace('{email}', encodeURIComponent(email));
  return authFetchData<GetUser>(url);
}

export async function getOrganisationsForUser(userId: string): Promise<GetUser[]> {
  const url = UserRoutes.userOrganisations.replace('{userId}', encodeURIComponent(userId));
  const data = await authFetchData<GetUser[]>(url);
  return data ?? [];
}

export async function getOrganisationMembers(orgId: string): Promise<GetUser[]> {
  // We assume the userOrganisations endpoint gives members when targeting an org ID or similar, 
  // or we use the base fallback. Given the endpoints provided, org members aren't directly 
  // specified as a GET. Assuming GET on deleteUserFromOrganisation URL works for fetching.
  const url = UserRoutes.deleteUserFromOrganisation.replace('{orgId}', encodeURIComponent(orgId));
  const data = await authFetchData<GetUser[]>(url);
  return data ?? [];
}

export async function addUserToOrganisation(orgId: string, userId: string): Promise<void> {
  const url = UserRoutes.addUserToOrganisation
    .replace('{orgId}', encodeURIComponent(orgId))
    .replace('{userId}', encodeURIComponent(userId));
  
  const res = await authFetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to add user to organisation: ${res.statusText}`);
}

export async function deleteUserFromOrganisation(orgId: string, userId: string): Promise<void> {
  // Using the delete URL which ends with /members. In REST typically it's DELETE /members/{userId}
  // If the backend expects the userId in the query parameter or body, we adjust here.
  // Based on standard REST, let's append /userId if missing, or use query param.
  // Looking at UserRoutes.deleteUserFromOrganisation: `${ServiceURLs.user}/api/users/{orgId}/members`
  // It most likely expects the userId in the path or as a query param. 
  // Let's assume path:
  const url = `${UserRoutes.deleteUserFromOrganisation.replace('{orgId}', encodeURIComponent(orgId))}/${encodeURIComponent(userId)}`;
  
  const res = await authFetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user from organisation: ${res.statusText}`);
}
