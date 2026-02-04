/* eslint-disable @typescript-eslint/no-unused-vars */
import { PodcastInterface } from '@/types/podcast';
import React from 'react';
import Image from 'next/image';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import CustomButton from '../ui/customButton';
import { Play } from 'lucide-react';
import { truncateText, truncateTitleText } from '../../helper/TruncateText';
import Link from 'next/link';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import { entityType } from '@/constants/entityType';
import ViewsButton from '../ui/ViewsButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ShareButton2 from '../ui/ShareButton';
import PodcastCoverImage from './PodcastCoverImage';

interface PodcastCardProps {
  data: PodcastInterface[];
  images?: {
    [key: string]: number[];
  };
}
const PodcastCard: React.FC<PodcastCardProps> = ({ data, images }) => {
  const userInteraction = {
    likes: 0,
    comments: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-y-[60px] gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((podcast, index) => (
        <div
          key={podcast.id}
          className="flex w-full flex-col gap-4 cursor-pointer"
        >
          <Link href={`/podcast/${podcast.id}`}>
            <div className="h-[300px]">
              {images && images[podcast.id] ? (
                (() => {
                  const currentImage = images[podcast.id];
                  const binaryData =
                    Buffer.from(currentImage).toString('base64');
                  const base64ImageUrl = `data:image/jpeg;base64,${binaryData}`;

                  return (
                    <Image
                      src={base64ImageUrl}
                      alt={podcast.title}
                      width={1200}
                      height={100}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  );
                })()
              ) : (
                <PodcastCoverImage podcastId={podcast.id} />
              )}
            </div>
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="content-date flex items-center gap-1">
                {formatDateOrRelative(podcast.publishedAt)}
                <span className="text-center font-semibold text-[18px]">
                  ·
                </span>{' '}
                {formatHumanReadableDuration(podcast.audioLength)}
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
            <div className="flex gap-6 items-center">
              <LikeDislikeButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />

              <CommentsButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <ViewsButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <AddToFavoritiesButton
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
              <ShareButton2
                entityId={podcast.id}
                entityType={entityType.podcast}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastCard;
