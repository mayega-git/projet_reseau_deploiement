import NavTabsFavoris from '@/components/Navigation/NavTabsFavoris';
import React from 'react';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col gap-4">
      <NavTabsFavoris />
      <main>{children}</main>
    </div>
  );
};

export default layout;
