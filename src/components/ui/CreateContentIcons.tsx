'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SquarePen, Mic } from 'lucide-react';
import Link from 'next/link';

function ContentChoicesWrite() {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
      <ul className="py-1">
        <li>
          <Link
            className="hover:bg-gray-100 transition duration-300 px-[12px] py-[10px] paragraph-medium-medium flex items-center gap-2"
            href="/blog/create"
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            className="hover:bg-gray-100 transition duration-300 px-[12px] py-[10px] paragraph-medium-medium flex items-center gap-2"
            href="/course/create"
          >
            Course
          </Link>
        </li>
      </ul>
    </div>
  );
}

export const CreateContentIcons = () => {
  const [showWritePopup, setShowWritePopup] = useState(false);
  const writeRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (writeRef.current && !writeRef.current.contains(event.target as Node)) {
        setShowWritePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={writeRef}>
        <button
          onClick={() => setShowWritePopup((prev) => !prev)}
          className="hover:text-black-300 transition duration-300 px-[8px] py-[10px] paragraph-medium-medium flex items-center gap-2 cursor-pointer"
        >
          <SquarePen size={24} />
          Write
        </button>
        {showWritePopup && <ContentChoicesWrite />}
      </div>

      <div className="">
        <Link
          className="hover:text-black-300 transition duration-300 px-[8px] py-[10px] paragraph-medium-medium flex items-center gap-2"
          href="/podcast/create"
        >
          <Mic size={24} />
          Upload
        </Link>
      </div>
    </div>
  );
};
