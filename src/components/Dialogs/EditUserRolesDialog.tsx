// src/components/Dialogs/EditUserRolesDialog.tsx
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { updateUserRoles } from '@/actions/user';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { AppRoles } from '@/constants/roles';

interface EditUserRolesDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  userId: string;
  userName: string;
  currentRoles: string[];
}

const AVAILABLE_ROLES = [
  { value: AppRoles.USER, label: 'User' },
  { value: AppRoles.AUTHOR, label: 'Author' },
  { value: AppRoles.ADMIN, label: 'Admin' },
  { value: AppRoles.ORGANISATION, label: 'Organisation' },
  { value: AppRoles.PENDING_ORGANISATION, label: 'Pending Organisation' },
];

const EditUserRolesDialog: React.FC<EditUserRolesDialogProps> = ({
  showDialog,
  setShowDialog,
  userId,
  userName,
  currentRoles,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      GlobalNotifier('Please select at least one role', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await updateUserRoles(userId, selectedRoles);
      GlobalNotifier('User roles updated successfully', 'success');
      setShowDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating roles:', error);
      GlobalNotifier('Failed to update user roles', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Roles</DialogTitle>
          <DialogDescription>
            Modify roles for <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {AVAILABLE_ROLES.map((role) => (
            <div key={role.value} className="flex items-center space-x-2">
              <Checkbox
                id={role.value}
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={() => handleRoleToggle(role.value)}
              />
              <label
                htmlFor={role.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Roles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserRolesDialog;