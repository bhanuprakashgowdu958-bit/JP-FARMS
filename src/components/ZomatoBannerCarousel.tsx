'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Award, 
  MapPin, 
  PlayCircle, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
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
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
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
      image: 'https://res.cloudinary.com/drcftm7m/image/upload/f_auto,q_auto/v1795289205/jp-farms/banners/ad_rooster_golden_grains_wide.jpg',
      imageAlt: '3D Commercial Advertisement: Champion Rooster Feeding on Golden Grains at JP Farms',
      badge: '100% Ayurvedic Conditioning',
      title: 'Heritage Organic Pasture Raised',
      subtitle: 'Zero steroids, antibiotics, or commercial broiler feed formulas',
      ctaText: 'Explore Pure Strains →',
    },
    {
      id: 'winter-storybook',
      image: 'https://res.cloudinary.com/drcftm7m/image/upload/f_auto,q_auto/v1795289208/jp-farms/banners/winter_storybook_rooster_wide.jpg',
      imageAlt: 'Winter Storybook 3D Illustration: Magnificent Rooster on Snowy Fence at JP Farms',
      badge: 'All-Weather Avian Stamina',
      title: 'High Bone Density & Vitality',
      subtitle: 'Bred for dominant stance, disease immunity, and breed fidelity',
      ctaText: 'Browse Living Birds →',
    },
    {
      id: 'peela-aseel',
      image: 'https://res.cloudinary.com/drcftm7m/image/upload/f_auto,q_auto/v1795289211/jp-farms/banners/banner_rainbow_wings_crow.jpg',
      imageAlt: 'Royal Peela Aseel Rooster with Rainbow Wings Crowing at JP Farms',
      badge: 'Ancient Deccan Bloodline',
      title: 'Pure Royal Peela Aseel',
      subtitle: 'Compact pea combs, upright alpha postures, and fiery plumage',
      ctaText: 'View Peela Lineage →',
    },
    {
      id: 'alpha-staredown',
      image: 'https://res.cloudinary.com/drcftm7m/image/upload/f_auto,q_auto/v1795289213/jp-farms/banners/banner_alpha_warrior_staredown.jpg',
      imageAlt: 'Alpha Warrior Staredown: Purebred Champion Sire at JP Farms',
      badge: 'Rooster TV 4K Evidence',
      title: 'Unfiltered 4K Video Proof',
      subtitle: 'Inspect unedited walking gait, comb anatomy & standing height',
      ctaText: 'Watch 4K Reels ▶',
    },
    {
      id: 'farm-stream',
      image: 'https://res.cloudinary.com/drcftm7m/image/upload/f_auto,q_auto/v1795289215/jp-farms/banners/midday_4_farm_stream.jpg',
      imageAlt: 'JP Farms Green Pastures and Natural Stream Paddocks',
      badge: 'Hoskote & Chittoor Sanctuary',
      title: 'Walk the Open Pastures',
      subtitle: '7 AM – 7 PM Daily estate tours with our master breeding team',
      ctaText: 'Plan Estate Visit →',
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
    <section className="relative w-full overflow-hidden bg-[#faf8f4]">
      
      {/* 100% Full-Screen Edge-to-Edge Banner (Matching agri-nutro.vercel.app sizing: clamp(260px, 60vw, 400px) on mobile, clamp(340px, 48vw, 620px) on desktop) */}
      <div 
        className="agri-style-banner-stage group relative w-full overflow-hidden bg-transparent transition-all duration-300 cursor-pointer shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBannerClick}
      >
        
        {/* Hardware-Accelerated Sliding Track (Slides horizontally every 10s smoothly, exactly 100% per slide) */}
        <div 
          className="flex w-full h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div 
              key={banner.id}
              className="w-full min-w-full max-w-full flex-[0_0_100%] h-full shrink-0 relative select-none overflow-hidden"
            >
              <img
                src={banner.image}
                alt={banner.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover object-[center_35%] filter brightness-[1.08] contrast-[1.05] saturate-[1.1] pointer-events-none select-none block"
              />
              {/* Minimal bottom vignette - just enough to show dots, no brightness loss */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              {/* Luxury Editorial Overlay Card — Non-intrusive bottom-left placement */}
              <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 z-10 max-w-xs sm:max-w-md pointer-events-auto">
                <div className="bg-black/45 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 shadow-xl text-left space-y-1 sm:space-y-1.5 transition-all duration-300">
                  <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {banner.badge}
                  </span>
                  <h2 className="text-base sm:text-xl lg:text-2xl font-black text-white font-playfair tracking-tight leading-tight drop-shadow-sm">
                    {banner.title}
                  </h2>
                  <p className="hidden sm:block text-[11px] text-white/80 leading-snug line-clamp-1">
                    {banner.subtitle}
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-bold text-amber-300 hover:text-amber-200 transition">
                      <span>{banner.ctaText}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Prev / Next Glassmorphism Arrows (appear smoothly on hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

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
        
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-amber-100/80 shadow-2xs hover:border-amber-300 transition">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">100% Pure Bloodline</span>
            <span className="text-slate-500 text-[10px]">Zero Cross Breeding</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-amber-100/80 shadow-2xs hover:border-emerald-300 transition">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">Paddock Tours Active</span>
            <span className="text-slate-500 text-[10px]">7 AM – 7 PM Daily</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-amber-100/80 shadow-2xs hover:border-sky-300 transition">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <PlayCircle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">Rooster TV 4K Reels</span>
            <span className="text-slate-500 text-[10px]">Unfiltered HD Proof</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white border border-amber-100/80 shadow-2xs hover:border-purple-300 transition">
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
