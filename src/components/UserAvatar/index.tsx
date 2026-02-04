'use client';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/helper/getInitials';
import { cn } from '@/lib/utils';
import React from 'react';

interface UserAvatarProps {
  userId: string;
  fullName: string;
  email?: string; // Optional email to display
  size?: 'md' | 'lg' | 'sm'; // Make size optional with a default value
  backgroundColor?: string; // Allow custom background color
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  fullName,
  size = 'md', // Default size
}) => {
  // Get logged-in user
  const { user } = useAuth();

  // Check if the logged-in user is viewing their own profile
  const isCurrentUserProfile = user?.id === userId;
  console.log(fullName);

  // Base styles for the avatar
  const baseStyles =
    'cursor-pointer rounded-full flex items-center justify-center';

  // Size variants
  const sizeVariant =
    size === 'sm'
      ? 'h-[40px] w-[40px]'
      : size === 'lg'
      ? 'h-[50px] w-[50px]'
      : size === 'md'
      ? 'h-[46px] w-[46px]'
      : '';

  const textVariant =
    size === 'md'
      ? 'paragraph-large-normal text-white'
      : size === 'lg'
      ? 'paragraph-large-medium text-white'
      : size === 'sm'
      ? ' paragraph-medium-normal text-white '
      : '';

  // Background color logic
  const avatarBackgroundColor = isCurrentUserProfile
    ? 'bg-purple-700'
    : 'bg-gray-400';

  return (
    <figure className="flex items-center gap-2">
      {/* Avatar */}
      <div className={cn(baseStyles, sizeVariant, avatarBackgroundColor)}>
        <p className={cn(textVariant)}>{getInitials(fullName)}</p>
      </div>

      {/* User Info
      <figcaption className="flex flex-col gap-0">
        <p className="paragraph-medium-medium">{fullName}</p>
        {email && (
          <p className="paragraph-small-normal text-black-300">{email}</p>
        )}
      </figcaption> */}
    </figure>
  );
};

export default UserAvatar;
