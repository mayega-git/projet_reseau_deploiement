/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const NavTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab =
    pathname === '/u/feed/blog'
      ? 'Blog'
      : pathname === '/u/feed/podcast'
      ? 'Podcast'
      : '';

  const handleNavClick = (navName: 'Blog' | 'Podcast') => {
    // const newParams = new URLSearchParams(searchParams);
    // newParams.set('tab', navName.toLowerCase());
    // router.push(`?${newParams.toString()}`, { scroll: false });

    if (navName === 'Podcast') {
      router.push(`/u/feed/podcast`);
    } else if (navName === 'Blog') {
       router.push(`/u/feed/blog`);
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b-[2px] bg-pink-100 border-b-grey-100">
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
                <a className="paragraph-medium-medium m-0 block py-[0.5rem]">{tab}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavTabs;
