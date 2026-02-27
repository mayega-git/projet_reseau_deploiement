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

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const mostPopular = data.slice(0, 3);
  const mostRecent = data.slice(3, 9);
  const exploreAll = data.slice(9);

  return (
    <div>
      <div className="container">
        <div className="w-full flex flex-col gap-14 md:gap-20">
          {/* coverImage blog */}
          <CoverBlog blog={coverBlogData} />

          {/* most popular */}
          <section className="flex flex-col gap-8">
            <div className="w-full items-center flex justify-between gap-4">
              <p className="h4-medium">Most Popular</p>
              <Button round variant="outline" className="hidden sm:inline-flex">
                View all
              </Button>
            </div>

            {Array.isArray(mostPopular) && mostPopular.length > 0 && (
              <BlogCard data={mostPopular} />
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
              <BlogCard data={mostRecent} />
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
              <BlogCard data={exploreAll} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
