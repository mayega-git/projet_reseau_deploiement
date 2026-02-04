/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-3 mt-56">
      <Image
        src="/images/no-data.jpeg"
        alt="no data found"
        width={200}
        height={200}
      />
      <p className="paragraph-medium-normal font-normal text-black-300">
        No data available yet
      </p>
    </div>
  );
};

export default EmptyState;
