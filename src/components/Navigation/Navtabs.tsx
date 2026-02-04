/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type NavRefs = {
  [key: string]: HTMLLIElement | null;
};

const NavTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const navRefs = useRef<NavRefs>({});
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderLeft, setSliderLeft] = useState<number>(0);

  const activeTab =
    pathname === '/u/feed/blog'
      ? 'Blog'
      : pathname === '/u/feed/podcast'
      ? 'Podcast'
      : '';

  useEffect(() => {
    const selectedNav = navRefs.current[activeTab];
    if (selectedNav) {
      const { width, left } = selectedNav.getBoundingClientRect();
      setSliderWidth(width);
      setSliderLeft(left - 280);
    }
  }, [activeTab]);

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
          {['Blog', 'Podcast'].map((tab) => (
            <li
              key={tab}
              ref={(el) => {
                navRefs.current[tab] = el;
              }}
              className={`text-[16px] px-4 inline py-3 ${
                activeTab.toLocaleLowerCase() === tab.toLowerCase()
                  ? 'text-primaryPurple-500'
                  : 'text-black-300'
              } cursor-pointer`}
              onClick={() => handleNavClick(tab as 'Blog' | 'Podcast')}
            >
              <a className="paragraph-medium-medium m-0 py-[0.5rem]">{tab}</a>
            </li>
          ))}
        </ul>
        <hr
          className="h-[0.2rem] rounded bg-primaryPurple-500 border-none p-0 transition-all ease-in-out duration-300"
          style={{
            width: sliderWidth,
            transform: `translateX(${sliderLeft}px)`,
          }}
        />
      </div>
    </nav>
  );
};

export default NavTabs;
