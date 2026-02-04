/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomButton from './customButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchComments } from '@/actions/review';

interface CommentsButtonProps {
  entityType: string;
  entityId: string;
  color?: string;
}
const CommentsButton: React.FC<CommentsButtonProps> = ({
  entityType,
  entityId,
  color,
}) => {
  const [commentCount, setCommentCount] = useState<number>(0);

  const getAllCommentInformation = async () => {
    try {
      const data = await fetchComments(entityId);
      if (data) {
        setCommentCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    getAllCommentInformation();
  }, [entityId, entityType]);

  useEffect(() => {
    console.log(commentCount);
  }, [commentCount]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`flex items-center gap-1 ${
              color ? `text-gray-white` : `text-gray-500 `
            } hover:scale-105 transition`}
          >
            <MessageCircle size={18} />
            <span className="ml-1 paragraph-medium-normal text-black-300">
              {commentCount && commentCount !== 0 ? commentCount : null}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-[14px] paragraph-small-normal">Comment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommentsButton;
