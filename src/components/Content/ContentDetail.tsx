'use client';

import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import React, { useEffect, useRef, useState } from 'react';
import CustomButton from '../ui/customButton';
import ContentCoverImage from './ContentCoverImage';
import ShareButtons from '../ui/ShareButtons';
import SubscribeCard from '../ui/subscribeCard';
import AudioPlayerContent from '../AudioPlayer/AudioPlayerContent';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import { GetUser } from '@/types/User';
import ConvertDraftToHTML from '../Editor/ConvertDtaftoHtml';
import CommentSection from '../Comment/CommentSection';
import { useAuth } from '@/context/AuthContext';
import {
  followUser,
  isFollowing as checkIsFollowing,
} from '@/actions/user';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import UserAvatar from '../UserAvatar';
import ShareButton2 from '../ui/ShareButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ViewsButton from '../ui/ViewsButton';
import { AppRoles } from '@/constants/roles';

interface ContentDetailProps {
  item: ContentItem;
  userData: GetUser;
  contentType: ContentType;
  param?: string;
}

const ContentDetail: React.FC<ContentDetailProps> = ({
  item,
  userData,
  contentType,
  param,
}) => {
  const config = getContentConfig(contentType);
  const { user, role } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleFollowUserInline = async () => {
    if (user?.id) {
      followUser(user?.id, item.authorId);
      window.location.reload();
    }
  };

  const checkFollowingStatus = async () => {
    if (user?.id && item?.authorId) {
      const isFollowingValue = await checkIsFollowing(user.id, item.authorId);
      setIsFollowing(isFollowingValue);
    }
  };

  const scrollToCommentSection = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (param !== 'preview') {
      checkFollowingStatus();
    }
  }, [user?.id, item?.authorId, param]);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col gap-8 w-[800px]">
          {/* Tags and Title */}
          <div>
            <div className="flex gap-1">
              {item.tags.map((tag, index) => (
                <CustomButton
                  variant="tertiary"
                  className="px-2 py-1 paragraph-small-normal text-[14px] text-black-300"
                  key={index}
                >
                  #{tag}
                </CustomButton>
              ))}
            </div>
            <p className="h2-bold font-semibold">{item.title}</p>
          </div>

          {/* Author Information */}
          <div className="flex flex-col gap-12">
            <div className="h-[46px] flex gap-3">
              <Link href={`/profile/${item.authorId}`}>
                <UserAvatar
                  size="md"
                  userId={userData.id}
                  fullName={userData.firstName + ' ' + userData.lastName}
                />
              </Link>

              <div className="flex flex-col w-full justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <p className="paragraph-medium-normal text-black-500">
                      {userData.firstName + ' ' + userData.lastName}
                    </p>
                    <p>·</p>
                    <p className="text-black-300 paragraph-small-normal text-[14.5px]">
                      {formatDateOrRelative(item?.publishedAt)}
                    </p>
                  </div>

                  {isMounted &&
                    param !== 'preview' &&
                    user?.id !== item.authorId &&
                    !role?.includes(
                      AppRoles.SUPER_ADMIN || AppRoles.ADMIN
                    ) &&
                    !isFollowing && (
                      <>
                        <span>·</span>
                        <button
                          onClick={handleFollowUserInline}
                          className="paragraph-medium-medium outline-none p-0 m-0 text-primaryPurple-500 hover:text-primaryPurple-600 transition duration-300"
                        >
                          Follow
                        </button>
                      </>
                    )}
                </div>

                {item?.publishedAt && (
                  <div className="flex items-center gap-2 text-black-300 text-[14.5px] paragraph-small-normal">
                    {config.hasReadingTime && (
                      <p>
                        {item.readingTime
                          ? `${item.readingTime} min read`
                          : '3 min read'}
                      </p>
                    )}
                    {config.hasDuration && item.audioLength && (
                      <>
                        <p>·</p>
                        <p>
                          {formatHumanReadableDuration(item.audioLength)}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Player & Interactions */}
          <div className="flex flex-col gap-4 mt-2">
            {(item.audioUrl || item.id_ressource) &&
              (contentType === 'blog' || contentType === 'podcast') && (
                <AudioPlayerContent id={item.id} type={contentType} />
              )}

            {param !== 'preview' && (
              <div className="border-y border-t py-3 border-grey-300 flex gap-8 items-center">
                <LikeDislikeButton
                  entityId={item.id}
                  entityType={config.entityType}
                />
                <div onClick={scrollToCommentSection}>
                  <CommentsButton
                    entityId={item.id}
                    entityType={config.entityType}
                  />
                </div>
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
            )}
          </div>

          {/* Cover Image */}
          <div className="h-[400px] w-full">
            <ContentCoverImage itemId={item.id} contentType={contentType} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full">
          <ShareButtons />
          {config.hasContent && item.content ? (
            <div className="max-w-[800px] min-w-[100px] leading-28 paragraph-medium-normal">
              <ConvertDraftToHTML content={item.content} />
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-[800px] min-w-[100px]">
              <p className="h1-bold font-bold">Description</p>
              <p className="leading-28 paragraph-medium-normal">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Subscribe & Comments */}
        <div className="flex flex-col max-w-[800px] gap-16 w-full mt-16">
          <SubscribeCard />
          <div
            ref={commentSectionRef}
            className="flex flex-col gap-16 w-full mt-16"
          >
            <CommentSection
              entityId={item.id}
              entityType={config.entityType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
