/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
// Removed: UserServiceRoutes import (migrated to server actions)
import { PodcastInterface } from '@/types/podcast';
import { GetUser } from '@/types/User';
import React, { useEffect, useRef, useState } from 'react';
import ShareButtons from '../ui/ShareButtons';
import CustomButton from '../ui/customButton';
import { getInitials } from '@/helper/getInitials';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import AudioPlayer from '../AudioPlayer/AudioPlayerPreview';
import Image from 'next/image';
import { truncateText } from '@/helper/TruncateText';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import '../Blog/styles/blogBackground.css';
import AudioPlayerContent from '../AudioPlayer/AudioPlayerContent';
import SubscribeCard from '../ui/subscribeCard';
import CommentSection from '../Comment/CommentSection';
import Link from 'next/link';
import {
  followUser,
  isFollowing as checkIsFollowing,
} from '@/actions/user';
import { useAuth } from '@/context/AuthContext';
import { entityType } from '@/constants/entityType';
import ViewsButton from '../ui/ViewsButton';
import ShareButton2 from '../ui/ShareButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import UserAvatar from '../UserAvatar';
import { AppRoles } from '@/constants/roles';

interface PodcastContentProps {
  podcast: PodcastInterface;
  images: {
    [key: string]: number[];
  };
  userData: GetUser;
}
const PodcastContent: React.FC<PodcastContentProps> = ({
  podcast,
  images,
  userData,
}) => {
  const userInteraction = {
    likes: 0,
    comments: 0,
  };

  const { user, role } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const handleFollowUserInline = async () => {
    if (user?.id) {
      followUser(
        user?.id,
        podcast.authorId
      );
      window.location.reload();
    }
  };

  const checkFollowingStatus = async () => {
    if (user?.id && podcast?.authorId) {
      const isFollowingValue = await checkIsFollowing(
        user.id,
        podcast.authorId
      );
      setIsFollowing(isFollowingValue);
    }
  };
  const scrollToCommentSection = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useEffect(() => {
    checkFollowingStatus();
  }, [user?.id, podcast?.authorId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        <div className="h-full flex flex-col gap-8 w-full max-w-4xl">
          {/* tags and title */}
          <div>
            <div className="flex gap-1">
              {podcast.tags.map((tag, index) => (
                <CustomButton
                  variant="tertiary"
                  className="px-2 py-1 paragraph-small-normal text-[14px] text-black-300 "
                  key={index}
                >
                  #{tag}
                </CustomButton>
              ))}
            </div>
            <p className="h2-bold font-semibold">{podcast.title}</p>
          </div>

          {/* // Podcast Author information */}

          <div className="flex flex-col gap-12">
            <div className="min-h-[46px] flex gap-3">
              {/* image */}
              <Link href={`/profile/${podcast.authorId}`}>
                <UserAvatar
                  size="md"
                  userId={userData.id}
                  fullName={userData.firstName + ' ' + userData.lastName}
                />
              </Link>

              {/* name etc */}
              <div className="flex flex-col w-full justify-between gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="paragraph-medium-normal">
                    {userData.firstName + ' ' + userData.lastName}
                  </p>
                  {user?.id !== podcast.authorId &&
                    !role?.includes(AppRoles.SUPER_ADMIN || AppRoles.ADMIN) &&
                    !isFollowing && (
                      <>
                        <p>·</p>
                        <button
                          onClick={handleFollowUserInline}
                          className="paragraph-medium-medium outline-none p-0 m-0 text-primaryPurple-500 hover:text-primaryPurple-600 transition duration-300"
                        >
                          Follow
                        </button>
                      </>
                    )}
                </div>
                <div className="flex items-center gap-2 text-black-300 text-[14.5px] paragraph-small-normal">
                  {podcast?.publishedAt && (
                    <>
                      <p>{formatDateOrRelative(podcast?.publishedAt)}</p>
                      {podcast?.audioLength && (
                        <>
                          <p>·</p>
                          <p>
                            {formatHumanReadableDuration(podcast?.audioLength)}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* blog image content */}

          <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full">
            {images[podcast.id] &&
              // Convert the binary data to a Base64 string if necessary
              (() => {
                const currentImage = images[podcast.id];
                // Buffer from the binary data (if it's not already Base64)
                const binaryData = Buffer.from(currentImage).toString('base64'); // Convert to Base64 string

                // Create a Data URL (Base64 URL) from the binary data
                const base64ImageUrl = `data:image/jpeg;base64,${binaryData}`; // Adjust MIME type if needed

                return (
                  <Image
                    src={base64ImageUrl} // Use the Base64 image string as the source
                    alt={podcast.title}
                    width={1200}
                    height={100}
                    className="rounded-lg object-cover w-full h-full"
                    // layout="responsive"
                  />
                );
              })()}

            <div className=""></div>
          </div>

          {/* blog interactions */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Audio Player */}
            {(podcast.audioUrl || podcast.id_ressource) && (
              <AudioPlayerContent type="podcast" id={podcast.id} />
            )}
            <div className="border-y border-t py-3 border-grey-300 flex flex-wrap gap-4 sm:gap-6 items-center">
              <LikeDislikeButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <div onClick={scrollToCommentSection}>
                <CommentsButton
                  entityId={podcast.id}
                  entityType={entityType.podcast}
                />
              </div>
              <ViewsButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <AddToFavoritiesButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <ShareButton2
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
            </div>
          </div>
        </div>

        {/* share buttons and main content */}
        <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-4 lg:gap-0">
          <ShareButtons />
          <div className="flex flex-col gap-3 w-full max-w-4xl min-w-0">
            <p className="h1-bold font-bold">Description</p>
            <p className="leading-28 paragraph-medium-normal">
              {podcast.description}
            </p>
          </div>
        </div>
        <div className="mt-10 sm:mt-24 flex flex-col w-full max-w-4xl gap-10 sm:gap-16">
          <SubscribeCard />
          <div
            ref={commentSectionRef}
            className="flex flex-col gap-10 sm:gap-16 w-full mt-10 sm:mt-16"
          >
            <CommentSection
              entityId={podcast.id}
              entityType={entityType.podcast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastContent;
