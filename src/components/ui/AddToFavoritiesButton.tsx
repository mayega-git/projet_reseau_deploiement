/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { ChartNoAxesColumn, Heart, Share } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { GlobalNotifier } from './GlobalNotifier';

interface AddToFavoritiesButtonProps {
  color?: string;
  entityType: string;
  entityId: string;
}
const AddToFavoritiesButton: React.FC<AddToFavoritiesButtonProps> = ({
  color,
  entityId,
  entityType,
}) => {
  const [favorites, setFavorites] = useState<number>(0);
  const [hasFavorite, setHasFavorite] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState([]);
  const { role } = useAuth();
  const { user } = useAuth();

  // const handleAddToFavorites = async () => {
  //   if (user)
  //     try {
  //       const url = new URL(`${EducationServiceRoutes.favoritess}/toggle`);
  //       url.searchParams.set('userId', user?.id);
  //       url.searchParams.set('entityId', entityId);
  //       url.searchParams.set('entityType', entityType);
  //       const response = await fetch(url.toString(), {
  //         method: 'POST',
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         GlobalNotifier('Post added to favorites', 'success');
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  // };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            // onClick={handleAddToFavorites}
            disabled={loading}
            aria-label={hasFavorite ? 'Unlike' : 'Like'}
            className={`flex items-center gap-1 rounded transition ${
              favorites
                ? 'text-red-500 scale-110'
                : `${
                    color ? `text-gray-white` : `text-gray-500 `
                  }hover:scale-[1.05]`
            }`}
          >
            {hasFavorite ? (
              <Heart fill="#ef4444" color="#ef4444" size={18} />
            ) : (
              <Heart size={18} />
            )}
            {favorites !== 0 && (
              <span className="content-interaction">
                {favoritesCount.length > 0 ? favoritesCount : null}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-[14px] paragraph-small-normal">Add to favorites</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddToFavoritiesButton;
