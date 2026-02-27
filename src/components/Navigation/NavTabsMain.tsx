/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const NavTabsMain = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab =
    pathname === '/' ? 'Blog' : pathname === '/podcast' ? 'Podcast' : '';

  const handleNavClick = (navName: 'Blog' | 'Podcast') => {
    // const newParams = new URLSearchParams(searchParams);
    // newParams.set('tab', navName.toLowerCase());
    // router.push(`?${newParams.toString()}`, { scroll: false });
    if (navName === 'Podcast') {
      console.log('➡️ Pushing to /podcast');
      router.push(`/${navName.toLowerCase()}`);
    } else if (navName === 'Blog') {
      router.push(`/`);
    }
  };
  return (
    <div>
      {' '}
      {/* navigation */}
      <nav className="border-b-[2px] border-b-grey-100">
        <div className="container">
          <div className="bg-white">
            <ul className="text-center flex w-full gap-6 items-center p-0 m-0">
              {['Blog', 'Podcast'].map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.toLowerCase();
                return (
                  <li
                    key={tab}
                    className={`text-[16px] px-4 py-3 cursor-pointer border-b-[3px] transition-colors duration-300 ${
                      isActive
                        ? 'text-primaryPurple-500 border-primaryPurple-500'
                        : 'text-black-300 border-transparent hover:text-primaryPurple-400 hover:border-primaryPurple-200'
                    }`}
                    onClick={() => handleNavClick(tab as 'Blog' | 'Podcast')}
                  >
                    <a className="paragraph-medium-medium m-0 block py-[0.5rem]">
                      {tab}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavTabsMain;
