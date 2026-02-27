/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import dynamic from 'next/dynamic';
import BlogContent from '@/components/Blog/BlogContent';
import NotFoundPage from '@/app/not-found';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import { fetchBlogAudio, fetchBlogImage } from '@/lib/fetchers/blog';
import { fetchUserData } from '@/lib/fetchers/user';
import { fetchBlogById } from '@/lib/fetchers/blog';

// Lazy-load non-critical components
const Footer = dynamic(() => import('@/components/Footer'));

export default async function BlogPostPageFunction({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  console.log(id);

  // Fetch all data in parallel

  const BlogPost = await fetchBlogById(id);

  // Early return if blog post is not found
  if (!BlogPost) {
    return <NotFoundPage />;
  }

  //const BlogImage = await fetchBlogImage(id);
  const UserData = await fetchUserData(BlogPost.authorId);

  // Early return if author data is not found
  if (!UserData) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <HeaderWrapper />
      <React.Suspense fallback={<div>Loading...</div>}>
        <section className="flex flex-col gap-16 sm:gap-32">
          <div className="w-full min-h-screen max-w-[1000px] mx-auto mt-6 sm:mt-12 px-3 sm:px-4">
            <BlogContent
              blog={BlogPost}
              //images={BlogImage}
              userData={UserData}
              param = 'preview'
            />
          </div>
        </section>
      </React.Suspense>
      <Footer />
    </div>
  );
}
