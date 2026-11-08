'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  ];

  // Reset/start the 10-second auto-slide interval
  const resetAutoSlideTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 10000);
  }, [BANNERS.length]);

  // Start auto-slide on mount, clean up on unmount
  useEffect(() => {
    resetAutoSlideTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetAutoSlideTimer]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    resetAutoSlideTimer();
  }, [BANNERS.length, resetAutoSlideTimer]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    resetAutoSlideTimer();
  }, [BANNERS.length, resetAutoSlideTimer]);

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

  const handleBannerClick = () => {
    const activeBanner = BANNERS[currentIndex];
    if (activeBanner.id === 'alpha-staredown' && onOpenReels) {
      onOpenReels();
    } else if (activeBanner.id === 'farm-stream' && onScheduleVisit) {
      onScheduleVisit();
    } else {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f9fd]">
      
      {/* 100% Full-Screen Edge-to-Edge Banner (Zero Gaps, Zero Cuts, Smooth 10s Auto-Slide Track) */}
      <div 
        className="group relative w-full overflow-hidden bg-slate-950 transition-all duration-300 cursor-pointer shadow-md"
        style={{ aspectRatio: '1376 / 768' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBannerClick}
      >
        
        {/* Hardware-Accelerated Sliding Track (Slides horizontally every 10s smoothly) */}
        <div 
          className="flex w-full h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div 
              key={banner.id}
              className="w-full h-full shrink-0 relative select-none"
            >
              <img
                src={banner.image}
                alt={banner.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.03] pointer-events-none select-none"
              />
            </div>
          ))}
        </div>

        {/* Carousel Slide Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                resetAutoSlideTimer();
              }}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? "w-6 h-1.5 bg-white shadow-xs" 
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Quick Feature Ticker Below Banner (4 Clean Value Badges) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        
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
      </div>

    </section>
  );
};
