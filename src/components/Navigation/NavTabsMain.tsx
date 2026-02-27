'use client';

import { usePathname, useRouter } from 'next/navigation';

const NavTabsMain = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname === '/' ? 'blog' : pathname === '/podcast' ? 'podcast' : '';

  const handleNavClick = (tab: 'blog' | 'podcast') => {
    if (tab === 'blog') {
      router.push('/');
      return;
    }
    router.push('/podcast');
  };

  return (
    <nav className="border-b-[2px] border-b-grey-100">
      <div className="container">
        <div className="bg-white overflow-x-auto no-scrollbar">
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
      </div>
    </nav>
  );
};

export default NavTabsMain;
