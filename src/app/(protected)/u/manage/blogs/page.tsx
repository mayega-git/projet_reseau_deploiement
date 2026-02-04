/* eslint-disable @typescript-eslint/no-unused-vars */
import BlogAndPodcastDataTable from '@/components/DataTable/BlogAndPodcastDataTable';
import EmptyState from '@/components/EmptyState/EmptyState';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { getAllBlogsEverCreated } from '@/lib/fetchers/blog';
import { fetchAllUsers } from '@/lib/fetchers/user';
import React from 'react';

const ManageBlogs = async () => {
  const allBlogs = await getAllBlogsEverCreated();

  if (!allBlogs || allBlogs.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Blogs"
          subtitle="Verify, publish and manage blogs"
        />
        <EmptyState />
      </div>
    );
  }
  console.log(allBlogs);
  const Users = await fetchAllUsers(allBlogs);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Blogs"
          subtitle="Verify, publish and manage blogs"
        />
        <React.Suspense fallback={<div>Loading blogs...</div>}>
          <BlogAndPodcastDataTable type="blog" data={allBlogs} users={Users} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default ManageBlogs;
