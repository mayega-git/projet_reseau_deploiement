/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import EmptyState from '@/components/EmptyState/EmptyState';
import NewsletterDataTable from '@/components/DataTable/NewsletterDataTable';
import { fetchNewslettersByStatus } from '@/lib/fetchers/newsletter';

const ManageNewsletters = async () => {
  // Fetch newsletters that need admin action:
  // - SOUMISE: submitted, waiting for validation
  // - VALIDEE: validated, waiting to be published
  const [soumises, validees] = await Promise.all([
    fetchNewslettersByStatus('SOUMISE'),
    fetchNewslettersByStatus('VALIDEE'),
  ]);

  const newsletters = [...soumises, ...validees];

  if (!newsletters || newsletters.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <SidebarPageHeading
          title="Manage Newsletters"
          subtitle="Validate, reject and publish newsletters."
        />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <SidebarPageHeading
        title="Manage Newsletters"
        subtitle="Validate, reject and publish newsletters."
      />
      <NewsletterDataTable data={newsletters} variant="admin" />
    </div>
  );
};

export default ManageNewsletters;
