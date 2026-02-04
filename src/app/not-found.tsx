
import React from 'react';
import Link from 'next/link';
import HeaderWrapper from '@/components/Header/HeaderWrapper';

const NotFoundPage = () => {
  return (
    <div className=" bg-white min-h-screen">
      {' '}
      {/* Added background gradient and min-height */}
      <HeaderWrapper />
      <main className="flex flex-col items-center justify-center mt-28 py-16">
        {' '}
        {/* Added padding */}
        <div className="w-[34%] flex flex-col justify-center items-center gap-8 rounded-lg shadow-lg p-12">
          {' '}
          {/* Added card styling */}
          <p className="notfound text-[80px] text-center h1-bold text-primaryPurple-500 animate-pulse">
            {' '}
            {/* Added pulse animation */}
            404
          </p>
          <p className="text-center paragraph-large-medium text-black-500">
            Oops! The page you&apos;re looking for doesn&apos;t exist.{' '}
            {/* Improved message */}
          </p>
          <Link
            href="/"
            className="bg-primaryPurple-500 text-white text-center w-[150px] paragraph-medium-medium py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            {' '}
            {/* Added a "Go Home" button */}
            Go Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
