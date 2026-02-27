'use client';

import { BlogInterface } from '@/types/blog';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CustomButton from '../ui/customButton';
import BlogCoverImage from './BlogCoverImage';
import ShareButtons from '../ui/ShareButtons';
import SubscribeCard from '../ui/subscribeCard';
import AudioPlayerContent from '../AudioPlayer/AudioPlayerContent';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { GetUser } from '@/types/User';
import ConvertDraftToHTML from '../Editor/ConvertDtaftoHtml';
import CommentSection from '../Comment/CommentSection';
import { useAuth } from '@/context/AuthContext';
import {
  followUser,
  isFollowing as checkIsFollowing,
} from '@/actions/user';
import Link from 'next/link';
import { entityType } from '@/constants/entityType';
import { usePathname, useRouter } from 'next/navigation';
import UserAvatar from '../UserAvatar';
import ShareButton2 from '../ui/ShareButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ViewsButton from '../ui/ViewsButton';
import { AppRoles } from '@/constants/roles';

interface BlogContentParams {
  blog: BlogInterface;
  userData: GetUser;
  param?: string;
}

const BlogContent: React.FC<BlogContentParams> = ({
  blog,
  userData,
  param
}) => {
  const { user, role } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleFollowUserInline = async () => {
    if (user?.id) {
      followUser(
        user?.id,
        blog.authorId
      );
      window.location.reload();
    }
  };

  const checkFollowingStatus = async () => {
    if (user?.id && blog?.authorId) {
      const isFollowingValue = await checkIsFollowing(user.id, blog.authorId);
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
  }, [user?.id, blog?.authorId, param]);

  return (
    <div className="flex flex-col gap-12 sm:gap-24">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col gap-8 w-full max-w-4xl">
          <div>
            <div className="flex gap-1">
              {blog.tags.map((tag, index) => (
                <CustomButton
                  variant="tertiary"
                  className="px-2 py-1 paragraph-small-normal text-[14px] text-black-300 "
                  key={index}
                >
                  #{tag}
                </CustomButton>
              ))}
            </div>
            <p className="h2-bold font-semibold">{blog.title}</p>
          </div>

          <div className="flex flex-col gap-12">
            <div className="min-h-[46px] flex gap-3">
              <Link href={`/profile/${blog.authorId}`}>
                <UserAvatar
                  size="md"
                  userId={userData.id}
                  fullName={userData.firstName + ' ' + userData.lastName}
                />
              </Link>

              <div className="flex flex-col w-full justify-between gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <p className="paragraph-medium-normal text-black-500">
                      {userData.firstName + ' ' + userData.lastName}
                    </p>
                    <p>·</p>
                    <p className="text-black-300 paragraph-small-normal text-[14.5px]">
                      {formatDateOrRelative(blog?.publishedAt)}
                    </p>
                  </div>

                  {isMounted && param !== 'preview' && user?.id !== blog.authorId &&
                    !role?.includes(AppRoles.SUPER_ADMIN || AppRoles.ADMIN) &&
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

                {blog?.publishedAt && (
                  <p className="text-black-300 paragraph-small-normal text-[15px]">
                    {blog.readingTime
                      ? `${blog.readingTime} min read`
                      : '3 min read'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {(blog.audioUrl || blog.id_ressource) && (
              <AudioPlayerContent id={blog.id} type="blog" />
            )}

            {param !== 'preview' && (
              <div className="border-y border-t py-3 border-grey-300 flex flex-wrap gap-4 sm:gap-8 items-center">
                <LikeDislikeButton
                  entityId={blog.id}
                  entityType={entityType.blog}
                />

                <div onClick={scrollToCommentSection}>
                  <CommentsButton
                    entityId={blog.id}
                    entityType={entityType.blog}
                  />
                </div>

                <ViewsButton entityId={blog.id} entityType={entityType.blog} />

                <AddToFavoritiesButton
                  entityId={blog.id}
                  entityType={entityType.blog}
                />
                <ShareButton2
                  entityId={blog.id}
                  entityType={entityType.blog}
                />
              </div>
            )}
          </div>

          <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full">
            <BlogCoverImage  blogId={blog.id} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-4 lg:gap-0">
          <ShareButtons />
          {blog.content && (
            <div className="w-full max-w-4xl min-w-0 leading-28 paragraph-medium-normal">
              <ConvertDraftToHTML content={blog.content} />
            </div>
          )}
        </div>
        <div className="flex flex-col max-w-4xl gap-10 sm:gap-16 w-full mt-10 sm:mt-16">
          <SubscribeCard />
          <div
            ref={commentSectionRef}
            className="flex flex-col gap-10 sm:gap-16 w-full mt-10 sm:mt-16"
          >
            <CommentSection entityId={blog.id} entityType={entityType.blog}  />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
