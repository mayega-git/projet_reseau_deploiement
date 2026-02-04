import React from 'react';
import { SquarePen, Mic } from 'lucide-react';
import Link from 'next/link';
export const CreateContentIcons = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="">
        <Link
          className="hover:text-black-300 transition duration-300  px-[8px] py-[10px] paragraph-medium-medium flex items-center gap-2"
          href="/blog/create"
        >
          <SquarePen size={24} />
          Write
        </Link>
      </div>
      
      <div className="">
        <Link
          className=" hover:text-black-300 transition duration-300 px-[8px] py-[10px] paragraph-medium-medium flex items-center gap-2"
          href="/podcast/create"
        >
          {' '}
          <Mic size={24} />
          Upload
        </Link>
      </div>
    </div>
  );
};
