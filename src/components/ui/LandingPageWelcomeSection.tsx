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
        width={100}
        height={'0'}
        className="background-image"
      />
      <div className="text-overlay container">
        <h1 className="h1-bold">The LetsGo Blog & Podcast</h1>
        <p className="paragraph-large-normal">
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