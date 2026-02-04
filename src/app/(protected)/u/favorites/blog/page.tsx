/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

const FavoriteBlogs = () => {
  const user = useAuth();
  return (
    <div>
      <SidebarPageHeading title="Favorite Blogs" />
    </div>
  );
};

export default FavoriteBlogs;
