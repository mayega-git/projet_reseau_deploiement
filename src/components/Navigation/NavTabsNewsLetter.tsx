/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type NavRefs = {
  [key: string]: HTMLLIElement | null;
};

const NavTabsNewsLetter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navRefs = useRef<NavRefs>({});
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderLeft, setSliderLeft] = useState<number>(0);

  const activeTab =
    pathname.startsWith('/newsletter/create') ||
    pathname.startsWith('/newsletter/update')
      ? 'Create'
      : 'Newsletters';

  useEffect(() => {
    const selectedNav = navRefs.current[activeTab];

    if (selectedNav) {
      const { width, left } = selectedNav.getBoundingClientRect();
      setSliderWidth(width);
      setSliderLeft(left - 128);
    }
  }, [activeTab]);

  const handleNavClick = (tab: 'Newsletters' | 'Create') => {
    if (tab === 'Newsletters') {
      router.push('/u/newsletter');
    } else {
      router.push('/newsletter/create');
    }
  };

  return (
    <div>
      <nav className="border-b-[2px] border-b-grey-100">
        <div className="container">
          <div className="bg-white">
            <ul className="text-center flex w-full gap-6 items-center p-0 m-0">
              {['Newsletters', 'Create'].map((tab) => (
                <li
                  key={tab}
                  ref={(el) => {
                    navRefs.current[tab] = el;
                  }}
                  className={`text-[16px] px-4 inline py-3 ${
                    activeTab.toLowerCase() === tab.toLowerCase()
                      ? 'text-primaryPurple-500'
                      : 'text-black-300'
                  } cursor-pointer`}
                  onClick={() =>
                    handleNavClick(tab as 'Newsletters' | 'Create')
                  }
                >
                  <a className="paragraph-medium-medium m-0 py-[0.5rem]">
                    {tab}
                  </a>
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
        </div>
      </nav>
    </div>
  );
};

export default NavTabsNewsLetter;
