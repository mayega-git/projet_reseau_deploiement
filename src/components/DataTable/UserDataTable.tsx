// src/components/DataTable/UserDataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AppRoles } from '@/constants/roles';
import EditUserRolesDialog from '@/components/Dialogs/EditUserRolesDialog';
import DeleteUserDialog from '@/components/Dialogs/DeleteUserDialog';
import type { UserWithBlogCount } from '@/types/User';

interface UserDataTableProps {
  data: UserWithBlogCount[];
}

const UserDataTable: React.FC<UserDataTableProps> = ({ data }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithBlogCount | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Filtrer les users
  const filteredData = useMemo(() => {
    // Exclure les SUPER_ADMIN
    let filtered = data.filter((user) => {
      if (!user.roles || !Array.isArray(user.roles)) {
        console.warn('User without valid roles:', user);
        return false;
      }
      return !user.roles.includes(AppRoles.SUPER_ADMIN);
    });

    // Filtrer par rôle si sélectionné
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user) => user.roles.includes(roleFilter));
    }

    return filtered;
  }, [data, roleFilter]);

  const handleEditRoles = (user: UserWithBlogCount) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDelete = (user: UserWithBlogCount) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const formatRoles = (roles: string[]) => {
    return roles
      .map((role) => role.replace('ROLE_', ''))
      .join(', ');
  };

  const renderActions = (user: UserWithBlogCount) => (
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
        <DropdownMenuItem onClick={() => handleEditRoles(user)}>
          <Edit /> Edit Roles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(user)}
          className="text-redTheme hover:text-redTheme"
        >
          <Trash2 /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Filtre par rôle */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium">Filter by role:</label>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value={AppRoles.USER}>User</SelectItem>
            <SelectItem value={AppRoles.AUTHOR}>Author</SelectItem>
            <SelectItem value={AppRoles.ADMIN}>Admin</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          ({filteredData.length} user{filteredData.length !== 1 ? 's' : ''})
        </span>
      </div>

      {/* Tableau / cartes */}
      <div className="rounded-md border bg-white">
        <div className="md:hidden divide-y">
          {filteredData.length > 0 ? (
            filteredData.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="paragraph-small-normal text-black-300">Email</p>
                    <p className="paragraph-medium-medium break-words">
                      {user.email}
                    </p>
                  </div>
                  {renderActions(user)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="paragraph-small-normal text-black-300">
                    {user.firstName}
                  </span>
                  <span className="paragraph-small-normal text-black-300">
                    {user.lastName}
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {formatRoles(user.roles)}
                </span>
                <p className="paragraph-small-normal text-black-300">
                  Blogs count: {user.blogCount !== undefined ? user.blogCount : 'N/A'}
                </p>
              </div>
            ))
          ) : (
            <p className="px-4 py-8 text-center text-gray-500">No users found</p>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-start w-[25%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Email
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  First Name
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Last Name
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Roles
                </th>
                <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Blogs Count
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Created At
                </th>
                <th className="text-start w-[5%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user, index) => (
                  <tr
                    key={user.id}
                    className={
                      index === filteredData.length - 1
                        ? 'rounded-b-[20px] overflow-hidden'
                        : ''
                    }
                  >
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      {user.email}
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      {user.firstName}
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      {user.lastName}
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatRoles(user.roles)}
                      </span>
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      {user.blogCount !== undefined ? user.blogCount : 'N/A'}
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      N/A
                    </td>
                    <td className="text-start paragraph-xmedium-normal px-4 py-2 border-b">
                      {renderActions(user)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      {selectedUser && (
        <>
          <EditUserRolesDialog
            showDialog={showEditDialog}
            setShowDialog={setShowEditDialog}
            userId={selectedUser.id}
            userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
            currentRoles={selectedUser.roles}    
          />
          <DeleteUserDialog
            showDialog={showDeleteDialog}
            setShowDialog={setShowDeleteDialog}
            userId={selectedUser.id}
            userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
          />
        </>
      )}
    </>
  );
};

export default UserDataTable;
