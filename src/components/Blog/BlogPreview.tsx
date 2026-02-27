/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlogInterface, CreateBlogInterface } from '@/types/blog';
import React from 'react';
import CustomButton from '../ui/customButton';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import AudioPlayer from '../AudioPlayer/AudioPlayerPreview';
import Image from 'next/image';
import ConvertDraftToHTML from '../Editor/ConvertDtaftoHtml';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/helper/getInitials';

interface BlogContentParams {
  blog: CreateBlogInterface;
}

const BlogPreview: React.FC<BlogContentParams> = ({ blog }) => {
  const { user } = useAuth();

  console.log(blog, 'blog data logged in blog preview page');

  return (
    <div className=" h-full w-full p-0 flex flex-col items-center justify-center gap-8">
      <div className=" flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col gap-8 w-full">
          {/* tags and title */}
          <div>
            <div className="flex gap-1">
              {blog.tags.map((tag, index) => (
                <CustomButton
                  variant="tertiary"
                  className="px-2 py-1 paragraph-small-normal text-[14px] text-black-300 "
                  key={index}
                >
                  #{tag}
                </CustomButton>
              ))}
            </div>
            <p className="h3-bold font-semibold">{blog.title}</p>
          </div>

          {/* // Blog Author information */}

          <div className="flex flex-col gap-8 sm:gap-12">
            <div className="min-h-[46px] flex gap-3">
              {/* image */}
              <div className="w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-full bg-purple-700 flex items-center justify-center">
                <p className="text-white paragraph-large-normal">
                  {getInitials(user?.firstName+' '+user?.lastName)}
                </p>
              </div>

              {/* name etc */}
              <div className="flex flex-col w-full justify-between">
                <div className="flex items-center gap-2">
                  <p className="paragraph-medium-normal">{user?.firstName+' '+user?.lastName}</p>
                  <p>·</p>
                  <button className="paragraph-medium-normal outline-none p-0 m-0 text-black-300 hover:text-primaryPurple-600 transition duration-300">
                    {new Date().toLocaleDateString('en-GB')}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-black-300 text-[14.5px] paragraph-small-normal">
                  <p>
                    {' '}
                    {blog.readingTime
                      ? `${blog.readingTime} min read`
                      : '2 min read'}
                  </p>
                  {blog?.publishedAt && (
                    <>
                      <p>·</p>
                      <p>{formatDateOrRelative(blog?.publishedAt)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* blog interactions */}
          {/* <div className="flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <LikeDislikeButton initialLikes={userInteraction.likes} />
            <CommentsButton commentCount={userInteraction.comments} />
          </div> */}

          {/* Audio Player */}
          {blog.audioUrl && blog.audioUrl && (
            <AudioPlayer type="blog" data={blog.audioUrl} />
          )}
        </div>

        {/* blog image content */}

        <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={1200}
            height={100}
            className="rounded-lg object-coverImage w-full h-full"
            // layout="responsive"
          />
        </div>
      </div>

      {/* share buttons and main content */}
      {blog.content && (
        <div className="flex w-full">
          <div className="w-full min-w-[100px] leading-28 paragraph-medium-normal">
            <ConvertDraftToHTML content={blog.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPreview;
