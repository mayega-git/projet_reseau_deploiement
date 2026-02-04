/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './Loader.css';

interface LoaderProps {
  color?: string;
}
const Loader : React.FC<LoaderProps>= ({color}) => {
  // const loaderColor = color === 'colored' ? '#606060' : "#fff";
  return (
    <div className="loader">
      <div className="bar1"></div>
      <div className="bar2"></div>
      <div className="bar3"></div>
      <div className="bar4"></div>
      <div className="bar5"></div>
      <div className="bar6"></div>
      <div className="bar7"></div>
      <div className="bar8"></div>
      <div className="bar9"></div>
      <div className="bar10"></div>
      <div className="bar11"></div>
      <div className="bar12"></div>
      <p></p>
    </div>
  );
};

export default Loader;
