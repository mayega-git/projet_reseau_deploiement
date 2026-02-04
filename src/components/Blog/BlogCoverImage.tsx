'use client';
import { fetchBlogImage } from '@/actions/blog';
import { useEffect, useState } from 'react';

export default function BlogCoverImage({ blogId }: { blogId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const imageMap = await fetchBlogImage(blogId);
        
        // Log the raw result to debug
        console.log(`[BlogCoverImage] Data for ${blogId}:`, imageMap);

        const binaryData = imageMap[blogId];

        if (binaryData && binaryData.length > 0) {
          const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/jpeg' });
          currentUrl = URL.createObjectURL(blob);
          setImageUrl(currentUrl);
        } else {
          console.warn(`[BlogCoverImage] No binary data for ${blogId}`);
          setImageUrl(null);
        }
      } catch (err) {
        console.error(`[BlogCoverImage] Error for ${blogId}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      loadImage();
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ width: 900, height: 250 }}>
        Chargement...
      </div>
    );
  }

  // More robust check for "no image"
  const hasNoImage = error || !imageUrl || imageUrl === 'null' || imageUrl === '';

  if (hasNoImage) {
    console.log(`[BlogCoverImage] Rendering fallback for ${blogId}. imageUrl:`, imageUrl);
    return (
      <img
        src="/Gemini_Blog_Default_Cover.png"
        alt="Image par défaut"
        className="object-cover"
        style={{ width: 900, height: 300 }}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Image de couverture"
      className="object-cover"
      style={{ width: 900, height: 250 }}
    />
  );
}