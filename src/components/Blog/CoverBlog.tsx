/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlogInterface } from '@/types/blog';
import React from 'react';
import Image from 'next/image';
import './styles/blogBackground.css';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import Link from 'next/link';

interface CoverBlogParams {
  blog: BlogInterface;
}
const CoverBlog: React.FC<CoverBlogParams> = ({ blog }) => {
  return (
    <Link href={`/blog/${blog.id}`}>
      <section className="background-container-blog">
        <div className="background-overlay-blog" />
        <Image
          src={blog.coverImage}
          alt="Background"
          // layout="intrinsic" // Make the image responsive while maintaining aspect ratio
          width={1200} // Set the width to the original image's width or desired aspect ratio
          height={420} // Set the height to match the container or desired aspect ratio
          className="background-image-blog"
        />
        <div className="text-overlay-blog">
          <p className="paragraph-small-medium">
            {formatDateOrRelative(blog.publishedAt)}
          </p>
          <div className="flex flex-col gap-1">
            <p className="h5-medium">{blog.title}</p>
            <p className="paragraph-medium-normal">{blog.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-6 items-center text-white">
                {/* <LikeDislikeButton color="#fff" initialLikes={0} />
                <CommentsButton color="#fff" commentCount={0} /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
};

export default CoverBlog;
