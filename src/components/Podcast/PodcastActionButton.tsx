/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, Ellipsis, Trash2, FlagTriangleRight } from 'lucide-react';
import { BlogInterface } from '@/types/blog';
import DeleteDialog from '@/components/Dialogs/DeleteDialog';
import { PodcastInterface } from '@/types/podcast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface PodcastActionBtnInterface {
  podcast: PodcastInterface;
}

const PodcastActionButton: React.FC<PodcastActionBtnInterface> = ({
  podcast,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentId, setCurrentId] = useState('');

  const handleClickDelete = async (id: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(id);
    setTitle(`Delete podcast`);
    setDescription(`Are you sure you want to delete this podcast`);
  };

  //get current loggedIn user
  const { user, role } = useAuth();

  // Check if the logged-in user is viewing their own profile
  const isCurrentUserProfile = user?.id === podcast.authorId;

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
          {podcast.status !== 'PUBLISHED' && isCurrentUserProfile && (
            <Link href={`/u/update/podcast/${podcast.id}`}>
              <DropdownMenuItem
                className="px-3 py-2"
                onClick={() => podcast.id}
              >
                <Edit /> Edit post
              </DropdownMenuItem>
            </Link>
          )}

          {!isCurrentUserProfile && (
            <DropdownMenuItem className="px-3 py-2" onClick={() => podcast.id}>
              <FlagTriangleRight /> Report
            </DropdownMenuItem>
          )}

          {isCurrentUserProfile && (
            <DropdownMenuItem
              className="text-redTheme hover:text-redTheme"
              onClick={() => {
                handleClickDelete(podcast.id);
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
        type={'blog'}
        description={description}
        action="delete"
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    </>
  );
};

export default PodcastActionButton;
