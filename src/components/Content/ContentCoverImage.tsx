'use client';
import { getContentConfig } from '@/lib/contentConfig';
import { ContentType } from '@/types/content';
import { useEffect, useState } from 'react';

interface ContentCoverImageProps {
  itemId: string;
  contentType: ContentType;
}

export default function ContentCoverImage({
  itemId,
  contentType,
}: ContentCoverImageProps) {
  const config = getContentConfig(contentType);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const imageMap = await config.fetchImage(itemId);

        const binaryData = imageMap[itemId];

        if (binaryData && binaryData.length > 0) {
          const blob = new Blob([new Uint8Array(binaryData)], {
            type: 'image/jpeg',
          });
          currentUrl = URL.createObjectURL(blob);
          setImageUrl(currentUrl);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        console.error(
          `[ContentCoverImage] Error for ${contentType} ${itemId}:`,
          err
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      loadImage();
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [itemId, contentType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-full w-full rounded-lg">
        Chargement...
      </div>
    );
  }

  const hasNoImage =
    error || !imageUrl || imageUrl === 'null' || imageUrl === '';

  if (hasNoImage) {
    return (
      <img
        src={config.defaultFallbackImage}
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
