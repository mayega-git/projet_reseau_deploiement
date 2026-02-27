'use client';

import { usePathname, useRouter } from 'next/navigation';

const NavTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname === '/u/feed/blog'
      ? 'blog'
      : pathname === '/u/feed/podcast'
        ? 'podcast'
        : '';

  const handleNavClick = (tab: 'blog' | 'podcast') => {
    if (tab === 'blog') {
      router.push('/u/feed/blog');
      return;
    }
    router.push('/u/feed/podcast');
  };

  return (
    <nav className="sticky top-0 z-10 border-b-[2px] border-b-grey-100 bg-white">
      <div className="overflow-x-auto no-scrollbar">
        <ul className="text-center flex w-full min-w-[220px] gap-3 sm:gap-6 items-center p-0 m-0">
          {[
            { label: 'Blog', value: 'blog' as const },
            { label: 'Podcast', value: 'podcast' as const },
          ].map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <li
                key={tab.value}
                className={`text-[16px] px-2 sm:px-4 inline py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'text-primaryPurple-500 border-primaryPurple-500'
                    : 'text-black-300 border-transparent'
                } cursor-pointer`}
                onClick={() => handleNavClick(tab.value)}
              >
                <span className="paragraph-medium-medium m-0 py-[0.5rem]">
                  {tab.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavTabs;
