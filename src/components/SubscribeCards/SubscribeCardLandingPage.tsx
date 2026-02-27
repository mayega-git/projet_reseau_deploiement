'use client';
import React, { useState } from 'react';
import CustomButton from '../ui/customButton';
import NewsletterSubscribeDialog from './NewsletterSubscribeDialog';

const SubscribeCardLandingPage = () => {
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mt-4 w-full max-w-[500px] flex flex-col sm:flex-row gap-2 sm:gap-0 paragraph-medium-normal rounded-2xl sm:rounded-full bg-inherit border border-grey-500 p-2 sm:p-0">
      <input
        type="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        id="email"
        placeholder="Email Address"
        className="px-[16px] py-[8px] outline-none bg-inherit w-full paragraph-medium-normal"
      />
      <CustomButton
        variant="secondary"
        round={false}
        className="sm:rounded-full w-full sm:w-auto"
        onClick={() => setDialogOpen(true)}
      >
        Subscribe
      </CustomButton>
      <NewsletterSubscribeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prefillEmail={email}
      />
    </div>
  );
};

export default SubscribeCardLandingPage;
