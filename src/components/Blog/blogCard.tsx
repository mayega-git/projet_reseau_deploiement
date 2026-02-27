/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { BlogInterface } from '@/types/blog';
import { truncateText, truncateTitleText } from '../../helper/TruncateText';
import Link from 'next/link';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ShareButton2 from '../ui/ShareButton';
import BlogCoverImage from './BlogCoverImage';

interface BlogCardProps {
  data: BlogInterface[];
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No blog posts available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data.map((blog) => (
        <div
          key={blog.id}
          className="flex w-full transition duration-300 flex-col gap-4 cursor-pointer"
        >
          <Link href={`/blog/${blog.id}`}>
            <div className="h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden bg-gray-100">
              <BlogCoverImage blogId={blog.id} />
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

            <div className="flex gap-4 items-center">
              <AddToFavoritiesButton
                entityId={blog.id}
                entityType="BLOG"
              />
              <ShareButton2 entityId={blog.id} entityType="BLOG" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
