/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CustomButton from '../ui/customButton';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Globe, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/helper/getInitials';
import { CreateContentIcons } from '../ui/CreateContentIcons';
import Logout from '../Dialogs/LogoutDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { AppRoles } from '@/constants/roles';
import { Button } from '../ui/button';
import BecomeAnAuthorDialog from '../Dialogs/BecomeAnAuthorDialog';

const Header2 = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [showAuthorDialog, setShowAuthorDialog] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="h-[92px] py-5 border-b border-b-grey-100 sticky top-0 w-full bg-white z-50">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-8">
              <Link href="/">

                <Image alt="logo" width={110} height={52} src="/logoBlack.png" />

              </Link>
            <div className="border border-grey-300 flex items-center px-4 py-2 w-[450px] h-10 bg-white rounded-lg">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent w-full  text-black-300 placeholder-black-300 focus:outline-none"
              />
              <Search className="text-black-300 " />
            </div>
          </div>
          <nav className="flex">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6">
                {role && role.includes(AppRoles.AUTHOR) ? (
                  <CreateContentIcons />
                ) : role?.length === 1 && role.includes(AppRoles.USER) ? (
                  <CustomButton
                    onClick={() => setShowAuthorDialog(true)}
                    variant="gradientOrange"
                  >
                    Become an author
                  </CustomButton>
                ) : null}
                <Bell size={24} className="text-black-100" />
                {/* image */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2">
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
                  <DropdownMenuContent className="w-[200px] items-start py-4 px-3 flex flex-col gap-2 bg-white shadow-lg rounded-lg">
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
                        <LogOut strokeWidth={'1.5'} />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* Logout Confirmation Modal */}

      {showLogout && (
        <Logout showLogout={showLogout} setShowLogout={setShowLogout} />
      )}

      {showAuthorDialog && (
        <BecomeAnAuthorDialog
          showDialog={showAuthorDialog}
          setShowDialog={setShowAuthorDialog}
        />
      )}
    </>
  );
};

export default Header2;
