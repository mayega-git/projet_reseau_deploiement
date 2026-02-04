/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import dynamic from 'next/dynamic';
import BlogContent from '@/components/Blog/BlogContent';
import NotFoundPage from '@/app/not-found';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import { fetchBlogAudio, fetchBlogImage } from '@/lib/fetchers/blog';
import { fetchBlogById } from '@/lib/fetchers/blog';
import CommentSection from '@/components/Comment/CommentSection';
import { fetchUserData } from '@/lib/fetchers/user';

// Lazy-load non-critical components
const Footer = dynamic(() => import('@/components/Footer'));

export default async function BlogPostPageFunction({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  // console.log(id);

  // Fetch all data in parallel

  const BlogPost = await fetchBlogById(id);
  // Early return if blog post is not found
  if (!BlogPost) {
    return <NotFoundPage />;
  }
  const UserData = await fetchUserData(BlogPost.authorId);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <HeaderWrapper />
      <React.Suspense fallback={<div>Loading...</div>}>
        <section className="flex flex-col gap-32">
          <div className="w-[1000px] min-h-screen max-w-[1400px] mx-auto mt-12">
            <BlogContent
              blog={BlogPost}
              userData={UserData}
            />
          </div>
        </section>
      </React.Suspense>
      <Footer />
    </div>
  );
}
