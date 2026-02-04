import React from 'react';
interface SidebarPageHeadingProps {
  title: string;
  subtitle?: string;
}

const SidebarPageHeading: React.FC<SidebarPageHeadingProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col gap-1 mt-4">
      <p className="h5-medium font-semibold">{title}</p>{' '}
      <p className="paragraph-medium-regular text-black-300">{subtitle}</p>
    </div>
  );
};

export default SidebarPageHeading;
