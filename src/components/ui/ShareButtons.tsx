/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';
import { Copy } from 'lucide-react';

const socialPlatforms = [
  {
    name: 'twitter',
    icon: <Twitter size={24} />,
    url: 'https://twitter.com/intent/tweet?url=',
  },
  {
    name: 'linkedin',
    icon: <Linkedin size={24} />,
    url: 'https://www.linkedin.com/sharing/share-offsite/?url=',
  },
  {
    name: 'facebook',
    icon: <Facebook size={24} />,
    url: 'https://www.facebook.com/sharer/sharer.php?u=',
  },
  {
    name: 'instagram',
    icon: <Instagram size={24} />,
    url: 'https://www.instagram.com/',
  },
];

const ShareButtons = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');

  //   useEffect(() => {
  //     const handleScroll = () => setIsSticky(window.scrollY > 100);
  //     window.addEventListener('scroll', handleScroll);
  //     return () => window.removeEventListener('scroll', handleScroll);
  //   }, []);

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

  return (
    <div
      className="overflow-hidden py-4 lg:py-6 lg:sticky lg:top-32 lg:mr-10 flex flex-row lg:flex-col items-center gap-3 lg:gap-4 h-full text-black-300"
    >
      <p className="font-medium paragraph-medium-medium hidden lg:block">Share</p>
      {socialPlatforms.map(({ name, icon, url }) => (
        <button
          key={name}
          onClick={() => shareOnSocialMedia(url)}
          className="hover:text-secondaryOrange-500 transition-colors"
          aria-label={`Share on ${name}`}
        >
          {icon}
        </button>
      ))}
      <button
        onClick={copyToClipboard}
        className="hover:text-secondaryOrange-500 transition-colors"
        aria-label="Copy link to clipboard"
      >
        <Copy size={24} />
      </button>
    </div>
  );
};

export default ShareButtons;
