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
          width={1200}
          height={420}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="background-image-blog"
          priority
        />
        <div className="text-overlay-blog">
          <p className="paragraph-small-medium">
            {formatDateOrRelative(blog.publishedAt)}
          </p>
          <div className="flex flex-col gap-1">
            <p className="h6-medium sm:text-h5 sm:leading-32">{blog.title}</p>
            <p className="paragraph-small-normal sm:text-paragraph-medium sm:leading-24">
              {blog.description}
            </p>
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
