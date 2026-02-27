/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { AppSidebar } from '@/app/sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React, { useEffect, useState } from 'react';
import SideBarData from '@/data/SideBarData';
import NotFoundPage from '@/app/not-found';
import { usePathname } from 'next/navigation';
import SideBarHeader from '@/components/Header/SideBarHeader';
import { useAuth } from '@/context/AuthContext';

const RoleLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) => {
  const { role } = useAuth();

  const pathname = usePathname();
  console.log('User role logged in rolelayout:', role); // Log role value

  // if (!role) return null;

  //function to check roles before rendering sidebar
  // const isValidPathForRole = (role: string, pathname: string) => {
  //   return SideBarData.some((item) => {
  //     // Check if the item's URL or any subnav URL matches the pathname
  //     if (item.url === pathname) return true;
  //     if (item.subnav) {
  //       return item.subnav.some((subItem) => subItem.url === pathname);
  //     }
  //     return false;
  //   });
  // };

  // if (!isValidPathForRole(role, pathname)) {
  //   return <NotFoundPage />;
  // } else {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SideBarHeader />
        <main className="w-full px-3 sm:px-4 lg:px-6 mt-4 mb-12 sm:mb-16">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RoleLayout;
