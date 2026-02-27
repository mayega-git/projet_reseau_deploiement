'use client';

import { usePathname, useRouter } from 'next/navigation';

const NavTabsNewsLetter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname.startsWith('/newsletter/create') ||
    pathname.startsWith('/newsletter/update')
      ? 'create'
      : 'newsletters';

  const handleNavClick = (tab: 'newsletters' | 'create') => {
    if (tab === 'newsletters') {
      router.push('/u/newsletter');
      return;
    }
    router.push('/newsletter/create');
  };

  return (
    <nav className="border-b-[2px] border-b-grey-100 bg-white">
      <div className="container overflow-x-auto no-scrollbar">
        <ul className="text-center flex w-full min-w-[260px] gap-3 sm:gap-6 items-center p-0 m-0">
          {[
            { label: 'Newsletters', value: 'newsletters' as const },
            { label: 'Create', value: 'create' as const },
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

export default NavTabsNewsLetter;
