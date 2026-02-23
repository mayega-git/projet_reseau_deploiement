/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import React from 'react';
import Image from 'next/image';
import '../Blog/styles/blogBackground.css';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import Link from 'next/link';

interface ContentCoverProps {
  item: ContentItem;
  contentType: ContentType;
}

const ContentCover: React.FC<ContentCoverProps> = ({ item, contentType }) => {
  const config = getContentConfig(contentType);

  return (
    <Link href={`${config.routePrefix}/${item.id}`}>
      <section className="background-container-blog">
        <div className="background-overlay-blog" />
        <Image
          src={item.coverImage}
          alt="Background"
          width={1200}
          height={420}
          className="background-image-blog"
        />
        <div className="text-overlay-blog">
          <p className="paragraph-small-medium">
            {formatDateOrRelative(item.publishedAt)}
          </p>
          <div className="flex flex-col gap-1">
            <p className="h5-medium">{item.title}</p>
            <p className="paragraph-medium-normal">{item.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-6 items-center text-white">
                {/* Interactions placeholder */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
};

export default ContentCover;
