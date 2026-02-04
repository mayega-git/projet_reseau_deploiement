'use client';
import { fetchPodcastImage } from '@/actions/blog';
import { useEffect, useState } from 'react';

export default function PodcastCoverImage({ podcastId }: { podcastId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const imageMap = await fetchPodcastImage(podcastId);
        
        const binaryData = imageMap[podcastId];

        if (binaryData && binaryData.length > 0) {
          const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
          currentUrl = URL.createObjectURL(blob);
          setImageUrl(currentUrl);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        console.error(`[PodcastCoverImage] Error for ${podcastId}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (podcastId) {
      loadImage();
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [podcastId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-full w-full rounded-lg">
        Chargement...
      </div>
    );
  }

  const hasNoImage = error || !imageUrl || imageUrl === 'null' || imageUrl === '';

  if (hasNoImage) {
    return (
      <img
        src="/Gemini_Blog_Default_Cover.png"
        alt="Image par défaut"
        className="object-cover w-full h-full rounded-lg"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Image de couverture"
      className="object-cover w-full h-full rounded-lg"
    />
  );
}
