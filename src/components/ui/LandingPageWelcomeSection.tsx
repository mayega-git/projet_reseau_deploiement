'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import '@/styles/background.css';
import SubscribeCardLandingPage from '../SubscribeCards/SubscribeCardLandingPage';
import { useAuth } from '@/context/AuthContext';
import { fetchLecteurByEmail, fetchRedacteurByEmail } from '@/actions/newsletter';

const LandingPageWelcomeSection = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkSubscription = async () => {
      if (!user?.sub) return;
      try {
        const [isLecteur, isRedacteur] = await Promise.all([
          fetchLecteurByEmail(user.sub),
          fetchRedacteurByEmail(user.sub)
        ]);
        
        if (isMounted && (isLecteur === true || isRedacteur === true)) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'abonnement :', err);
      }
    };

    checkSubscription();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isSubscribed) {
    return null;
  }

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