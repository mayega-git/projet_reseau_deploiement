/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import React from 'react';
import CustomButton from '../ui/customButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { formatHumanReadableDuration } from '@/helper/formatAudioDuration';
import AudioPlayer from '../AudioPlayer/AudioPlayerPreview';
import Image from 'next/image';
import ConvertDraftToHTML from '../Editor/ConvertDtaftoHtml';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/helper/getInitials';

interface ContentPreviewProps {
  item: ContentItem;
  contentType: ContentType;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  item,
  contentType,
}) => {
  const config = getContentConfig(contentType);
  const { user } = useAuth();

  return (
    <div className="h-full w-full p-0 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col gap-8 w-full">
          {/* Tags and Title */}
          <div>
            <div className="flex gap-1">
              {item.tags.map((tag, index) => (
                <CustomButton
                  variant="tertiary"
                  className="px-2 py-1 paragraph-small-normal text-[14px] text-black-300"
                  key={index}
                >
                  #{tag}
                </CustomButton>
              ))}
            </div>
            <p className="h3-bold font-semibold">{item.title}</p>
          </div>

          {/* Author Information */}
          <div className="flex flex-col gap-12">
            <div className="h-[46px] flex gap-3">
              <div className="w-[46px] h-[46px] rounded-full bg-purple-700 flex items-center justify-center">
                <p className="text-white paragraph-large-normal">
                  {getInitials(user?.firstName + ' ' + user?.lastName)}
                </p>
              </div>

              <div className="flex flex-col w-full justify-between">
                <div className="flex items-center gap-2">
                  <p className="paragraph-medium-normal">
                    {user?.firstName + ' ' + user?.lastName}
                  </p>
                  <p>·</p>
                  <button className="paragraph-medium-normal outline-none p-0 m-0 text-black-300 hover:text-primaryPurple-600 transition duration-300">
                    {new Date().toLocaleDateString('en-GB')}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-black-300 text-[14.5px] paragraph-small-normal">
                  {config.hasReadingTime && (
                    <p>
                      {item.readingTime
                        ? `${item.readingTime} min read`
                        : '2 min read'}
                    </p>
                  )}
                  {config.hasDuration && item.audioLength && (
                    <>
                      <p>·</p>
                      <p>{formatHumanReadableDuration(item.audioLength)}</p>
                    </>
                  )}
                  {item?.publishedAt && (
                    <>
                      <p>·</p>
                      <p>{formatDateOrRelative(item?.publishedAt)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {item.audioUrl && (
            <AudioPlayer type={contentType} data={item.audioUrl} />
          )}
        </div>

        {/* Cover Image */}
        <div className="h-[400px] w-full">
          <Image
            src={item.coverImage}
            alt={item.title}
            width={1200}
            height={100}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Main Content */}
      {config.hasContent && item.content && (
        <div className="flex w-full">
          <div className="w-full min-w-[100px] leading-28 paragraph-medium-normal">
            <ConvertDraftToHTML content={item.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPreview;
