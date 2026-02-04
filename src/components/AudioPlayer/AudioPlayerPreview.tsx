/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

// Function to convert base64 to a File object
const base64ToFile = (base64: string, filename: string, mimeType: string) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
};

interface AudioPlayerProps {
  data: string;
  type : string
}

const AudioPlayerPreview: React.FC<AudioPlayerProps> = ({ data , type}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      // Convert base64 to File and create an object URL
      const file = base64ToFile(data, 'audio.mp3', 'audio/mpeg');
      const url = URL.createObjectURL(file);
      console.log(url);
      setAudioUrl(url);

      // Clean up the URL when the component is unmounted
      return () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl); // Cleanup the object URL
        }
      };
    }
  }, [data]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load(); // Ensure the audio is reloaded with the new URL
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return data && audioUrl ? (
    <div className="flex flex-col gap-2">
      {/* <div className="border-t border-b w-full py-2 border-grey-50">
        <div className="w-[85%] flex items-center justify-between py-4 px-6 bg-white rounded-md"> */}
          {/* <button onClick={togglePlayPause} className="text-black-500">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button> */}
          {/* <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-[80%] rounded-none h-[2px]"
          /> */}
          {/* <p className="text-sm flex paragraph-small-medium text-black-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p> */}
          <audio ref={audioRef} controls>
            <source src={audioUrl} />
            Your browser does not support the audio element.
          </audio>
          <div>
            
          </div>
          {/* <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          /> */}
        {/* </div>
      </div> */}
      <p className="paragraph-small-normal font-medium text-black-500">
        Audio:{' '}
        <span className="text-black-300 font-normal">Listen to this {type}</span>
      </p>
    </div>
  ) : null;
};

export default AudioPlayerPreview;
