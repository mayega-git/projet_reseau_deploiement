/* eslint-disable @typescript-eslint/no-unused-vars */
import { PodcastInterface } from '@/types/podcast';
import React from 'react';
import { truncateText, truncateTitleText } from '../../helper/TruncateText';
import Link from 'next/link';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ShareButton2 from '../ui/ShareButton';
import PodcastCoverImage from './PodcastCoverImage';

interface PodcastCardProps {
  data: PodcastInterface[];
}

const PodcastCard: React.FC<PodcastCardProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data.map((podcast) => (
        <div
          key={podcast.id}
          className="flex w-full flex-col gap-4 cursor-pointer"
        >
          <Link href={`/podcast/${podcast.id}`}>
            <div className="h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden bg-gray-100">
              <PodcastCoverImage podcastId={podcast.id} />
            </div>
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="content-date flex items-center gap-1">
                {formatDateOrRelative(podcast.publishedAt)}
                {podcast.audioLength && (
                  <>
                    <span className="text-center font-semibold text-[18px]">
                      ·
                    </span>{' '}
                    {formatHumanReadableDuration(podcast.audioLength)}
                  </>
                )}
              </p>

              <div className="flex flex-col gap-0 max-h-[100px] overflow-hidden">
                <Link className="content-title" href={`/podcast/${podcast.id}`}>
                  {truncateTitleText(podcast.title)}
                </Link>

                <p className="content-preview">
                  {truncateText(podcast.description)}
                </p>
              </div>
              {/* <Button className="w-fit mt-2" icon variant="primary">
              {' '}
              <Image src="/play.png" alt="play icon" width={24} height={24} />
              Play now
            </Button> */}
            </div>
            <div className="flex gap-4 items-center">
              <AddToFavoritiesButton
                entityId={podcast.id}
                entityType="PODCAST"
              />
              <ShareButton2
                entityId={podcast.id}
                entityType="PODCAST"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastCard;
