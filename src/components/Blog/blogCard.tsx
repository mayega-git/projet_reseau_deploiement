/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import Image from 'next/image';
import { BlogInterface } from '@/types/blog';
import { ThumbsUp } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { truncateText, truncateTitleText } from '../../helper/TruncateText';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
// Removed: EducationServiceRoutes import (migrated to server actions)
import { GetUser } from '@/types/User';
import { entityType } from '@/constants/entityType';
import { useAuth } from '@/context/AuthContext';
import ViewsButton from '../ui/ViewsButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ShareButton2 from '../ui/ShareButton';
import BlogCoverImage from './BlogCoverImage';

interface BlogCardProps {
  data: BlogInterface[];
  
}

const userInteraction = {
  likes: 0,
  comments: 0,
};

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  const router = useRouter();
  const { user } = useAuth();
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No blog posts available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-[60px] gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((blog, index) => (
        <div
          key={blog.id}
          className="flex w-full  transition duration-300 flex-col gap-4 cursor-pointer"
        >
          <Link href={`/blog/${blog.id}`}>
            <div className="h-[300px]">
              <BlogCoverImage blogId={blog.id}  />

            </div>
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="content-date flex items-center gap-1">
                {formatDateOrRelative(blog.publishedAt)}
                <span className="text-center font-semibold text-[18px]">
                  ·
                </span>{' '}
                {blog.readingTime
                  ? `${blog.readingTime} min read`
                  : '3 min read'}
              </p>
              <div className="flex flex-col gap-0 max-h-[100px] overflow-hidden">
                <Link className="content-title" href={`/blog/${blog.id}`}>
                  {truncateTitleText(blog.title)}
                  
                </Link>
                <p className="content-preview">
                  {truncateText(blog.description)}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <LikeDislikeButton
                entityId={blog.id}
                entityType={entityType.blog}
              />

              <CommentsButton entityId={blog.id} entityType={entityType.blog} />

              <ViewsButton entityId={blog.id} entityType={entityType.blog} />

              <AddToFavoritiesButton
                entityId={blog.id}
                entityType={entityType.blog}
              />
              <ShareButton2 entityId={blog.id} entityType={entityType.blog} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
