'use client';
import { ContentItem } from '@/types/content';
import ContentCard from '../Content/ContentCard';

interface BlogCardProps {
  data: ContentItem[];
}

function BlogCard({ data }: BlogCardProps) {
  return (
    <ContentCard data={data} contentType="blog" />
  );
}

export default BlogCard;
