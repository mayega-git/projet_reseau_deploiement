/* eslint-disable @typescript-eslint/no-unused-vars */
import UpdateBlogComponent from '@/components/Blog/UpdateBlogComponent';
import EmptyState from '@/components/EmptyState/EmptyState';
import { fetchBlogById } from '@/lib/fetchers/blog';
import React from 'react';

export default async function UpdateBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const BlogPost = await fetchBlogById(id);
  if (!BlogPost) {
    return <EmptyState />;
  }

  return (
    <div>
      <UpdateBlogComponent blog={BlogPost} />
    </div>
  );
}
