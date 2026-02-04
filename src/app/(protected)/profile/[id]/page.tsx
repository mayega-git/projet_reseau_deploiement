/* eslint-disable @typescript-eslint/no-unused-vars */
import NotFoundPage from '@/app/not-found';
import ProfileClientComponent from '@/components/Profile/ProfileClientComponent';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/helper/getInitials';
import {
  getAllBlogsByAuthorId,
  getAllPodcastsByAuthorId,
} from '@/lib/fetchers/blog';
import {
  fetchUserData,
  getAllFollowersOfUser,
  getAllUsersAUserIsFollowing,
} from '@/lib/fetchers/user';
import { cookies } from 'next/headers';
import { decodeJwtPayload } from '@/lib/server/token-manager';
import React from 'react';

export default async function ProfilePage2({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  
  // Server-side owner detection
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  const decoded = token ? decodeJwtPayload(token) : null;
  const currentUserId = (decoded?.sub as string) || (decoded?.id as string);
  const isOwner = currentUserId === id;

  const userData = await fetchUserData(id);
  
  // Fetch according to owner status
  const statusFilter = isOwner ? '' : 'PUBLISHED';
  const blogData = await getAllBlogsByAuthorId(id, statusFilter);
  const podcastData = await getAllPodcastsByAuthorId(id, statusFilter);
  
  const totalPosts = blogData.length + podcastData.length;
  const followers = await getAllFollowersOfUser(id);
  const following = await getAllUsersAUserIsFollowing(id);

  if (!userData) {
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }

  // Pass data to the Client Component
  return (
    <>
      <ProfileClientComponent
        userData={userData}
        blogData={blogData}
        podcastData={podcastData}
        totalPosts={totalPosts}
        followers={followers}
        following={following}
      />
    </>
  );
}
