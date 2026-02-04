/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import React from 'react';
import UserAvatar from '../UserAvatar';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { GetUser } from '@/types/User';
import Link from 'next/link';
import { truncateText, truncateTitleText } from '@/helper/TruncateText';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import ViewsButton from '../ui/ViewsButton';
import ShareButton2 from '../ui/ShareButton';
import Image from 'next/image';
import { entityType } from '@/constants/entityType';
import BlogActionAction from './BlogActionAction';
import { useAuth } from '@/context/AuthContext';
import StatusTag from '../ui/StatusTag';
import { useRouter } from 'next/navigation';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';

interface BlogProfileCardInterface {
  post: BlogInterface[];
  userData: GetUser;
}

const BlogProfileCard: React.FC<BlogProfileCardInterface> = ({
  post,
  userData,
}) => {
  //get current loggedIn user
  const { user } = useAuth();
  const router = useRouter();
  // Check if the logged-in user is viewing their own profile
  const isCurrentUserProfile = user?.id === userData.id;
  const handleUrl = (status: string, id: string) => {
    if (status === 'PUBLISHED') {
      router.push(`/blog/${id}`);
    } else if (status === 'CREATED') {
      router.push(`/blog/update/${id}`);
    }
  };
  return (
    <>
      {post?.length > 0 ? (
        <div className="bg-white rounded-lg w-full shadow-md ">
          {[...post]
            .filter((p) => p.authorId === userData.id)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post) => (
              <div
                className="cursor-pointer p-4 flex flex-col gap-3 w-full bg-white border-b border-grey-300 hover:bg-grey-100 trannsition"
                key={post.id}
              >
                <div onClick={() => handleUrl(post.status, post.id)}>
                  <div className="flex w-full justify-between items-start">
                    {/* User Data */}
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        userId={userData.id}
                        fullName={userData.firstName + ' ' + userData.lastName}
                      />
                      <div className="flex flex-col gap-[-4px]">
                        <div className="flex items-center gap-1">
                          <p className="paragraph-medium-normal text-black-500">
                            {userData.firstName + '' + userData.lastName}
                          </p>
                          <p>·</p>
                          <p className=" text-black-300 paragraph-small-normal text-[14.5px]">
                            {formatDateOrRelative(post?.publishedAt)}
                          </p>
                        </div>

                        {post?.publishedAt && (
                          <>
                            <p className="text-black-300 paragraph-small-normal text-[15px]">
                              {post.readingTime
                                ? `${post.readingTime} min read`
                                : '3 min read'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      {isCurrentUserProfile && (
                        <StatusTag status={post.status} />
                      )}
                      <BlogActionAction blog={post} />
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="mt-2 flex flex-col gap-1 max-h-[100px] overflow-hidden">
                    <Link
                      className="paragraph-large-normal font-semibold"
                      href={`/blog/${post.id}`}
                    >
                      {post.title}
                    </Link>
                    <p className="paragraph-xmedium-normal text-[16px] text-black-300">
                      {truncateText(post.description)}
                    </p>
                  </div>
                </div>

                {/* Post Status */}
                <div className="flex gap-12 items-center mt-2">
                  <LikeDislikeButton
                    entityId={post.id}
                    entityType={entityType.blog}
                  />
                  <CommentsButton
                    entityId={post.id}
                    entityType={entityType.blog}
                  />
                  <ViewsButton
                    entityId={post.id}
                    entityType={entityType.blog}
                  />
                  <AddToFavoritiesButton
                    entityId={post.id}
                    entityType={entityType.blog}
                  />
                  <ShareButton2
                    entityId={post.id}
                    entityType={entityType.blog}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mt-24">
          <p className="paragraph-medium-normal font-normal text-black-300">
            No posts yet!
          </p>
        </div>
      )}
    </>
  );
};

export default BlogProfileCard;
