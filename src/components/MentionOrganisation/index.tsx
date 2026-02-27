'use client';
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '@/actions/user';
import { GetUser } from '@/types/User';
import UserAvatar from '../UserAvatar';

interface MentionOrganisationProps {
  organisationId: string;
}

const MentionOrganisation: React.FC<MentionOrganisationProps> = ({ organisationId }) => {
  const [organisation, setOrganisation] = useState<GetUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const data = await fetchUserData(organisationId);
        if (data) setOrganisation(data);
      } catch (error) {
        console.error('Error fetching organisation data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (organisationId) {
      fetchOrg();
    }
  }, [organisationId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-[46px] w-[46px] bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (!organisation) return null;

  return (
    <div className="flex items-center gap-3">
      <UserAvatar
        userId={organisation.id}
        fullName={organisation.firstName || 'Organisation'}
        size="md"
      />
      <div>
        <p className="paragraph-medium-medium text-black-500">
          {organisation.firstName || 'Organisation'}
        </p>
      </div>
    </div>
  );
};

export default MentionOrganisation;
