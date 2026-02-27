'use client';

import React, { useState } from 'react';
import { Search, X, UserPlus, Loader2 } from 'lucide-react';
import { getUserByEmail, addUserToOrganisation } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import UserAvatar from '@/components/UserAvatar';
import type { GetUser } from '@/types/User';
import { AppRoles } from '@/constants/roles';

interface SearchUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  onUserAdded: () => void;
}

const SearchUserDialog: React.FC<SearchUserDialogProps> = ({ isOpen, onClose, orgId, onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [foundUser, setFoundUser] = useState<GetUser | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSearching(true);
    setSearchAttempted(true);
    setFoundUser(null);

    try {
      const user = await getUserByEmail(email.trim());
      setFoundUser(user);
    } catch (error) {
      console.error('Error searching user:', error);
      GlobalNotifier('Failed to search user. Please try again.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = async () => {
    if (!foundUser) return;

    setIsAdding(true);
    try {
      await addUserToOrganisation(orgId, foundUser.id);
      GlobalNotifier('User added successfully to the organisation!', 'success');
      onUserAdded();
      
      // Reset state on success
      setEmail('');
      setFoundUser(null);
      setSearchAttempted(false);
      onClose();
    } catch (error) {
      console.error('Error adding user:', error);
      GlobalNotifier('Failed to add user to the organisation.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="User email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" disabled={isSearching || !email.trim()}>
              {isSearching ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
            </Button>
          </form>

          {/* Search Results */}
          <div>
            {isSearching && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-primaryPurple-500" size={24} />
              </div>
            )}

            {!isSearching && searchAttempted && !foundUser && (
              <div className="text-center py-4 text-gray-500">
                No user found with this email.
              </div>
            )}

            {!isSearching && foundUser && (
              <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      userId={foundUser.id}
                      fullName={`${foundUser.firstName} ${foundUser.lastName}`}
                      size="md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {foundUser.firstName} {foundUser.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{foundUser.email}</p>
                    </div>
                  </div>

                  {foundUser.roles?.includes(AppRoles.AUTHOR) ? (
                    <Button
                      onClick={handleAddUser}
                      disabled={isAdding}
                      className="flex items-center gap-2"
                    >
                      {isAdding ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <UserPlus size={16} /> Add
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="text-gray-400 border-gray-200">
                      Cannot Add
                    </Button>
                  )}
                </div>
                
                {!foundUser.roles?.includes(AppRoles.AUTHOR) && (
                  <p className="text-sm text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-100">
                    L'utilisateur associé à cet email n'est pas un auteur. Seuls les auteurs peuvent être ajoutés.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUserDialog;
