/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import CustomButton from './customButton';
import { LikeDislikeRequest } from '@/types/comment';
import {
  fetchDislikesCount,
  fetchLikesCount,
  hasDisliked as checkHasDisliked,
  hasLiked as checkHasLiked,
  likeOrDislike,
} from '@/actions/review';
import { useAuth } from '@/context/AuthContext';

interface LikeCountProps {
  entityId: string;
  entityType: string;
  color?: string;
}

const LikeDislikeButton: React.FC<LikeCountProps> = ({
  entityId,
  entityType,
  color,
}) => {
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { role } = useAuth();
  const { user } = useAuth();

   //const handleLike = async () => {
     //const LikeRequest: LikeDislikeRequest = {
       //userId: userId,
       //entityId: entityId,
       //entityType: entityType,
      // isLike: true,
     //};
     //await likeOrDislikeEntity(LikeRequest);
    //await fetchAllLikesAndDislikesForEntityId();
   //};

  // const handleDislike = async () => {
  //   const DisLikeRequest: LikeDislikeRequest = {
  //     userId: userId,
  //     entityId: entityId,
  //     entityType: entityType,
  //     isLike: false,
  //   };
  //   await likeOrDislikeEntity(DisLikeRequest);
  //   await fetchAllLikesAndDislikesForEntityId();
  // };

  const likeOrDislikeEntity = async (params: LikeDislikeRequest) => {
    try {
      await likeOrDislike(params);
    } catch (error) {
      console.error('Error making like/dislike request', error);
    }
  };

  const handleLikeDislike = async (isLike: boolean) => {
    if (user) {
      if (loading) return; // Prevent multiple clicks

      setLoading(true);

      // Optimistic update
      if (isLike) {
        setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
        setHasLiked((prev) => !prev);
        if (hasDisliked) {
          setDislikes((prev) => prev - 1);
          setHasDisliked(false);
        }
      } else {
        setDislikes((prev) => (hasDisliked ? prev - 1 : prev + 1));
        setHasDisliked((prev) => !prev);
        if (hasLiked) {
          setLikes((prev) => prev - 1);
          setHasLiked(false);
        }
      }

      try {
        const request: LikeDislikeRequest = {
          userId: user.id,
          entityId: entityId,
          entityType: entityType,
          isLike: isLike,
        };
        await likeOrDislikeEntity(request);
        await fetchAllLikesAndDislikesForEntityId(); // Refresh data
      } catch (error) {
        console.error('Error updating like/dislike:', error);
        // Revert optimistic update on error
        if (isLike) {
          setLikes((prev) => (hasLiked ? prev + 1 : prev - 1));
          setHasLiked((prev) => !prev);
          if (hasDisliked) {
            setDislikes((prev) => prev + 1);
            setHasDisliked(true);
          }
        } else {
          setDislikes((prev) => (hasDisliked ? prev + 1 : prev - 1));
          setHasDisliked((prev) => !prev);
          if (hasLiked) {
            setLikes((prev) => prev + 1);
            setHasLiked(true);
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      return null;
    }
  };

  const fetchAllLikesAndDislikesForEntityId = async () => {
    if (user) {
      try {
        const likes = await fetchLikesCount(entityId);
        const dislikes = await fetchDislikesCount(entityId);
        const hasLiked = await checkHasLiked(user.id, entityId);
        const hasDisliked = await checkHasDisliked(
          user.id,
          entityId
        );

        if (likes !== null) setLikes(likes);
        if (dislikes !== null) setDislikes(dislikes);
        if (hasLiked !== null) setHasLiked(hasLiked);
        if (hasDisliked !== null) setHasDisliked(hasDisliked);
      } catch (error) {
        console.error('Error fetching likes/dislikes:', error);
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    fetchAllLikesAndDislikesForEntityId();
  }, [entityId, user?.id]);

  return (
    <div className=" flex items-center gap-2  transition-colors">
      {/* Like Button */}
      <button
        onClick={() => handleLikeDislike(true)}
        disabled={loading}
        aria-label={hasLiked ? 'Unlike' : 'Like'}
        className={`flex items-center gap-1 rounded transition ${
          hasLiked
            ? 'text-[#5438CD] scale-110'
            : `${
                color ? `text-gray-white` : `text-gray-500 `
              }hover:scale-[1.05]`
        }`}
      >
        {hasLiked ? (
          <ThumbsUp fill="#5438CD" size={18} />
        ) : (
          <ThumbsUp size={18} />
        )}
        {likes !== 0 && (
          <span className="paragraph-medium-normal text-black-300">
            {likes}
          </span>
        )}
      </button>

      {/* Divider */}
      <span className="h-5 w-[2px] bg-gray-300"></span>

      {/* Dislike Button */}
      <button
        onClick={() => handleLikeDislike(false)}
        disabled={loading}
        aria-label={hasDisliked ? 'Remove Dislike' : 'Dislike'}
        className={`rounded transition ${
          hasDisliked
            ? 'text-red-500 scale-110'
            : `${
                color ? 'text-gray-white' : 'text-gray-500'
              } hover:scale-[1.05]`
        }`}
      >
        <ThumbsDown size={18} />
        {/* {dislikes !== 0 && role?.includes(R) && (
          <span className="paragraph-medium-normal text-black-300">
            {dislikes}
          </span>
        )} */}
      </button>
    </div>
  );
};

export default LikeDislikeButton;
