import CreateCourseComponent from '@/components/Course/CreateCourseComponent';
import Footer from '@/components/Footer';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import React from 'react';

const CreateCourse = () => {
  return (
    <div className="w-full flex flex-col justify-between">
      <HeaderWrapper />

      <div className="container create-blog-form-height">
        <CreateCourseComponent />
      </div>

      <Footer />
    </div>
  );
};

export default CreateCourse;