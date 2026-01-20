"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface EditAction {
  id: string;
  type: 'trim' | 'cut' | 'caption' | 'filter' | 'music';
  description: string;
  timestamp: number;
}

interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  seekRequest: number | null; // Timestamp to seek to, null if handled
  duration: number;
  videoUrl: string | null;
  edits: EditAction[];
}

interface VideoContextType {
  videoState: VideoState;
  setVideoState: (state: VideoState | ((prev: VideoState) => VideoState)) => void;
  addEdit: (edit: Omit<EditAction, 'id' | 'timestamp'>) => void;
  togglePlay: (shouldPlay?: boolean) => void;
  seekTo: (time: number) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    seekRequest: null,
    duration: 0,
    videoUrl: null,
    edits: [],
  });

  const addEdit = (edit: Omit<EditAction, 'id' | 'timestamp'>) => {
    const newEdit: EditAction = {
      ...edit,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setVideoState((prev) => ({
      ...prev,
      edits: [...prev.edits, newEdit],
    }));
  };

  const togglePlay = (shouldPlay?: boolean) => {
    setVideoState((prev) => ({ 
        ...prev, 
        isPlaying: shouldPlay !== undefined ? shouldPlay : !prev.isPlaying 
    }));
  };

  const seekTo = (time: number) => {
    setVideoState((prev) => ({
        ...prev,
        seekRequest: time,
        // Optional: auto-play after seek? Let's keep existing state
    }));
  };

  return (
    <VideoContext.Provider value={{ videoState, setVideoState, addEdit, togglePlay, seekTo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
