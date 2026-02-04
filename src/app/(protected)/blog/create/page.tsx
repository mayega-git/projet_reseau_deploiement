import CreateBlogComponent from '@/components/Blog/CreateBlogComponent';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import React from 'react';

const CreateBlog = () => {
  return (
    <div className="w-full flex flex-col justify-between">
      <HeaderWrapper />

      <div className="container create-blog-form-height">
        <CreateBlogComponent />
      </div>

      <Footer />
    </div>
  );
};

export default CreateBlog;
