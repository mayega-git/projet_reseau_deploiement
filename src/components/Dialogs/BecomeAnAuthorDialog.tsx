'use client';
import React from 'react';
import { Button } from '../ui/button';
import { AppRoles } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import { assignRole } from '@/actions/user';

interface AuthorProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const BecomeAnAuthorDialog: React.FC<AuthorProps> = ({
  showDialog,
  setShowDialog,
}) => {
  const { user, refreshUser } = useAuth();

  const handleBecomeAnAuthor = async () => {
    if (!user) return;

    try {
      const data = await assignRole(user.id, AppRoles.AUTHOR);

      if (data) {
        GlobalNotifier(
          'Congratulations! You have successfully become an author',
          'success'
        );
        // Update the local user state with new roles
        refreshUser({
          ...user,
          roles: [...(user.roles ?? []), AppRoles.AUTHOR],
        });
      }
    } catch (err) {
      console.error('An error occurred', err);
      GlobalNotifier('Something went wrong. Please try again.', 'error');
    } finally {
      setShowDialog(false);
    }
  };

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
          <div className="flex flex-col gap-6 bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
            <div className="flex flex-col gap-1">
              <h2 className="paragraph-large-medium font-semibold">
                Become an Author
              </h2>
              <p className="text-small-paragraph text-black-300">
                By clicking below, you will be assigned the &quot;Author&quot;
                role and gain access to content creation.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant={'secondary'}
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>

              <Button variant={'gradientOrange'} onClick={handleBecomeAnAuthor}>
                Yes, Become an Author
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BecomeAnAuthorDialog;
