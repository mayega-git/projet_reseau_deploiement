/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import '../Blog/styles/blogBackground.css';
import { ThumbsUp } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import PodcastCard from './podcastCard';
import SubscribeCard from '../ui/subscribeCard';
import Button from '../ui/customButton';
import { PodcastInterface } from '@/types/podcast';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';

interface PodcastCardProps {
  data: PodcastInterface[];
  images: {
    [key: string]: number[];
  };
}

const PodcastPage: React.FC<PodcastCardProps> = ({ data, images }) => {
  return (
    <div>
      <div className="container">
        <div className="w-full flex flex-col gap-[84px]">
          {/* coverImage blog */}
          <section className="background-container-blog">
            <div className="background-overlay-blog" />
            <Image
              src="/images/content/background2.png"
              alt="Background"
              // layout="intrinsic" // Make the image responsive while maintaining aspect ratio
              width={1200} // Set the width to the original image's width or desired aspect ratio
              height={420} // Set the height to match the container or desired aspect ratio
              className="background-image-blog"
            />
            <div className="text-overlay-blog">
              <p className="paragraph-small-medium">
                10 October 2024 · 30 minutes
              </p>
              <div className="flex flex-col gap-1">
                <p className="h5-medium">Infrastructure Insights</p>
                <p className="paragraph-medium-normal">
                  How Cameroon’s infrastructure impacts daily travel and safety.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex gap-6 items-center text-white">
                    {/* <LikeDislikeButton color="#fff" initialLikes={0} />
                    <CommentsButton color="#fff" commentCount={0} /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* most popular */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Most Popular</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <PodcastCard data={data} images={images} />
            )}
          </section>

          {/* most recent */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Most Recent</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <PodcastCard data={data} images={images} />
            )}
          </section>

          <div className="w-[80%] mx-auto">
            <SubscribeCard />
          </div>

          {/* Explorre all */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Explore All</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <PodcastCard data={data} images={images} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
