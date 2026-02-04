import BlogAndPodcastDataTable from '@/components/DataTable/BlogAndPodcastDataTable';
import EmptyState from '@/components/EmptyState/EmptyState';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { getAllPodcasts } from '@/lib/fetchers/blog';
import { fetchAllUsers } from '@/lib/fetchers/user';
import React from 'react';

const ManagePodcasts = async () => {
  const allPodcasts = await getAllPodcasts();
  if (!allPodcasts || allPodcasts.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Podcasts"
          subtitle="Verify, publish and manage podcasts"
        />
        <EmptyState />
      </div>
    );
  }
  const Users = await fetchAllUsers(allPodcasts);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Podcasts"
          subtitle="Verify, publish and manage podcasts"
        />
        <React.Suspense fallback={<div>Loading podcasts...</div>}>
          <BlogAndPodcastDataTable
            type="podcast"
            data={allPodcasts}
            users={Users}
          />
        </React.Suspense>
      </div>
    </div>
  );
};

export default ManagePodcasts;
