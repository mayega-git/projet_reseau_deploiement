/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
'use client';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

const FavoritePodcasts = () => {
  const user = useAuth();
  return (
    <div>
      <SidebarPageHeading title="Favorite Podcasts" />
    </div>
  );
};

export default FavoritePodcasts;
