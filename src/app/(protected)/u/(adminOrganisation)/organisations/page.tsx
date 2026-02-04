/* eslint-disable @typescript-eslint/no-unused-vars */
import DisplayOrg from '@/components/Organization/DisplayOrg';
import { Button } from '@/components/ui/button';
import CustomButton from '@/components/ui/customButton';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { fetchAllOrganisations } from '@/lib/fetchers/organisation';
import { GetOrganisation } from '@/types/organisation';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Organisations = async () => {
  const organizationData: GetOrganisation[] = await fetchAllOrganisations();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Your Organisation"
          subtitle="Create, Edit, and Manage Your Organisation's Information"
        />
      </div>

      <div className="flex w-full justify-end">
        <Link href={'/become-an-organisation'}>
          <Button variant="gradientOrange">
            <Plus />
            Add new organisation
          </Button>
        </Link>
      </div>

      <DisplayOrg organizationData={organizationData} />
    </div>
  );
};

export default Organisations;
