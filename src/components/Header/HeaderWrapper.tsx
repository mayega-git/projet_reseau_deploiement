// components/HeaderWrapper.tsx
'use client';
import React from 'react';
import Header from './Header1';
import Header2 from './Header2';
import { useAuth } from '@/context/AuthContext';

const HeaderWrapper = () => {
  const { user } = useAuth();

  // Render Header2 if the user is authenticated, otherwise render Header
  return user ? <Header2 /> : <Header />;
};

export default HeaderWrapper;
