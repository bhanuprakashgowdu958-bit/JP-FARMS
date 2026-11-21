'use client';

import React from 'react';
import { Play, PlayCircle, Video, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface RoosterTVSectionProps {
  roosters: Rooster[];
  onOpenReels: (initialId?: string) => void;
  onSelectRooster: (rooster: Rooster) => void;
}

export const RoosterTVSection: React.FC<RoosterTVSectionProps> = ({
  roosters,
  onOpenReels,
  onSelectRooster,
}) => {
  const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;
  const videoBirds = roosters.filter((r) => !!r.videoUrl);

  if (videoBirds.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="rooster-tv"
      className="py-16 sm:py-20 bg-[#161311] text-white border-y border-amber-900/40 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="space-y-3">
            <div className="reveal reveal-scale inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Rooster TV • 4K Unfiltered Proof</span>
            </div>
            <h2 className="reveal heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
              Witness Purebred Stance <em className="text-amber-400">in Motion</em>
            </h2>
            <p className="reveal text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed">
              True avian connoisseurs inspect the gait, bone density, comb structure, and dominant crowing before securing a bird. No filters, no edits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenReels()}
            className="reveal inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer self-start md:self-auto shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch 4K Reels Player</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reel Video Teaser Gallery (Horizontal touch scroll) */}
        <div className="reveal grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {videoBirds.slice(0, 4).map((bird, idx) => (
            <div
              key={bird.id}
              onClick={() => onOpenReels(bird.id)}
              className="group relative aspect-[9/14] sm:aspect-[9/15] rounded-2xl overflow-hidden bg-stone-900 border border-white/10 hover:border-amber-500/60 transition-all duration-300 cursor-pointer shadow-xl select-none"
            >
              {/* Thumbnail image */}
              <img
                src={bird.images[0] || '/logo-square.png'}
                alt={bird.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient dark mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/20 to-stone-950/40 group-hover:from-stone-950/90 transition-all" />

              {/* Top Reel Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {bird.tagId}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                  <span>4K HD</span>
                </span>
              </div>

              {/* Centered Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center group-hover:scale-115 group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:border-amber-400 transition-all duration-300 shadow-xl">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Specimen Info */}
              <div className="absolute bottom-3 inset-x-3 z-10 text-left space-y-1">
                <p className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 group-hover:text-amber-300 transition">
                  {bird.name}
                </p>
                <p className="text-[10px] text-white/70 truncate">
                  {bird.breed.split('(')[0].trim()} • {bird.weight}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-xs font-black text-amber-400">
                    ₹{(bird.price || 9500).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-bold group-hover:text-amber-200">
                    Play Reel →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
