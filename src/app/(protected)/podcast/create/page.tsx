import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import CreatePodcastComponent from '@/components/Podcast/CreatePodcastComponent';
import React from 'react'

const CreatePodcast = () => {
  return (
    <div className="w-full flex flex-col justify-between">
      <HeaderWrapper />

      <div className="container create-blog-form-height">
        <CreatePodcastComponent />
      </div>

      <Footer />
    </div>
  );
}

export default CreatePodcast