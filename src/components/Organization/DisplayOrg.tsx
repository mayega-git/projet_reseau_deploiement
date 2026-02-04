/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { GetOrganisation } from '@/types/organisation';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import CreateNewAuthor from '../Dialogs/CreateNewAuthor';

interface DisplayOrgProps {
  organizationData: GetOrganisation[];
}

const DisplayOrg: React.FC<DisplayOrgProps> = ({ organizationData }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const handleShowDialog = (id: string) => {
    setCurrentId(id);
    setShowDialog((prev) => !prev);
  };
  return (
    <div>
      {' '}
      {organizationData.map((org) => (
        <div key={org.organisationId} className="flex flex-col gap-4">
          <div className="p-6 border rounded-lg shadow-md">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center space-x-4">
                {org.logoUrl && (
                  <Image
                    src={org.logoUrl}
                    width={200}
                    height={70}
                    alt={`${org.shortName} logo`}
                    className=" object-contain"
                  />
                )}
                <div>
                  <h6 className=" font-bold">{org.longName}</h6>
                  <p className="text-gray-600">{org.shortName}</p>
                </div>
              </div>

              <Button
                onClick={() => handleShowDialog(org.organisationId)}
                size={'sm'}
              >
                Create employees
              </Button>
            </div>
            <p className="mt-4 text-gray-700">{org.description}</p>
            <div className="mt-4">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  org.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {org.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {org.businessDomain}
              </span>
            </div>
          </div>
        </div>
      ))}
      <CreateNewAuthor
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        orgId={currentId}
      />
    </div>
  );
};

export default DisplayOrg;
