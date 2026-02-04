/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { ChartNoAxesColumn } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomButton from './customButton';
import { fetchComments } from '@/actions/review';

interface ViewButtonProps {
  entityType: string;
  entityId: string;
  color?: string;
}
const ViewsButton: React.FC<ViewButtonProps> = ({
  entityType,
  entityId,
  color,
}) => {
  const [viewsCount, setViewsCount] = useState<number>(0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`flex items-center gap-1 ${
              color ? `text-gray-white` : `text-gray-500 `
            } hover:scale-105 transition`}
          >
            <ChartNoAxesColumn size={20} />
            <span className="paragraph-medium-normal text-black-300 ml-1">
              {/* {viewsCount === 0 ? '' : viewsCount} */}1
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-[14px] paragraph-small-normal">Views</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ViewsButton;
