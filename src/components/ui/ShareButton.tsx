/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { ChartNoAxesColumn, Copy, Share } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomButton from './customButton';
import { fetchComments } from '@/actions/review';
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';

interface ShareButtonProps {
  entityType: string;
  entityId: string;
  color?: string;
}
const ShareButton2: React.FC<ShareButtonProps> = ({
  entityType,
  entityId,
  color,
}) => {
  const [shareCount, setShareCount] = useState<number>(0);
  const [articleUrl, setArticleUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setArticleUrl(encodeURIComponent(window.location.href));
    }
  }, []);

  const shareOnSocialMedia = (platformUrl: string) => {
    if (articleUrl) {
      window.open(`${platformUrl}${articleUrl}`, '_blank');
    }
  };

  const copyToClipboard = () => {
    if (articleUrl) {
      navigator.clipboard
        .writeText(decodeURIComponent(articleUrl))
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Failed to copy link: ', err));
    }
  };
  const socialPlatforms = [
    {
      name: 'twitter',
      text: 'Share to Twitter',
      icon: <Twitter size={24} />,
      url: 'https://twitter.com/intent/tweet?url=',
    },
    {
      name: 'linkedin',
      text: 'Share to LinkedIn',
      icon: <Linkedin size={24} />,
      url: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    },
    {
      name: 'facebook',
      text: 'Share to Facebook',
      icon: <Facebook size={24} />,
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    {
      name: 'instagram',
      icon: <Instagram size={24} />,
      text: 'Share to Instagram',
      url: 'https://www.instagram.com/',
    },
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 ${
                  color ? `text-gray-white` : `text-gray-500`
                } hover:scale-105 transition`}
              >
                <Share size={18} />
                <span className="content-interaction">
                  {shareCount === 0 ? '' : `${shareCount} shares`}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyToClipboard} className="">
                <div className="flex items-center gap-2">
                  <Copy size={18} />
                  <p>Copy link</p>
                </div>
              </DropdownMenuItem>
              {socialPlatforms.map((socialPlatform, index) => (
                <DropdownMenuItem
                  onClick={() => shareOnSocialMedia(socialPlatform.url)}
                  key={index}
                  className=""
                >
                  <div className="flex items-center gap-2">
                    {socialPlatform.icon}
                    <p>{socialPlatform.text}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-[14px] paragraph-small-normal">Share</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareButton2;
