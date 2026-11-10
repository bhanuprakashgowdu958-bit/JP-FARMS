'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  MessageCircle, 
  Eye, 
  Award, 
  Sparkles,
  Share2
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface RoosterReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roosters: Rooster[];
  initialRoosterId?: string;
  onSelectRooster: (rooster: Rooster) => void;
  onInquire?: (rooster: Rooster) => void;
}

export const RoosterReelsModal: React.FC<RoosterReelsModalProps> = ({
  isOpen,
  onClose,
  roosters,
  initialRoosterId,
  onSelectRooster,
  onInquire,
}) => {
  // Only roosters with videos
  const videoRoosters = roosters.filter(r => !!r.videoUrl);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    if (initialRoosterId && videoRoosters.length > 0) {
      const idx = videoRoosters.findIndex(r => r.id === initialRoosterId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialRoosterId, videoRoosters]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  if (!isOpen || videoRoosters.length === 0) return null;

  const currentRooster = videoRoosters[currentIndex];

  const handleNext = () => {
    if (currentIndex < videoRoosters.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(videoRoosters.length - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) return;
    const diffY = touchStartY.current - touchEndY.current;
    if (diffY > 50) {
      // Swiped UP -> Next video (TikTok / Instagram Reels style)
      handleNext();
    } else if (diffY < -50) {
      // Swiped DOWN -> Previous video
      handlePrev();
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hi JP Farms! 🐓 Watching JP Rooster TV Reel for #${currentRooster.tagId} (${currentRooster.name}, ${currentRooster.breed}). I would love to learn more about its lineage and visit the farm.`,
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      
      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-stone-800 transition border border-white/20"
        aria-label="Close reels"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Reel Center Container */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-full sm:h-[88vh] sm:rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between border border-stone-800 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Top Floating Header */}
        <div className="absolute top-4 left-4 right-16 z-30 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">JP Rooster TV</span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-stone-300 text-xs font-mono">{currentIndex + 1}/{videoRoosters.length}</span>
          </div>
        </div>

        {/* Video Player */}
        <div 
          className="relative w-full h-full cursor-pointer flex items-center justify-center"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={currentRooster.videoUrl}
            playsInline
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Gradient Overlay for bottom text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/90 pointer-events-none"></div>
        </div>

        {/* Right Floating Quick Tools */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center space-y-4">
          
          {/* Mute Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-3 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/20 transition active:scale-95"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Inspect Full Specs Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              onSelectRooster(currentRooster);
            }}
            className="p-3 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/20 transition active:scale-95 flex flex-col items-center"
            title="Inspect Specs"
          >
            <Eye className="w-5 h-5 text-amber-400" />
            <span className="text-[9px] font-bold mt-1">Specs</span>
          </button>

          {/* Next / Prev Navigation Arrows */}
          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-2 rounded-full bg-black/60 text-stone-300 hover:text-white border border-white/10"
              title="Previous Video"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-2 rounded-full bg-black/60 text-stone-300 hover:text-white border border-white/10"
              title="Next Video"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom Information Card Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-5 pb-safe space-y-3 pointer-events-auto">
          
          {/* Bird Tags & Badge */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="font-mono text-xs font-bold bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded shadow">
                TAG: {currentRooster.tagId}
              </span>
              <span className="text-[11px] font-bold bg-stone-900 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                {currentRooster.badge}
              </span>
              <span className="text-xs text-stone-300 font-semibold truncate">
                {currentRooster.breed}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white leading-tight">
              {currentRooster.name}
            </h3>

            {/* Quick Specs Badges */}
            <div className="flex items-center space-x-3 text-xs text-stone-300 mt-1">
              <span>Weight: <strong className="text-white">{currentRooster.weight}</strong></span>
              <span>•</span>
              <span>Age: <strong className="text-white">{currentRooster.age}</strong></span>
              <span>•</span>
              <span>Height: <strong className="text-white">{currentRooster.height}</strong></span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectRooster(currentRooster);
              }}
              className="bg-stone-900/90 hover:bg-stone-800 text-amber-400 font-bold px-3.5 py-3 rounded-xl border border-stone-700 text-xs flex items-center space-x-1.5 transition"
            >
              <Eye className="w-4 h-4" />
              <span>Full Profile</span>
            </button>

            {/* Direct WhatsApp Lead Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-xl transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
