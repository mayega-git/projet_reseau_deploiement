'use client';
import React, { useState } from 'react';
import '@/styles/background.css';
import Image from 'next/image';
import Button from './customButton';
import NewsletterSubscribeDialog from '@/components/SubscribeCards/NewsletterSubscribeDialog';
const SubscribeCard = () => {
  const [email, setEmail] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full mx-auto min-h-[320px] h-auto">
      {' '}
      {/* background-overlay */}
      <section className="background-container rounded-[24px]">
        <div className="background-overlay rounded-[24px]" />
        <Image
          src="/images/background.png"
          alt="Background"
          width={100}
          height={'0'}
          className="background-image rounded-[24px]"
        />
        <div className="text-overlay container rounded-[24px]">
          <p className="h5-medium sm:text-h4 sm:leading-36">
            Subscribe to our newsletter
          </p>
          <p className="paragraph-medium-normal sm:text-paragraph-large sm:leading-28">
            Enter your email to get original stories, travel tips and insights
            across Cameroon
          </p>

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
            <Button
              variant="secondary"
              round={false}
              className="sm:rounded-full w-full sm:w-auto"
              onClick={() => setDialogOpen(true)}
            >
              Subscribe
            </Button>
          </div>
          <p className="content-date">
            You can unsubscribe at any time. Learn more about our{' '}
            <span className="text-primaryPurple-500">Privacy Policy</span>
          </p>
        </div>
      </section>
      <NewsletterSubscribeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prefillEmail={email}
      />
    </div>
  );
};

export default SubscribeCard;
