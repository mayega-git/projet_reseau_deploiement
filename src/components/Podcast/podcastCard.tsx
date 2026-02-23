/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContentItem } from '@/types/content';
import { PodcastInterface } from '@/types/podcast';
import ContentCard from '../Content/ContentCard';


interface PodcastCardProps {
  data: ContentItem[];
  
}

function PodcastCard({ data }: PodcastCardProps) {
  return (
    <ContentCard data={data} contentType="podcast" />
  );
}

export default PodcastCard;
