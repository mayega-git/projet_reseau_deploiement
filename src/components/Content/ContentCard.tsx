/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import { truncateText, truncateTitleText } from '../../helper/TruncateText';
import Link from 'next/link';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import CommentsButton from '../ui/CommentsButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import { useAuth } from '@/context/AuthContext';
import ViewsButton from '../ui/ViewsButton';
import AddToFavoritiesButton from '../ui/AddToFavoritiesButton';
import ShareButton2 from '../ui/ShareButton';
import ContentCoverImage from './ContentCoverImage';

interface ContentCardProps {
  data: ContentItem[];
  contentType: ContentType;
}

const ContentCard: React.FC<ContentCardProps> = ({ data, contentType }) => {
  const config = getContentConfig(contentType);
  const { user } = useAuth();

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center text-gray-500">{config.emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-[60px] gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex w-full transition duration-300 flex-col gap-4 cursor-pointer"
        >
          <Link href={`${config.routePrefix}/${item.id}`}>
            <div className="h-[300px]">
              <ContentCoverImage itemId={item.id} contentType={contentType} />
            </div>
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="content-date flex items-center gap-1">
                {formatDateOrRelative(item.publishedAt)}
                {config.hasReadingTime && (
                  <>
                    <span className="text-center font-semibold text-[18px]">
                      ·
                    </span>{' '}
                    {item.readingTime
                      ? `${item.readingTime} min read`
                      : '3 min read'}
                  </>
                )}
                {config.hasDuration && item.audioLength && (
                  <>
                    <span className="text-center font-semibold text-[18px]">
                      ·
                    </span>{' '}
                    {formatHumanReadableDuration(item.audioLength)}
                  </>
                )}
              </p>
              <div className="flex flex-col gap-0 max-h-[100px] overflow-hidden">
                <Link
                  className="content-title"
                  href={`${config.routePrefix}/${item.id}`}
                >
                  {truncateTitleText(item.title)}
                </Link>
                <p className="content-preview">
                  {truncateText(item.description)}
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <LikeDislikeButton
                entityId={item.id}
                entityType={config.entityType}
              />
              <CommentsButton
                entityId={item.id}
                entityType={config.entityType}
              />
              <ViewsButton
                entityId={item.id}
                entityType={config.entityType}
              />
              <AddToFavoritiesButton
                entityId={item.id}
                entityType={config.entityType}
              />
              <ShareButton2
                entityId={item.id}
                entityType={config.entityType}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentCard;
