import React from 'react'
import Image from 'next/image';
import '@/styles/background.css';
import SubscribeCardLandingPage from '../SubscribeCards/SubscribeCardLandingPage';
const LandingPageWelcomeSection = () => {
  return (
    <section className="background-container">
      <div className="background-overlay" />
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        sizes="100vw"
        className="background-image"
        priority
      />
      <div className="text-overlay container">
        <h1 className="h2-bold sm:text-h1 sm:leading-48">
          The LetsGo Blog & Podcast
        </h1>
        <p className="paragraph-medium-normal sm:text-paragraph-large sm:leading-28">
          Welcome to the Let’s Go Blog and Podcast – your source for tips,
          stories, and insights across Cameroon! From travel advice to inspiring
          local stories, we’ve got what you need to stay informed and inspired.
          Subscribe now to get the latest updates delivered right to you!
        </p>
        <SubscribeCardLandingPage />
      </div>
    </section>
  );
}

export default LandingPageWelcomeSection
