'use client';
import React from 'react';
import Image from 'next/image';
import CustomButton from '../ui/customButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header1 = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
  };

  return (
      <header className="h-[92px] py-5 border-b border-b-grey-100 sticky top-0 w-full bg-white z-50">
      <div className="container flex justify-between items-center gap-3">
        {/* Logo cliquable */}
        <Link href="/">
          <Image
            alt="logo"
            width={110}
            height={52}
            src="/logoBlack.png"
            className="cursor-pointer"
          />
        </Link>

        <nav>
          <ul className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                {/* Bouton vers le Feed */}
                <li>
                  <CustomButton
                    onClick={() => router.push('/u/feed/blog')}
                    variant="tertiary"
                    round={true}
                    className="px-3 sm:px-4"
                  >
                    Dashboard
                  </CustomButton>
                </li>
                {/* Bouton Logout */}
                <li>
                  <CustomButton
                    onClick={handleLogout}
                    variant="primary"
                    round={true}
                    className="px-3 sm:px-4"
                  >
                    Sign out
                  </CustomButton>
                </li>
              </>
            ) : (
              <>
                <li>
                  <CustomButton
                    onClick={() => router.push('/auth/login')}
                    variant="tertiary"
                    round={true}
                    className="px-3 sm:px-4"
                  >
                    Sign in
                  </CustomButton>
                </li>
                <li>
                  <CustomButton
                    onClick={() => router.push('/auth/signup')}
                    variant="primary"
                    round={true}
                    className="px-3 sm:px-4"
                  >
                    <span className="sm:hidden">Sign up</span>
                    <span className="hidden sm:inline">Create an account</span>
                  </CustomButton>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header1;
