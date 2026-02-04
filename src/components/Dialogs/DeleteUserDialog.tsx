// src/components/Dialogs/DeleteUserDialog.tsx
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
import { deleteUser } from '@/actions/user';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { Trash2 } from 'lucide-react';

interface DeleteUserDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  userId: string;
  userName: string;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  showDialog,
  setShowDialog,
  userId,
  userName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser(userId);
      GlobalNotifier('User deleted successfully', 'success');
      setShowDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      GlobalNotifier('Failed to delete user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-redTheme">
            <Trash2 />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{userName}</strong>?
            <br />
            <span className="text-redTheme font-medium">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;