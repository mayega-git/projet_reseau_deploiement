import CreateNewsLetterComponents from '@/components/NewsLetter/CreateNewsLetterComponents';
import RedacteurAccessGuard from '@/components/NewsLetter/RedacteurAccesGuard';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import NavTabsNewsLetter from '@/components/Navigation/NavTabsNewsLetter';
import React from 'react';

const CreateNewsletterPage = () => {
  return (
    <RedacteurAccessGuard>
      <div className="w-full flex flex-col justify-between min-h-screen">
        <HeaderWrapper />
        <NavTabsNewsLetter />
        <div className="container create-blog-form-height py-6">
          <CreateNewsLetterComponents />
        </div>
        <Footer />
      </div>
    </RedacteurAccessGuard>
  );
};

export default CreateNewsletterPage;