import NavTabs from '@/components/Navigation/Navtabs';
import React from 'react';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col gap-12">
      <NavTabs />
      <main>{children}</main>
    </div>
  );
};

export default layout;
