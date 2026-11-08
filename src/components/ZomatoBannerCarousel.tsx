'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  MapPin, 
  PlayCircle, 
  ShieldCheck 
} from 'lucide-react';
import { Rooster } from '@/types/rooster';

interface ZomatoBannerCarouselProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
  onSelectRooster?: (rooster: Rooster) => void;
  roosters?: Rooster[];
}

interface BannerSlide {
  id: string;
  image: string;
  imageAlt: string;
}

export const ZomatoBannerCarousel: React.FC<ZomatoBannerCarouselProps> = ({
  onOpenReels,
  onScheduleVisit,
  onSelectRooster,
  roosters = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const BANNERS: BannerSlide[] = [
    {
      id: 'commercial-grain-ad',
      image: '/banners/ad_rooster_golden_grains_commercial.jpg',
      imageAlt: '3D Commercial Advertisement: Champion Rooster Feeding on Golden Grains at JP Farms',
    },
    {
      id: 'winter-storybook',
      image: '/banners/winter_storybook_rooster_snow.jpg',
      imageAlt: 'Winter Storybook 3D Illustration: Magnificent Rooster on Snowy Fence at JP Farms',
    },
    {
      id: 'peela-aseel',
      image: '/banners/banner_rainbow_wings_crow.jpg',
      imageAlt: 'Royal Peela Aseel Rooster with Rainbow Wings Crowing at JP Farms',
    },
    {
      id: 'alpha-staredown',
      image: '/banners/banner_alpha_warrior_staredown.jpg',
      imageAlt: 'Alpha Warrior Staredown: Purebred Champion Sire at JP Farms',
    },
    {
      id: 'farm-stream',
      image: '/banners/midday_4_farm_stream.jpg',
      imageAlt: 'JP Farms Green Pastures and Natural Stream Paddocks',
    },
    {
      id: 'black-kadaknath',
      image: '/banners/night_2_black_kadaknath.jpg',
      imageAlt: 'Pure Jet-Black Jhabua Kadaknath Rooster at JP Farms',
    },
  ];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, [BANNERS.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, [BANNERS.length]);

  // Auto-advance timer: Slides every 10 seconds automatically, smoothly resets on click, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex, BANNERS.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = BANNERS[currentIndex];

  const handleBannerClick = () => {
    if (current.id === 'alpha-staredown' && onOpenReels) {
      onOpenReels();
    } else if (current.id === 'farm-stream' && onScheduleVisit) {
      onScheduleVisit();
    } else {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      
      {/* 100% Full-Bleed Clean Banner Container (Zero Text Overlap, Pure Master Artwork) */}
      <div 
        className="group relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[21/8] min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-xl shadow-sky-950/5 overflow-hidden bg-slate-900 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBannerClick}
      >
        
        {/* Full-Bleed Artwork Banner Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            key={current.id}
            src={current.image}
            alt={current.imageAlt}
            className="w-full h-full object-cover object-[center_35%] filter brightness-[1.02] contrast-[1.03] transition-all duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>

        {/* Clean Hover-Activated Left Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous Banner"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200/90 hidden sm:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Clean Hover-Activated Right Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next Banner"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200/90 hidden sm:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Minimalist Bottom Indicator Dash/Dots */}
        <div 
          className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          {BANNERS.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? 'w-7 h-2 bg-sky-600' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

      </div>

      {/* Quick Feature Ticker Below Banner (4 Clean Value Badges) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-3">
        
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-sky-100 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">100% Pure Bloodline</span>
            <span className="text-slate-500 text-[10px]">Zero Cross Breeding</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-sky-100 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">Paddock Tours Active</span>
            <span className="text-slate-500 text-[10px]">7 AM – 7 PM Daily</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-sky-100 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <PlayCircle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">Rooster TV 4K Reels</span>
            <span className="text-slate-500 text-[10px]">Unfiltered HD Proof</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-sky-100 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">Organic Ayurvedic Diet</span>
            <span className="text-slate-500 text-[10px]">0% Steroids & Hormones</span>
          </div>
        </div>

      </div>

    </section>
  );
};
