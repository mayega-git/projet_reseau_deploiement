/* eslint-disable @typescript-eslint/no-unused-vars */
// components/SideBarHeader.tsx
'use client';
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, User, Globe, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CreateContentIcons } from '../ui/CreateContentIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import CustomButton from '../ui/customButton';
import { getInitials } from '@/helper/getInitials';
import Logout from '../Dialogs/LogoutDialog';
import Link from 'next/link';
import { AppRoles } from '@/constants/roles';
import BecomeAnAuthorDialog from '../Dialogs/BecomeAnAuthorDialog';

const SideBarHeader = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [showAuthorDialog, setShowAuthorDialog] = useState(false);
  const { user, role } = useAuth();

  return (
    <header className=" flex justify-between items-center px-6 h-[92px] w-full bg-white-50 border-b border-gray-300">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-black-100" />
        <div className="border border-grey-300 flex items-center px-4 py-2 w-[450px] h-10 bg-white rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full  text-black-300 placeholder-black-300 focus:outline-none"
          />
          <Search className="text-black-300 " />
        </div>
      </div>

      <nav className="flex  ">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <Bell size={24} className="text-black-100" />
            {role && (role.includes(AppRoles.AUTHOR) || role.includes(AppRoles.PENDING_ORGANISATION)) ? (
              <CreateContentIcons />
            ) : role?.length === 1 && role.includes(AppRoles.USER) ? (
              <CustomButton
                onClick={() => setShowAuthorDialog(true)}
                variant="gradientOrange"
              >
                Become an author
              </CustomButton>
            ) : null}

            {/* image */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2" suppressHydrationWarning>
                  <div className="cursor-pointer w-[40px] h-[40px] rounded-full bg-purple-700 flex items-center justify-center">
                    <p className="text-white paragraph-large-normal">
                      {getInitials(user?.firstName + ' ' + user?.lastName)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0">
                    <p className="paragraph-medium-medium">
                      {user?.firstName + ' ' + user?.lastName}
                    </p>
                    <p className="paragraph-small-normal text-black-300">
                      {user?.sub}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[160px] mx-8 items-start py-4 px-3 flex flex-col gap-2 bg-white shadow-lg rounded-lg">
                <DropdownMenuGroup className="w-full">
                  {user && (
                    <DropdownMenuItem className="w-full cursor-pointer border-none outline-none flex paragraph-medium-normal items-center gap-2 px-3 rounded-lg hover:outline-none hover:border-none hover:bg-grey-100 bg-transparent py-2">
                      <Link
                        className="flex items-center gap-2"
                        href={`/profile/${user.id}`}
                      >
                        <User strokeWidth="1.5" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setShowLogout(true)}
                    className="w-full cursor-pointer border-none outline-none flex paragraph-medium-normal items-center gap-2 px-3 rounded-lg hover:outline-none hover:border-none hover:bg-grey-100 bg-transparent py-2"
                  >
                    <LogOut strokeWidth={2} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Always render the Logout component */}
      <Logout showLogout={showLogout} setShowLogout={setShowLogout} />

      {showAuthorDialog && (
        <BecomeAnAuthorDialog
          showDialog={showAuthorDialog}
          setShowDialog={setShowAuthorDialog}
        />
      )}
    </header>
  );
};

export default SideBarHeader;
