'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  id: string;
  src: string;
  alt: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 'sunrise-morning-crow',
    src: '/banners/main_hero_banner.jpg',
    alt: 'JP Farms Morning Sunrise Crowing Rooster with Smiling Sun',
  },
  {
    id: 'sunset-wagon-estate',
    src: '/banners/banner_sunset_wagon_estate.jpg',
    alt: 'JP Farms Sunset Farm Heritage Rooster on Rustic Wagon',
  },
];

const AUTO_SLIDE_INTERVAL = 35000; // 35 seconds

interface PixarRoosterBanner3DProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const PixarRoosterBanner3D: React.FC<PixarRoosterBanner3DProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Automatically slide every 35 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [nextSlide, currentIndex]);

  return (
    <section 
      className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[720px] max-h-[88vh] overflow-hidden select-none border-b border-stone-800 bg-stone-950 group"
      aria-label="JP Farms 3D Heritage Rooster Banner Showcase"
    >
      {/* CROSSFADE IMAGE SLIDES */}
      {BANNERS.map((banner, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04]"
            />
          </div>
        );
      })}

      {/* SUBTLE PREVIOUS / NEXT ARROWS (Appear softly on hover) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Banner"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronLeft className="w-6 h-6 text-amber-300" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronRight className="w-6 h-6 text-amber-300" />
      </button>

      {/* MINIMAL BOTTOM NAVIGATION INDICATORS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-stone-950/50 backdrop-blur-md border border-white/10 shadow-2xl">
        {BANNERS.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? 'w-7 bg-amber-400 shadow-[0_0_10px_#f59e0b]' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          );
        })}
        <span className="text-[10px] font-mono text-stone-400 pl-1">35s</span>
      </div>
    </section>
  );
};
