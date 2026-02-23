import React from 'react';
import '../Blog/styles/blogBackground.css';
import ContentCard from './ContentCard';
import SubscribeCard from '../ui/subscribeCard';
import Button from '../ui/customButton';
import ContentCover from './ContentCover';
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';

interface ContentHomePageProps {
  data: ContentItem[];
  contentType: ContentType;
  coverItem?: ContentItem; // optional cover/hero item
}

const ContentHomePage: React.FC<ContentHomePageProps> = ({
  data,
  contentType,
  coverItem,
}) => {
  const config = getContentConfig(contentType);

  return (
    <div>
      <div className="container">
        <div className="w-full flex flex-col gap-[84px]">
          {/* Cover Image */}
          {coverItem && (
            <ContentCover item={coverItem} contentType={contentType} />
          )}

          {/* Most Popular */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Most Popular</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <ContentCard data={data} contentType={contentType} />
            )}
          </section>

          {/* Most Recent */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Most Recent</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <ContentCard data={data} contentType={contentType} />
            )}
          </section>

          <div className="w-[80%] mx-auto">
            <SubscribeCard />
          </div>

          {/* Explore All */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Explore All</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>
            {Array.isArray(data) && data.length > 0 && (
              <ContentCard data={data} contentType={contentType} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContentHomePage;
