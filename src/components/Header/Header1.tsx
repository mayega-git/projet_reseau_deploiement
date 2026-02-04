'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CustomButton from '../ui/customButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header1 = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
  };

  // Évite les erreurs d'hydratation SSR
  if (!mounted) {
    return (
      <header className="h-[92px] py-5 border-b border-b-grey-100 sticky top-0 w-full bg-white z-50">
        <div className="container flex justify-between items-center">
          <Image alt="logo" width={110} height={52} src="/logoBlack.png" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-[92px] py-5 border-b border-b-grey-100 sticky top-0 w-full bg-white z-50">
      <div className="container flex justify-between items-center">
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
          <ul className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Bouton vers le Feed */}
                <li>
                  <CustomButton
                    onClick={() => router.push('/u/feed/blog')}
                    variant="tertiary"
                    round={true}
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
                  >
                    Sign in
                  </CustomButton>
                </li>
                <li>
                  <CustomButton
                    onClick={() => router.push('/auth/signup')}
                    variant="primary"
                    round={true}
                  >
                    Create an account
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