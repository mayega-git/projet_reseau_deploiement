/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, Ellipsis, FlagTriangleRight, Trash2 } from 'lucide-react';
import { ContentItem, ContentType } from '@/types/content';
import { getContentConfig } from '@/lib/contentConfig';
import DeleteDialog from '@/components/Dialogs/DeleteDialog';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ContentActionButtonProps {
  item: ContentItem;
  contentType: ContentType;
}

const ContentActionButton: React.FC<ContentActionButtonProps> = ({
  item,
  contentType,
}) => {
  const config = getContentConfig(contentType);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentId, setCurrentId] = useState('');

  const handleClickDelete = async (id: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(id);
    setTitle(config.deleteLabel);
    setDescription(`Are you sure you want to delete this ${config.label.toLowerCase()}`);
  };

  const { user, role } = useAuth();
  const isCurrentUserProfile = user?.id === item.authorId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {item.status !== 'PUBLISHED' && isCurrentUserProfile && (
            <Link href={`${config.updateRoute}/${item.id}`}>
              <DropdownMenuItem className="px-3 py-2" onClick={() => item.id}>
                <Edit /> Edit post
              </DropdownMenuItem>
            </Link>
          )}
          {!isCurrentUserProfile && (
            <DropdownMenuItem className="px-3 py-2" onClick={() => item.id}>
              <FlagTriangleRight /> Report
            </DropdownMenuItem>
          )}
          {isCurrentUserProfile && (
            <DropdownMenuItem
              className="text-redTheme hover:text-redTheme"
              onClick={() => {
                handleClickDelete(item.id);
              }}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        id={currentId}
        title={title}
        type={contentType}
        description={description}
        action="delete"
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    </>
  );
};

export default ContentActionButton;
