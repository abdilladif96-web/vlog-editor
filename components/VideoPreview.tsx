"use client";

import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Type } from 'lucide-react';
import { useVideo } from '@/context/VideoContext';

export function VideoPreview() {
  const { videoState, togglePlay } = useVideo();

  return (
    <div className="flex-1 flex flex-col bg-black relative">
      <div className="flex-1 flex items-center justify-center relative group cursor-pointer" onClick={togglePlay}>
        {/* Placeholder for actual video element */}
        <div className="text-zinc-500 flex flex-col items-center gap-4">
           <div className={`w-24 h-24 rounded-full border-2 border-zinc-700 flex items-center justify-center transition-all ${videoState.isPlaying ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
             {videoState.isPlaying ? (
                <Pause className="w-10 h-10 fill-zinc-700" />
             ) : (
                <Play className="w-10 h-10 ml-1 fill-zinc-700" />
             )}
           </div>
           <p>{videoState.isPlaying ? 'Playing Preview...' : 'Video Paused'}</p>
        </div>
        
        {/* Overlay controls (mock) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <div className="h-1 bg-zinc-600 rounded-full mb-4 overflow-hidden cursor-pointer">
                <div className="h-full w-1/3 bg-blue-500"></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                    <SkipBack className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                    <button onClick={togglePlay}>
                        {videoState.isPlaying ? (
                            <Pause className="w-6 h-6 hover:text-blue-400 cursor-pointer fill-white" />
                        ) : (
                            <Play className="w-6 h-6 hover:text-blue-400 cursor-pointer fill-white" />
                        )}
                    </button>
                    <SkipForward className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                    <span className="text-sm font-mono">00:00 / 00:00</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                    <Volume2 className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                </div>
            </div>
        </div>
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
