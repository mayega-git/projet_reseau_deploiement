/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { BlogInterface } from '@/types/blog';
import React, { useEffect, useState } from 'react';
import { Archive, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Eye } from 'lucide-react';
import { truncateText } from '@/helper/TruncateText';
import StatusTag from '../ui/StatusTag';
import { GetUser } from '@/types/User';
import { PodcastInterface } from '@/types/podcast';
import { useRouter } from 'next/navigation';
import { publishBlog as serverPublishBlog, publishPodcast as serverPublishPodcast } from '@/actions/education';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import RefuseDialog from '../Dialogs/RefuseDialog';
import DeleteDialog from '../Dialogs/DeleteDialog';

interface DataTableProps {
  data: BlogInterface[] | PodcastInterface[];
  type: 'blog' | 'podcast';
  users: { [key: string]: GetUser };
}

//data table for blogs and podcast
const BlogAndPodcastDataTable: React.FC<DataTableProps> = ({
  data,
  users,
  type,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showRefuseDialog, setShowRefuseDialog] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  
  const handleOnClickPreview = (id: string) => {
    router.push(`/preview/${type}/${id}`);
  };

  const publishBlog = async (id: string) => {
    try {
      const result = await serverPublishBlog(id);
      if (!result.ok) {
        throw new Error('Failed to publish blog');
      }
      GlobalNotifier('Blog published successfully', 'success');
      window.location.reload();
    } catch (err) {
      console.error('Error publishing blog:', err);
    }
  };

  const publishPodcast = async (id: string) => {
    try {
      const result = await serverPublishPodcast(id);
      if (!result.ok) {
        throw new Error('Failed to publish podcast');
      }
      GlobalNotifier('Podcast published successfully', 'success');
      window.location.reload();
    } catch (err) {
      console.error('Error publishing podcast:', err);
    }
  };

  const handlePublishClick = (id: string) => {
    if (type === 'blog') {
      publishBlog(id);
    } else {
      publishPodcast(id);
    }
  };

  const handleArchive = (id: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(id);
    setTitle(`Archive ${type}`);
    setDescription(`Are you sure you want to archive this ${type}`);
  };

  const handleRejection = (id: string) => {
    setShowRefuseDialog((prev) => !prev);
    setCurrentId(id);
    setDescription(
      `Please provide a reason for rejecting this ${type} publication`
    );
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-start w-[20%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Title
              </th>
              <th className="text-start w-[30%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Description
              </th>
              <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Posted By
              </th>
              <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Status
              </th>
              <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Created At
              </th>
              <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.length > 0 &&
              [...data].map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index === data.length - 1
                      ? 'rounded-b-[20px] overflow-hidden'
                      : ''
                  }
                >
                  <td className="text-start w-[20%] paragraph-xmedium-normal px-4 py-2 border-b">
                    {truncateText(row.title)}
                  </td>
                  <td className="text-start w-[40%] paragraph-xmedium-normal px-4 py-2 border-b">
                    {truncateText(row.description)}
                  </td>
                  <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-2 border-b">
                    {users[row.id] &&
                      users[row.id].firstName + ' ' + users[row.id].lastName}
                  </td>
                  <td className="text-start w-[1%] paragraph-xmedium-normal px-4 py-2 border-b">
                    <StatusTag status={row.status} />
                  </td>
                  <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-2 border-b">
                    {new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    }).format(new Date(row.createdAt))}
                  </td>
                  <td className="text-start w-[10%] paragraph-xmedium-normal px-4 py-2 border-b">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px]" align="end">
                        <DropdownMenuLabel className="paragraph-medium-medium">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOnClickPreview(row.id)}
                        >
                          <Eye /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePublishClick(row.id)}
                        >
                          <CheckCircle /> Publish
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          className=""
                          onClick={() => handleArchive(row.id)}
                        >
                          <Archive size={24} /> Archive
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => handleRejection(row.id)}
                          className="text-redTheme hover:text-redTheme"
                        >
                          <XCircle /> Decline publication
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <DeleteDialog
        id={currentId}
        title={title}
        type={type}
        description={description}
        action="delete"
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
      <RefuseDialog
        setShowDialog={setShowRefuseDialog}
        showDialog={showRefuseDialog}
        description={description}
        id={currentId}
        type={type}
      />
    </>
  );
};

export default BlogAndPodcastDataTable;
