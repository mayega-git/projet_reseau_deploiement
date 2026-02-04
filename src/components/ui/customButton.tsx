'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'primaryOutline'
    | 'outline'
    | 'tertiary'
    | 'gradientOrange'
    | 'gradientPurple'; // Define variants for easy styling
  icon?: React.ReactNode;
  round?: boolean;
  square?: boolean;
  className?: string;
}
const CustomButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  round,
  square,
  className,
  onClick,
  ...props
}) => {
  const baseStyles =
    'h-10 px-4 py-2 inline-flex paragraph-medium-medium items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

  const variantStyles =
    variant === 'primary'
      ? 'bg-primaryPurple-500 text-white hover:bg-primaryPurple-600'
      : variant === 'primaryOutline'
      ? 'text-primaryPurple-500 bg-white border border-primaryPurple-500 hover:bg-[#e0e0e580]'
      : variant === 'secondary'
      ? 'bg-secondaryOrange-500 text-white hover:bg-secondaryOrange-600'
      : variant === 'outline'
      ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
      : variant === 'tertiary'
      ? 'hover:bg-grey-100 opacity:0.6 '
      : variant === 'gradientOrange'
      ? ' text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg'
      : variant === 'gradientPurple'
      ? 'text-white bg-gradient-to-r from-primaryPurple-500 via-purple-600 to-pink-500 hover:from-primaryPurple-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg'
      : '';

  const shapeStyles = round
    ? 'rounded-full'
    : square
    ? 'rounded-none'
    : 'rounded-md';

  const iconStyles = icon ? 'gap-2' : '';

  // console.log({
  //   variantStyles,
  //   shapeStyles,
  //   iconStyles,
  //   className,
  // });
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles,
        shapeStyles,
        iconStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default CustomButton;
