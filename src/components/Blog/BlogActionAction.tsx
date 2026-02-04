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
import { Edit, Ellipsis, FlagTriangleRight, Trash2 } from 'lucide-react';
import { BlogInterface } from '@/types/blog';
import DeleteDialog from '@/components/Dialogs/DeleteDialog';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface BlogActionAction {
  blog: BlogInterface;
}

const BlogActionAction: React.FC<BlogActionAction> = ({ blog }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentId, setCurrentId] = useState('');

  const handleClickDelete = async (id: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(id);
    setTitle(`Delete blog`);
    setDescription(`Are you sure you want to delete this blog`);
  };

  //get current loggedIn user
  const { user, role } = useAuth();

  // Check if the logged-in user is viewing their own profile
  const isCurrentUserProfile = user?.id === blog.authorId;

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
          {blog.status !== 'PUBLISHED' && isCurrentUserProfile && (
            <Link href={`/u/update/blog/${blog.id}`}>
              <DropdownMenuItem className="px-3 py-2" onClick={() => blog.id}>
                <Edit /> Edit post
              </DropdownMenuItem>
            </Link>
          )}
          {!isCurrentUserProfile && (
            <DropdownMenuItem className="px-3 py-2" onClick={() => blog.id}>
              <FlagTriangleRight /> Report
            </DropdownMenuItem>
          )}

          {isCurrentUserProfile && (
            <DropdownMenuItem
              className="text-redTheme hover:text-redTheme"
              onClick={() => {
                handleClickDelete(blog.id);
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
        type={'podcast'}
        description={description}
        action="delete"
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    </>
  );
};

export default BlogActionAction;
