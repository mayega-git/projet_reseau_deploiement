import React from 'react';
import './styles/blogBackground.css';
import BlogCard from './blogCard';
import SubscribeCard from '../ui/subscribeCard';
import Button from '../ui/customButton';
import { coverBlogData } from '@/data/RandomBlogData';
import CoverBlog from './CoverBlog';
import { BlogInterface } from '@/types/blog';

interface BlogPageProps {
  data: BlogInterface[];
 
}
const BlogPage: React.FC<BlogPageProps> = ({ data}) => {
  return (
    <div>
      <div className="container">
        <div className="w-full flex flex-col gap-[84px]">
          {/* coverImage blog */}
          <CoverBlog blog={coverBlogData} />

          {/* most popular */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between">
              <p className="h4-medium">Most Popular</p>
              <Button round variant="outline">
                View all
              </Button>
            </div>

            {Array.isArray(data) && data.length > 0 && (
              <BlogCard data={data}  />
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
              <BlogCard data={data}  />
            )}
          </section>

          <div className='w-[80%] mx-auto'>
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
              <BlogCard data={data}  />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
