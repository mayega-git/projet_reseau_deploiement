import React from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import EmptyState from '@/components/EmptyState/EmptyState';
import { EducationRoutes } from '@/lib/server/services';
import { TagInterface } from '@/types/tag';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable/DataTable';

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

import { fetchAllCategories as fetchAllCategoriesAction } from '@/actions/education';

async function fetchAllCategories(): Promise<TagInterface[]> {
  try {
    return (await fetchAllCategoriesAction()) as TagInterface[];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export default async function ManageCategories() {
  // Server Action
  async function create() {
    'use server';
    revalidateTag('categories', { expire: 0 });
    // Mutate data
  }
  const categories = await fetchAllCategories();
  // console.log(categories);

  return categories.length > 0 ? (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Categories"
          subtitle="Create, update and delete categories"
        />
        <div className="flex justify-end">
          <CreateDialogWrapperCategories />
        </div>
        <DataTable type="category" data={categories} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-8">
      <EmptyState />
      <CreateDialogWrapperCategories />
    </div>
  );
}
