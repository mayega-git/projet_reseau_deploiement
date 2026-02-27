import BlogPage from '@/components/Blog/HomePage';
import EmptyState from '@/components/EmptyState/EmptyState';
import Header1 from '@/components/Header/Header1';
import Footer from '@/components/Footer';
import LandingPageWelcomeSection from '@/components/ui/LandingPageWelcomeSection';
import NavTabsMain from '@/components/Navigation/NavTabsMain';
import { getAllBlogs } from '@/lib/fetchers/blog';
import { Suspense } from 'react';

async function BlogFeed() {
  const allBlogData = await getAllBlogs('PUBLISHED');

  if (!allBlogData || allBlogData.length === 0) {
    return <EmptyState />;
  }

  return <BlogPage data={allBlogData} />;
}

export default async function Home() {
  return (
    <>
      <Header1 />
      <main className="min-h-screen">
        <LandingPageWelcomeSection />
        <div className="min-h-screen flex flex-col gap-10">
          <NavTabsMain />
          <Suspense fallback={<div className="container">Loading blogs...</div>}>
            <BlogFeed />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
