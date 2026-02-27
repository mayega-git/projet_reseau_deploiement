/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import '../Blog/styles/blogBackground.css';
import PodcastCard from './podcastCard';
import SubscribeCard from '../ui/subscribeCard';
import Button from '../ui/customButton';
import { PodcastInterface } from '@/types/podcast';

interface PodcastCardProps {
  data: PodcastInterface[];
}

const PodcastPage: React.FC<PodcastCardProps> = ({ data }) => {
  const mostPopular = data.slice(0, 3);
  const mostRecent = data.slice(3, 9);
  const exploreAll = data.slice(9);

  return (
    <div>
      <div className="container">
        <div className="w-full flex flex-col gap-14 md:gap-20">
          {/* coverImage blog */}
          <section className="background-container-blog">
            <div className="background-overlay-blog" />
            <Image
              src="/images/content/background2.png"
              alt="Background"
              width={1200}
              height={420}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="background-image-blog"
              priority
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
            <div className="w-full items-center flex justify-between gap-4">
              <p className="h4-medium">Most Popular</p>
              <Button round variant="outline" className="hidden sm:inline-flex">
                View all
              </Button>
            </div>
            {Array.isArray(mostPopular) && mostPopular.length > 0 && (
              <PodcastCard data={mostPopular} />
            )}
          </section>

          {/* most recent */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between gap-4">
              <p className="h4-medium">Most Recent</p>
              <Button round variant="outline" className="hidden sm:inline-flex">
                View all
              </Button>
            </div>
            {Array.isArray(mostRecent) && mostRecent.length > 0 && (
              <PodcastCard data={mostRecent} />
            )}
          </section>

          <div className="w-full lg:w-[80%] mx-auto">
            <SubscribeCard />
          </div>

          {/* Explorre all */}
          {exploreAll.length > 0 && (
            <section className="flex flex-col gap-8">
              <div className="w-full items-center flex justify-between gap-4">
                <p className="h4-medium">Explore All</p>
                <Button
                  round
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  View all
                </Button>
              </div>
              <PodcastCard data={exploreAll} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
