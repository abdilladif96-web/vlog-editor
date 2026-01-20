"use client";

import { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Type } from 'lucide-react';
import { useVideo } from '@/context/VideoContext';

export function VideoPreview() {
  const { videoState, togglePlay, setVideoState } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync video element with state
  useEffect(() => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.play().catch(() => {
            // Autoplay might be blocked
            console.log("Autoplay blocked or waiting for user interaction");
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoState.isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoState(prev => ({
        ...prev,
        currentTime: videoRef.current!.currentTime,
        duration: videoRef.current!.duration || 0
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-black relative">
      <div className="flex-1 flex items-center justify-center relative group cursor-pointer" onClick={togglePlay}>
        
        <video 
            ref={videoRef}
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            className="w-full h-full object-contain max-h-[calc(100vh-16rem)]"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => togglePlay()}
            loop
            playsInline
        />

        {/* Overlay controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <div className="h-1 bg-zinc-600 rounded-full mb-4 overflow-hidden cursor-pointer">
                <div 
                    className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                    style={{ width: `${(videoState.currentTime / (videoState.duration || 1)) * 100}%` }}
                ></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                    <SkipBack className="w-5 h-5 hover:text-blue-400 cursor-pointer" onClick={() => {
                        if(videoRef.current) videoRef.current.currentTime -= 5;
                    }} />
                    <button onClick={togglePlay}>
                        {videoState.isPlaying ? (
                            <Pause className="w-6 h-6 hover:text-blue-400 cursor-pointer fill-white" />
                        ) : (
                            <Play className="w-6 h-6 hover:text-blue-400 cursor-pointer fill-white" />
                        )}
                    </button>
                    <SkipForward className="w-5 h-5 hover:text-blue-400 cursor-pointer" onClick={() => {
                        if(videoRef.current) videoRef.current.currentTime += 5;
                    }} />
                    <span className="text-sm font-mono">
                        {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-white">
                    <Volume2 className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                </div>
            </div>
        </div>

        {/* Play overlay when paused */}
        {!videoState.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white ml-1 fill-white" />
                </div>
            </div>
        )}
      </div>

      {/* Edits Timeline / List */}
      {videoState.edits.length > 0 && (
          <div className="h-48 bg-zinc-900 border-t border-zinc-800 p-4 overflow-y-auto">
              <h3 className="text-white text-sm font-semibold mb-3">Applied Edits</h3>
              <div className="space-y-2">
                  {videoState.edits.map((edit) => (
                      <div key={edit.id} className="flex items-center gap-3 bg-zinc-800 p-2 rounded-md text-sm text-zinc-300">
                          {edit.type === 'cut' && <Scissors className="w-4 h-4 text-red-500" />}
                          {edit.type === 'caption' && <Type className="w-4 h-4 text-green-500" />}
                          <span>{edit.description}</span>
                          <span className="ml-auto text-xs text-zinc-500">{new Date(edit.timestamp).toLocaleTimeString()}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
