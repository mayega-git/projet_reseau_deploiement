/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import React from 'react';
import UserAvatar from '../UserAvatar';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import { GetUser } from '@/types/User';
import Link from 'next/link';
import { truncateText } from '@/helper/TruncateText';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import ViewsButton from '../ui/ViewsButton';
import ShareButton2 from '../ui/ShareButton';
import ContentActionButton from './ContentActionButton';
import { useAuth } from '@/context/AuthContext';
import StatusTag from '../ui/StatusTag';
import { useRouter } from 'next/navigation';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';

interface ContentProfileCardProps {
  post: ContentItem[];
  userData: GetUser;
  contentType: ContentType;
}

const ContentProfileCard: React.FC<ContentProfileCardProps> = ({
  post,
  userData,
  contentType,
}) => {
  const config = getContentConfig(contentType);
  const { user } = useAuth();
  const router = useRouter();
  const isCurrentUserProfile = user?.id === userData.id;

  const handleUrl = (status: string, id: string) => {
    if (status === 'PUBLISHED') {
      router.push(`${config.routePrefix}/${id}`);
    } else if (status === 'CREATED') {
      router.push(`${config.routePrefix}/update/${id}`);
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
            .map((item) => (
              <div
                className="cursor-pointer p-4 flex flex-col gap-3 w-full bg-white border-b border-grey-300 hover:bg-gray-100 transition"
                key={item.id}
              >
                <div onClick={() => handleUrl(item.status, item.id)}>
                  <div className="flex w-full justify-between items-start">
                    {/* User Data */}
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        userId={userData.id}
                        fullName={
                          userData.firstName + ' ' + userData.lastName
                        }
                      />
                      <div className="flex flex-col gap-[-4px]">
                        <div className="flex items-center gap-1">
                          <p className="paragraph-medium-normal text-black-500">
                            {userData.firstName + ' ' + userData.lastName}
                          </p>
                          <p>·</p>
                          <p className=" text-black-300 paragraph-small-normal text-[14.5px]">
                            {formatDateOrRelative(item?.publishedAt)}
                          </p>
                        </div>

                        {item?.publishedAt && (
                          <>
                            {config.hasReadingTime && (
                              <p className="text-black-300 paragraph-small-normal text-[15px]">
                                {item.readingTime
                                  ? `${item.readingTime} min read`
                                  : '3 min read'}
                              </p>
                            )}
                            {config.hasDuration && item.audioLength && (
                              <div className="text-black-300 paragraph-small-normal text-[15px]">
                                <p>
                                  {formatHumanReadableDuration(
                                    item.audioLength
                                  )}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      {isCurrentUserProfile && (
                        <StatusTag status={item.status} />
                      )}
                      <ContentActionButton
                        item={item}
                        contentType={contentType}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-2 flex flex-col gap-1 max-h-[100px] overflow-hidden">
                    <Link
                      className="paragraph-large-normal font-semibold"
                      href={`${config.routePrefix}/${item.id}`}
                    >
                      {item.title}
                    </Link>
                    <p className="paragraph-xmedium-normal text-[16px] text-black-300">
                      {truncateText(item.description)}
                    </p>
                  </div>
                </div>

                {/* Post Interactions */}
                <div className="flex gap-12 items-center mt-2">
                  <LikeDislikeButton
                    entityId={item.id}
                    entityType={config.entityType}
                  />
                  <CommentsButton
                    entityId={item.id}
                    entityType={config.entityType}
                  />
                  <ViewsButton
                    entityId={item.id}
                    entityType={config.entityType}
                  />
                  <AddToFavoritiesButton
                    entityId={item.id}
                    entityType={config.entityType}
                  />
                  <ShareButton2
                    entityId={item.id}
                    entityType={config.entityType}
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

export default ContentProfileCard;
