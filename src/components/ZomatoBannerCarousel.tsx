'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  PlayCircle, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  MapPin, 
  Sun,
  Flame,
  Sparkles
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { Rooster } from '@/types/rooster';

interface ZomatoBannerCarouselProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
  onSelectRooster?: (rooster: Rooster) => void;
  roosters?: Rooster[];
}

interface BannerSlide {
  id: string;
  tag: string;
  tagIcon: React.ReactNode;
  tagStyle: string;
  headline: string;
  highlightText: string;
  subhead: string;
  ctaText: string;
  ctaAction: 'whatsapp' | 'reels' | 'catalog' | 'biosecurity';
  ctaStyle: string;
  bgGradient: string;
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

  const whatsAppVisitUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms! 🐓 I saw your farm banner and would like to schedule a visit to your paddocks this weekend.',
  });

  const BANNERS: BannerSlide[] = [
    {
      id: 'peela-aseel',
      tag: 'ROYAL HERITAGE LINEAGE • EST. 2016',
      tagIcon: <Award className="w-3.5 h-3.5 text-amber-500" />,
      tagStyle: 'bg-amber-50 text-amber-900 border-amber-200',
      headline: 'Towering 26" Pure',
      highlightText: 'Peela Aseel Studs',
      subhead: 'Direct Deccan royal bloodlines preserved for 7 generations. Distinct upright warrior stance & dense bone density.',
      ctaText: 'Explore Available Roosters',
      ctaAction: 'catalog',
      ctaStyle: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25',
      bgGradient: 'from-amber-50 via-sky-50/60 to-white',
      image: '/banners/banner_rainbow_wings_crow.jpg',
      imageAlt: 'Royal Peela Aseel Rooster with Rainbow Wings at JP Farms',
    },
    {
      id: 'farm-visit',
      tag: 'OPEN DAILY 7:00 AM – 7:00 PM • NH 65 CORRIDOR',
      tagIcon: <MapPin className="w-3.5 h-3.5 text-emerald-600" />,
      tagStyle: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      headline: 'Experience the Farm in Person',
      highlightText: 'Guided Paddock Tours',
      subhead: 'Walk through green pastures, inspect live breeding pairs, and experience true organic desi poultry heritage.',
      ctaText: 'Schedule Visit on WhatsApp',
      ctaAction: 'whatsapp',
      ctaStyle: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-600/25',
      bgGradient: 'from-emerald-50 via-sky-50/60 to-white',
      image: '/banners/midday_4_farm_stream.jpg',
      imageAlt: 'JP Farms Green Pastures and Natural Stream Paddocks',
    },
    {
      id: 'rooster-tv',
      tag: 'ROOSTER TV • UNFILTERED 4K PROOF',
      tagIcon: <PlayCircle className="w-3.5 h-3.5 text-sky-600" />,
      tagStyle: 'bg-sky-50 text-sky-900 border-sky-200',
      headline: 'Uncut Walking Stance &',
      highlightText: 'Vocal Crowing Reels',
      subhead: 'Zero camera filters or deceptive angles. Watch genuine 4K video shorts of our roosters before planning your journey.',
      ctaText: 'Watch 4K Video Reels',
      ctaAction: 'reels',
      ctaStyle: 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-sky-600/25',
      bgGradient: 'from-sky-100/70 via-sky-50/70 to-white',
      image: '/banners/banner_alpha_warrior_staredown.jpg',
      imageAlt: 'Alpha Warrior Staredown Rooster TV Video Showcase',
    },
    {
      id: 'kadaknath-biosecurity',
      tag: '100% DNA CERTIFIED PURE • ZERO ANTIBIOTICS',
      tagIcon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
      tagStyle: 'bg-purple-50 text-purple-900 border-purple-200',
      headline: 'Jhabua Kadaknath &',
      highlightText: 'Ayurvedic Diet Nutrition',
      subhead: 'Raised on sprouted organic bajra, neem leaves, and crushed almonds. Fully vaccinated with 4-stage veterinary health cards.',
      ctaText: 'Explore Bio-Security Standards',
      ctaAction: 'biosecurity',
      ctaStyle: 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-purple-600/25',
      bgGradient: 'from-purple-50 via-sky-50/50 to-white',
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

  // Auto-advance timer (5.5s), pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 5500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

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

  const handleCtaClick = (action: BannerSlide['ctaAction']) => {
    switch (action) {
      case 'whatsapp':
        window.open(whatsAppVisitUrl, '_blank');
        break;
      case 'reels':
        if (onOpenReels) onOpenReels();
        break;
      case 'catalog': {
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth' });
        } else if (roosters.length > 0 && onSelectRooster) {
          onSelectRooster(roosters[0]);
        }
        break;
      }
      case 'biosecurity': {
        const biosecurityEl = document.getElementById('biosecurity');
        if (biosecurityEl) {
          biosecurityEl.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
    }
  };

  const current = BANNERS[currentIndex];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Zomato-Style Featured Banner Container */}
      <div 
        className="group relative rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-lg shadow-sky-950/5 overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Active Banner Slide */}
        <div className={`relative w-full bg-gradient-to-r ${current.bgGradient} transition-colors duration-500`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] items-center">
            
            {/* LEFT 58%: Zomato-Style Punchy Editorial & CTA */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 lg:pl-14 flex flex-col justify-center space-y-3 sm:space-y-4 z-10">
              
              {/* Category Pill Tag */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-xs ${current.tagStyle}`}>
                  {current.tagIcon}
                  <span>{current.tag}</span>
                </span>
              </div>

              {/* Bold Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {current.headline}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-amber-600">
                  {current.highlightText}
                </span>
              </h2>

              {/* Clean Subtitle */}
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                {current.subhead}
              </p>

              {/* Prominent Action Button + Secondary Prompt */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCtaClick(current.ctaAction)}
                  className={`inline-flex items-center space-x-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${current.ctaStyle}`}
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                {current.ctaAction !== 'reels' && onOpenReels && (
                  <button
                    type="button"
                    onClick={onOpenReels}
                    className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 font-semibold text-xs border border-sky-200 shadow-xs transition"
                  >
                    <PlayCircle className="w-4 h-4 text-sky-600" />
                    <span>Watch Video Reels</span>
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT 42%: 100% Unobstructed Vibrant 3D Artwork Showcase */}
            <div className="lg:col-span-5 h-[220px] sm:h-[280px] lg:h-[320px] relative overflow-hidden flex items-center justify-center p-3 sm:p-5 lg:pr-8">
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-sky-200/80 shadow-md bg-slate-900">
                <img
                  key={current.id}
                  src={current.image}
                  alt={current.imageAlt}
                  className="w-full h-full object-cover object-[center_35%] filter brightness-[1.02] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Zomato-Style Left Arrow Button (Appears on Hover, No Text Overlap) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-lg border border-slate-200/90 hidden sm:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Zomato-Style Right Arrow Button (Appears on Hover, No Image Overlap) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-lg border border-slate-200/90 hidden sm:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Zomato-Style Bottom Indicator Pills (Active Dash + Dots) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-200 shadow-xs">
          {BANNERS.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? 'w-6 h-2 bg-sky-600' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

      </div>

      {/* Zomato-Style Quick Feature Ticker Below Banner (4 Value Badges) */}
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

