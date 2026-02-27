'use client';
import { fetchPodcastImage } from '@/actions/blog';
import { useEffect, useRef, useState } from 'react';

const imageCache = new Map<string, string | null>();

export default function PodcastCoverImage({ podcastId }: { podcastId: string }) {
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
    if (!isVisible || !podcastId) return;

    let currentUrl: string | null = null;

    const loadImage = async () => {
      const cachedUrl = imageCache.get(podcastId);
      if (cachedUrl !== undefined) {
        setImageUrl(cachedUrl);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        const imageMap = await fetchPodcastImage(podcastId);
        const binaryData = imageMap[podcastId];

        if (binaryData && binaryData.length > 0) {
          const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
          currentUrl = URL.createObjectURL(blob);
          imageCache.set(podcastId, currentUrl);
          setImageUrl(currentUrl);
        } else {
          imageCache.set(podcastId, null);
          setImageUrl(null);
        }
      } catch (err) {
        imageCache.set(podcastId, null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      currentUrl = null;
    };
  }, [isVisible, podcastId]);

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
          className="object-cover w-full h-full rounded-lg"
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
        className="object-cover w-full h-full rounded-lg"
        loading="lazy"
      />
    </div>
  );
}
