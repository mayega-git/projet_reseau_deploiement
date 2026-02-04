/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  fetchBlogAudio,
  fetchPodcastAudio,
} from '@/actions/blog';
import React, { useCallback, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import LoaderBlack from '../Loader/LoaderBlack';

interface AudioPlayerContentProps {
  id: string;
  type: 'blog' | 'podcast';
}
const AudioPlayerContent: React.FC<AudioPlayerContentProps> = ({
  id,
  type,
}) => {
  const [audioSrc, setAudioSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioData = useCallback(
    async (audioId: string) => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const fetchAudio = type === 'blog' ? fetchBlogAudio : fetchPodcastAudio;
        const audio = await fetchAudio(audioId); // Fetch the audio data (number[])

        // Extract the audio data for the specific ID
        const currentAudio: number[] = audio[audioId];

        // Convert the number array into a typed array of bytes (Uint8Array)
        const byteArray = new Uint8Array(currentAudio);

        // Create a Blob from the byte array, specifying the correct MIME type for the audio
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });

        // Create an Object URL from the Blob
        const audioUrl = URL.createObjectURL(blob);

        setAudioSrc(audioUrl); // Set the audio URL to the state
      } catch (err) {
        setError('Failed to load audio.'); // Error handling
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    },
    [type]
  );

  useEffect(() => {
    if (id) {
      fetchAudioData(id); // Fetch audio when component mounts
    }

    return () => {
      // Cleanup the audio URL when component unmounts
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [id]);

  return (
    <div className="audio-player-container">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoaderBlack />
          <p className="text-black-300 paragraph-small-normal">
            Loading audio...
          </p>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        audioSrc && (
          <div className="flex flex-col gap-2">
            <audio controls>
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p className="paragraph-small-normal font-medium text-black-500">
              Audio:{' '}
              <span className="text-black-300 font-normal">
                Listen to this {type}
              </span>
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default AudioPlayerContent;
