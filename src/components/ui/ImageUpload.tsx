/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
// import Image from 'next/image';

import { Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(fileType)) {
        setError('Only PNG or JPG formats are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          if (img.width > 1024 || img.height > 1024) {
            setError('Image must be below 1024x1024px.');
            return;
          }
          setImage(event.target?.result as string);
          setError(null);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[60%] flex flex-col gap-3 max-sm:w-full">
      <div className="flex items-center gap-6 max-sm:flex-col max-sm:items-start ">
        <div
          className={`w-[250px] h-[193px] max-sm:w-[193px] custom:w-[300px] rounded-[12px] flex flex-col items-center justify-center object-coverImage object-center relative`}
          style={{
            // backgroundImage: image ? `url(${image})` : 'none',
            backgroundColor: !image ? 'rgba(239, 235, 255, 1)' : 'transparent',
          }}
        >
          {!image ? (
            <>
              <ImageIcon />
              <label
                htmlFor="image-upload"
                className="text-purplePrimary cursor-pointer font-semibold leading-150 text-base"
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
                + Upload Image
              </label>
            </>
          ) : (
            <>
              {/* <div className='bg-black absolute opacity-50 right-6 top-6 rounded-[12px]'></div> */}
              <div className="h-full w-full">
                <NextImage
                  width={193}
                  height={193}
                  alt="upload image"
                  src={image}
                  className="w-full h-full object-coverImage rounded-xl"
                />
              </div>
              <label
                htmlFor="image-upload"
                className="text-white cursor-pointer font-semibold leading-150 text-base absolute top-[0] bg-black opacity-50 h-full flex flex-col justify-center items-center gap-2 rounded-[12px] w-full "
              >
                <NextImage
                  width={40}
                  height={40}
                  alt="upload image"
                  src="/svg/uploadimagewhite.svg"
                />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="hidden"
                />
                Change Image
              </label>
            </>
          )}
        </div>
        <p className="text-themeGrey text-[14px] leading-150">
          Image must be below 1024x1024px. Use PNG or JPG format.
        </p>
      </div>
      {error && <p className="text-redTheme text-base font-medium">{error}</p>}
    </div>
  );
};

export default ImageUpload;
