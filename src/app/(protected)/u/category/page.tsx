import React from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense } from 'react';
import EmptyState from '@/components/EmptyState/EmptyState';
import { EducationRoutes } from '@/lib/server/services';
import { authFetchJson } from '@/lib/server/auth-fetch';
import { TagInterface } from '@/types/tag';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable/DataTableDisplay';

import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateDialogWrapperCategories from '@/components/Categories/CreateDialogWrapperCategories';
import { revalidateTag } from 'next/cache';

async function fetchAllCategories(): Promise<TagInterface[]> {
  try {
    const categories = await authFetchJson<TagInterface[]>(`${EducationRoutes.category}`, {
      method: 'GET',
      next: { tags: ['categories'] }, // Caches for 60 seconds for better performance
    });

    return categories || [];
  } catch (err) {
    console.error('Error fetching tags:', err);
    return []; // Return an empty array to avoid blocking
  }
}

export default async function ManageCategories() {
  // Server Action
  async function create() {
    'use server';
    revalidateTag('categories');
    // Mutate data
  }
  const categories = await fetchAllCategories();
  // console.log(categories);

  return categories.length > 0 ? (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Categories"
          subtitle="view all categories"
        />
       
        <DataTable type="category" data={categories} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-8">
      <EmptyState />
    </div>
  );
}
