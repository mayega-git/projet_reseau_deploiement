'use client';

import React, { useEffect, useState } from 'react';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import EmptyState from '@/components/EmptyState/EmptyState';
import UserDataTable from '@/components/DataTable/UserDataTable';
import { getAllUsersWithBlogCount } from '@/actions/user';
import type { UserWithBlogCount } from '@/actions/user';

const ManageUsers = () => {
  const [users, setUsers] = useState<UserWithBlogCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsersWithBlogCount();
        console.log('✅ Users loaded:', data.length);
        setUsers(data);
      } catch (err) {
        console.error('❌ Error loading users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Users"
          subtitle="View and manage platform users"
        />
        <div className="text-center py-8">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Users"
          subtitle="View and manage platform users"
        />
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Users"
          subtitle="View and manage platform users"
        />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Users"
          subtitle="View and manage platform users"
        />
        <UserDataTable data={users} />
      </div>
    </div>
  );
};

export default ManageUsers;