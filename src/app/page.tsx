// src/app/page.tsx

// ✅ 'use client' = tout ce fichier s'exécute dans le navigateur
'use client';

import { useEffect, useState } from 'react';
import { getAllBlogs } from '@/actions/blog';
import BlogPage from '@/components/Blog/HomePage';
import EmptyState from '@/components/EmptyState/EmptyState';
import Header1 from '@/components/Header/Header1';
import Footer from '@/components/Footer';
import LandingPageWelcomeSection from '@/components/ui/LandingPageWelcomeSection';
import NavTabsMain from '@/components/Navigation/NavTabsMain';
import PublicRoute from '@/components/Routes/PublicRoute';
import { BlogInterface } from '@/types/blog'; 

function BlogFeed() {  // ← Plus de "async" ici
  
  // useState = boîte pour stocker des données
  // Au début, vide : []
  const [allBlogData, setAllBlogData] = useState<BlogInterface[]>([]);
  
  //  useState pour savoir si on charge encore
  const [isLoading, setIsLoading] = useState(true);

  //  useEffect = "Fais ça APRÈS l'affichage du composant"
  useEffect(() => {
    console.log('🔵 [BlogFeed] chargeement les blogs');
    
    // Fonction asynchrone pour charger les blogs
    async function loadBlogs() {
      try {
        //  Cette ligne s'exécute DANS LE NAVIGATEUR
        // APRÈS que AuthInitializer ait obtenu le token
        const data = await getAllBlogs('PUBLISHED');
        
        console.log('[BlogFeed] Blogs reçus:', data?.length || 0);
        
        // Mettre les données dans la boîte
        setAllBlogData(data || []);
        
      } catch (err) {
        console.error('❌ [BlogFeed] Erreur:', err);
      } finally {
        //  Dire qu'on a fini de charger
        setIsLoading(false);
      }
    }

    // Lancer le chargement
    loadBlogs();
    
  }, []); // ← [] = faire ça UNE SEULE FOIS au montage

  // Pendant le chargement, afficher "Loading..."
  if (isLoading) {
    return <div className="container">Loading blogs...</div>;
  }

  //  Si pas de blogs, afficher EmptyState
  if (!allBlogData || allBlogData.length === 0) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }

  //  Sinon, afficher les blogs
  return <BlogPage data={allBlogData} />;
}

export default function Home() {
  return (
    <PublicRoute>
      <Header1 />
      <main className="min-h-screen">
        <LandingPageWelcomeSection />
        <div className="min-h-screen flex flex-col gap-10">
          <NavTabsMain />
          <BlogFeed />  {/* ← Plus besoin de Suspense */}
        </div>
      </main>
      <Footer />
    </PublicRoute>
  );
}