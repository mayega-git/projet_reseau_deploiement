/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import CreateNewAuthor from '@/components/Dialogs/CreateNewAuthor';
import EmptyState from '@/components/EmptyState/EmptyState';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import React from 'react';

const MyAuthors = () => {
  return (
    <div>
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Your Authors"
          subtitle="Create, Manage, and Suspend Authors Within Your Organisation"
        />
        <EmptyState />
      </div>
    </div>
  );
};

export default MyAuthors;
