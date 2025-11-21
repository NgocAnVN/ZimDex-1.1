
import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc, ListMusic, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Song {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

interface MusicAppProps {
  isPlaying: boolean;
  currentSong: Song;
  playlist: Song[];
  onTogglePlay: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
  onPlay: (index: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  isPlaying,
  currentSong,
  playlist,
  onTogglePlay,
  onNext,
  onPrev,
  onPlay,
  currentTime,
  duration,
  onSeek
}) => {
  // Scroll active song into view
  const activeSongRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeSongRef.current) {
        activeSongRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSong]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      onSeek(percentage * duration);
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Left: Visuals / Now Playing */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px]"
        />
        
        {/* Vinyl Record Animation */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 group cursor-pointer" onClick={onTogglePlay}>
            {/* The Vinyl Disc */}
            <motion.div 
              className="w-full h-full rounded-full bg-[#0f0f0f] border-4 border-[#1a1a1a] shadow-2xl flex items-center justify-center overflow-hidden relative"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ 
                 boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.05)'
              }}
            >
                 {/* Texture grooves */}
                 <div className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-white/5 border-b-white/5 opacity-20 pointer-events-none" />
                 <div className="absolute inset-4 rounded-full border border-white/5 opacity-20" />
                 <div className="absolute inset-8 rounded-full border border-white/5 opacity-20" />
                 <div className="absolute inset-12 rounded-full border border-white/5 opacity-20" />
                 <div className="absolute inset-16 rounded-full border border-white/5 opacity-20" />
                 <div className="absolute inset-20 rounded-full border border-white/5 opacity-20" />
                 
                 {/* Album Cover Center (Replaced with Label) */}
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#222] relative z-10 bg-gradient-to-br from-[#222] to-[#111] flex flex-col items-center justify-center shadow-inner">
                    <div className="text-[8px] md:text-[10px] text-white/30 tracking-[0.2em] uppercase mb-1">ZimDex</div>
                    <Disc size={24} className="text-white/20" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 border border-white/20" />
                 </div>
            </motion.div>
            
            {/* Tonearm (stylized) */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-32 pointer-events-none origin-top-right z-20 drop-shadow-lg"
              animate={{ rotate: isPlaying ? 25 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
               <div className="w-2 h-24 bg-neutral-700 absolute right-4 top-4 rotate-12 rounded-full border-r border-white/10" />
               <div className="w-8 h-12 bg-neutral-600 rounded-md absolute bottom-0 left-0 rotate-12 shadow-lg" />
               <div className="w-4 h-4 bg-neutral-500 rounded-full absolute top-2 right-2 border border-white/10" />
            </motion.div>
        </div>

        {/* Song Info Mobile/Compact */}
        <div className="mt-10 text-center z-10">
           <h2 className="text-2xl font-bold text-white tracking-tight mb-2 drop-shadow-md">{currentSong.title}</h2>
           <p className="text-blue-400 font-medium text-lg drop-shadow-md">{currentSong.artist}</p>
        </div>
      </div>

      {/* Right: Controls & Playlist */}
      <div className="w-full md:w-[350px] bg-black/20 border-l border-white/5 p-6 flex flex-col backdrop-blur-sm">
         <div className="flex items-center justify-between mb-6 text-white/50">
            <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <ListMusic size={14} /> Playlist
            </span>
            <span className="text-xs">{playlist.length} songs</span>
         </div>

         {/* Playlist Items */}
         <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-1">
            {playlist.map((song, index) => {
              const isActive = song.title === currentSong.title;
              return (
                <div 
                  key={index}
                  ref={isActive ? activeSongRef : null}
                  onClick={() => onPlay(index)}
                  className={`
                    p-3 rounded-lg flex items-center gap-3 transition-all cursor-pointer group
                    ${isActive 
                      ? 'bg-white/10 border border-white/5 shadow-sm' 
                      : 'hover:bg-white/5 border border-transparent opacity-60 hover:opacity-100'
                    }
                  `}
                >
                   {/* Icon Placeholder instead of Image */}
                   <div className="w-10 h-10 rounded bg-gray-800/50 border border-white/5 overflow-hidden relative shrink-0 flex items-center justify-center">
                      <Disc size={18} className={isActive ? "text-blue-400" : "text-gray-600"} />
                      {isActive && isPlaying && (
                        <div className="absolute inset-0 flex items-end justify-center gap-[2px] pb-1 bg-black/40">
                           <motion.div animate={{ height: [4, 12, 6, 14, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-blue-400 rounded-full" />
                           <motion.div animate={{ height: [8, 4, 14, 6, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-blue-400 rounded-full" />
                           <motion.div animate={{ height: [6, 14, 4, 10, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[2px] bg-blue-400 rounded-full" />
                        </div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {song.title}
                      </div>
                      <div className="text-white/50 text-xs truncate">{song.artist}</div>
                   </div>
                   {isActive && <Volume2 size={14} className="text-blue-400" />}
                </div>
              );
            })}
         </div>

         {/* Controls Area */}
         <div className="mt-6 pt-6 border-t border-white/10">
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-1 bg-white/10 rounded-full mb-2 relative group cursor-pointer"
              onClick={handleProgressClick}
            >
               <div className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full relative" style={{ width: `${progressPercent}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
            <div className="flex justify-between text-[10px] text-white/40 font-mono mb-4">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center justify-center gap-6">
               <button onClick={onPrev} className="text-white/70 hover:text-white transition-transform hover:scale-110 active:scale-95">
                  <SkipBack size={24} fill="currentColor" />
               </button>
               
               <button 
                 onClick={onTogglePlay}
                 className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
               >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
               </button>

               <button onClick={onNext} className="text-white/70 hover:text-white transition-transform hover:scale-110 active:scale-95">
                  <SkipForward size={24} fill="currentColor" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
