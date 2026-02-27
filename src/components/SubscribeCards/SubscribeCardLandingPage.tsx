'use client';
import React, { useState } from 'react';
import CustomButton from '../ui/customButton';
import NewsletterSubscribeDialog from './NewsletterSubscribeDialog';

const SubscribeCardLandingPage = () => {
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mt-4 w-[500px] flex paragraph-medium-normal rounded-full bg-inherit border border-grey-500">
      <input
        type="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        id="landing-email"
        placeholder="Email Address"
        className="px-[16px] py-[8px] outline-none bg-inherit w-full paragraph-medium-normal"
      />
      <CustomButton
        variant="secondary"
        round
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
