'use client';
import { fetchBlogImage } from '@/actions/blog';
import { useEffect, useRef, useState } from 'react';

const imageCache = new Map<string, string | null>();

export default function BlogCoverImage({ blogId }: { blogId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !blogId) return;

    let currentUrl: string | null = null;

    const loadImage = async () => {
      const cachedUrl = imageCache.get(blogId);
      if (cachedUrl !== undefined) {
        setImageUrl(cachedUrl);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        const imageMap = await fetchBlogImage(blogId);
        const binaryData = imageMap[blogId];

        if (binaryData && binaryData.length > 0) {
          const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
          currentUrl = URL.createObjectURL(blob);
          imageCache.set(blogId, currentUrl);
          setImageUrl(currentUrl);
        } else {
          imageCache.set(blogId, null);
          setImageUrl(null);
        }
      } catch (err) {
        imageCache.set(blogId, null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      currentUrl = null;
    };
  }, [blogId, isVisible]);

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="h-full w-full animate-pulse rounded-lg bg-gray-100"
      >
        <span className="sr-only">Loading image</span>
      </div>
    );
  }

  const hasNoImage = error || !imageUrl || imageUrl === 'null' || imageUrl === '';

  if (hasNoImage) {
    return (
      <div ref={containerRef} className="h-full w-full">
        <img
          src="/Gemini_Blog_Default_Cover.png"
          alt="Image par défaut"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <img
        src={imageUrl}
        alt="Image de couverture"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
