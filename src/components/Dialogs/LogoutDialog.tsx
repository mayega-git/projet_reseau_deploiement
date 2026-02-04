'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';

interface LogoutProps {
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
}
const Logout: React.FC<LogoutProps> = ({ showLogout, setShowLogout }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {showLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
          <div className="flex flex-col gap-6 bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
            <div className="flex flex-col gap-1">
              <h2 className="paragraph-large-medium font-semibold">
                {' '}
                Confirm Logout
              </h2>
              <p className="text-small-paragraph text-black-300">
                Are you sure you want to log out? You will need to sign in
                again.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant={'secondary'}
                className="order rounded-md text-gray-700"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </Button>

              <Button
                className=" bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
