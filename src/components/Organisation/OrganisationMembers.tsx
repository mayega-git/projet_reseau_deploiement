'use client';

import React, { useState, useEffect } from 'react';
import { getOrganisationMembers, deleteUserFromOrganisation } from '@/actions/user';
import type { GetUser } from '@/types/User';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus, Loader2 } from 'lucide-react';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import SearchUserDialog from '@/components/Dialogs/SearchUserDialog';

interface OrganisationMembersProps {
  orgId: string;
  isOwner: boolean;
}

const OrganisationMembers: React.FC<OrganisationMembersProps> = ({ orgId, isOwner }) => {
  const [members, setMembers] = useState<GetUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getOrganisationMembers(orgId);
      setMembers(data || []);
    } catch (error) {
      console.error('Failed to fetch organisation members', error);
      GlobalNotifier('Failed to load organisation members', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [orgId]);

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    setRemovingUserId(userId);
    try {
      await deleteUserFromOrganisation(orgId, userId);
      GlobalNotifier('Member removed successfully', 'success');
      // Refresh the list
      await fetchMembers();
    } catch (error) {
      console.error('Failed to remove member', error);
      GlobalNotifier('Failed to remove member', 'error');
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Organisation Members ({(members && members.length) || 0})</h2>
        {isOwner && (
          <Button
            onClick={() => setIsSearchDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} /> Add Member
          </Button>
        )}
      </div>

      <SearchUserDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        orgId={orgId}
        onUserAdded={fetchMembers}
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-primaryPurple-500" size={32} />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          No members found in this organisation.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <UserAvatar
                  userId={member.id}
                  fullName={`${member.firstName} ${member.lastName}`}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>

              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={removingUserId === member.id}
                  title="Remove member"
                >
                  {removingUserId === member.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganisationMembers;
