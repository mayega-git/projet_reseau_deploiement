/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagInterface } from '@/types/tag';
// Removed: EducationServiceRoutes import (migrated to server actions)
import { useState } from 'react';
import DeleteDialog from '@/components/Dialogs/DeleteDialog';

interface DataTableProps<TData> {
  // columns: ColumnDef<TData, TValue>[];
  data: TagInterface[];
  type: 'category' | 'tag';
}

//data table for tags and categories
export function DataTable<TData>({ data, type }: DataTableProps<TData>) {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentId, setCurrentId] = useState('');
  const handleClickDelete = async (id: string) => {
    setShowDialog((prev) => !prev);
    setCurrentId(id);
    setTitle(`Delete ${type}`);
    setDescription(`Are you sure you want to delete this ${type}`);
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-start w-[20%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Name
              </th>
              <th className="text-start w-[50%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Description
              </th>
              <th className="text-start w-[20%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Created At
              </th>
              <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index === data.length - 1
                    ? 'rounded-b-[20px] overflow-hidden'
                    : ''
                }
              >
                <td className="text-start w-[20%] paragraph-xmedium-normal px-4 py-2 border-b">
                  {row.name}
                </td>
                <td className="text-start w-[50%] paragraph-xmedium-normal px-4 py-2 border-b">
                  {row.description}
                </td>
                <td className="text-start w-[20%] paragraph-xmedium-normal px-4 py-2 border-b">
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
                      </Button>*/
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="paragraph-medium-medium">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => row.id}>
                        <Edit /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          handleClickDelete(row.id);
                        }}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
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
    </>
  );
}
