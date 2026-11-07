'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Award, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Feather, 
  ArrowRight,
  Sun,
  Eye,
  Pause,
  Play
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

interface SlideItem {
  id: number;
  tag: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  subtitle: string;
  image: string;
  specs: { label: string; value: string }[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryAction?: 'reels' | 'visit';
  gradientOverlay: string;
  accentBorder: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    tag: 'INDIGENOUS ROYAL GAMEFOWL',
    badge: '👑 Champion Sire Bloodline',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    title: 'The Purest Royal',
    highlightText: 'Indian Aseel Bloodlines',
    subtitle: 'Conserving legendary Peela and Kagar Aseel roosters with massive bone density, compact pea combs, and fearless 26-inch upright standing postures.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Height', value: '26+ Inches' },
      { label: 'Weight', value: '3.8 - 4.5 Kg' },
      { label: 'Plumage', value: 'Golden Orange' },
      { label: 'Comb', value: 'Compact Pea' },
    ],
    primaryCtaText: 'Explore Aseel Gallery',
    primaryCtaLink: '#showcase',
    secondaryCtaText: 'Watch Stance Reels',
    secondaryAction: 'reels',
    gradientOverlay: 'from-black/95 via-black/75 to-amber-950/40',
    accentBorder: 'border-amber-500/40',
  },
  {
    id: 2,
    tag: 'HIGH MEDICINAL VALUE INDIGENOUS LINE',
    badge: '🌿 100% DNA Pure Melanin',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    title: 'Authentic Jhabua',
    highlightText: 'Original Kadaknath',
    subtitle: 'Preserving the iconic black-fleshed Kali Masi breed. Pure black skin, beak, tongue, and bones with green-purple iridescent sheen. Free-range raised with zero chemical antibiotics.',
    image: 'https://images.unsplash.com/photo-1589332278453-611a91e5e04d?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Melanin', value: '100% Pure' },
      { label: 'Weight', value: '2.2 - 2.6 Kg' },
      { label: 'Health', value: 'Vaccinated' },
      { label: 'Diet', value: 'Organic Forage' },
    ],
    primaryCtaText: 'View Kadaknath Strains',
    primaryCtaLink: '#showcase',
    secondaryCtaText: 'Schedule Farm Visit',
    secondaryAction: 'visit',
    gradientOverlay: 'from-black/95 via-black/75 to-purple-950/40',
    accentBorder: 'border-purple-500/40',
  },
  {
    id: 3,
    tag: 'UNFILTERED HD VIDEO TRANSPARENCY',
    badge: '📹 JP Rooster TV Broadcast',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    title: 'Watch Unedited Walking &',
    highlightText: 'Stance Video Reels',
    subtitle: 'Inspect gait, crowing resonance, alertness, and aggressive balance before booking an in-person farm appointment. Every registered bird is recorded in high definition.',
    image: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Resolution', value: '1080p HD' },
      { label: 'Audio', value: 'Real Crowing' },
      { label: 'Verification', value: 'Leg Tag ID' },
      { label: 'Available', value: 'Live TV' },
    ],
    primaryCtaText: 'Watch Rooster TV Now',
    primaryCtaLink: '#showcase',
    secondaryCtaText: 'Open Full Reels Player',
    secondaryAction: 'reels',
    gradientOverlay: 'from-black/95 via-black/75 to-rose-950/40',
    accentBorder: 'border-rose-500/40',
  },
  {
    id: 4,
    tag: 'NATURAL OPEN SUNLIGHT PASTURES',
    badge: '🌾 Organic Feeding Tradition',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    title: 'Raised on Traditional',
    highlightText: 'Sprouted Bajra & Almonds',
    subtitle: 'No artificial steroids or industrial broiler feeds. Conditioned on sprouted pearl millet, boiled desi eggs, garlic greens, and herbal decoctions for natural vigor and feather luster.',
    image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Feed', value: 'Sprouted Bajra' },
      { label: 'Sunlight', value: 'Full Open Day' },
      { label: 'Antibiotics', value: '0% Zero' },
      { label: 'Bio-Security', value: 'Sanitized' },
    ],
    primaryCtaText: 'Learn Diet Standards',
    primaryCtaLink: '#biosecurity',
    secondaryCtaText: 'Schedule Visit',
    secondaryAction: 'visit',
    gradientOverlay: 'from-black/95 via-black/75 to-emerald-950/40',
    accentBorder: 'border-emerald-500/40',
  },
  {
    id: 5,
    tag: 'OPEN DAILY FOR POULTRY ENTHUSIASTS',
    badge: '📍 Highway 65 Conservation Estate',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    title: 'Experience JP Farms In Person',
    highlightText: 'Visitors Welcome Daily',
    subtitle: 'Visit our farm open 7:00 AM – 7:00 PM daily. Walk through spacious stud pens, meet our master breeder, and witness these majestic champions in natural daylight.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Hours', value: '7 AM - 7 PM' },
      { label: 'Days', value: 'All 7 Days' },
      { label: 'Entry', value: 'Welcome' },
      { label: 'Location', value: 'NH 65 Estate' },
    ],
    primaryCtaText: 'Plan Your Farm Visit',
    primaryCtaLink: '#visit-guide',
    secondaryCtaText: 'Book Appointment',
    secondaryAction: 'visit',
    gradientOverlay: 'from-black/95 via-black/75 to-blue-950/40',
    accentBorder: 'border-blue-500/40',
  },
];

interface AutoSlideBannerProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const AutoSlideBanner: React.FC<AutoSlideBannerProps> = ({
  onOpenReels,
  onScheduleVisit,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5000; // 5 seconds per slide
  const progressInterval = 50; // update every 50ms

  // Auto-play timer with progress bar
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % SLIDES.length);
          return 0;
        }
        return prev + (progressInterval / slideDuration) * 100;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  };

  const current = SLIDES[currentSlide];

  return (
    <div 
      className="relative w-full bg-stone-950 text-white overflow-hidden border-b border-stone-800 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Background Image Container with Cross-Fade */}
      <div className="relative h-[560px] sm:h-[600px] lg:h-[640px] w-full overflow-hidden">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ transition: 'opacity 1s ease-in-out, transform 7s ease-out' }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark & Jewel Tone Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradientOverlay}`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40"></div>
          </div>
        ))}

        {/* Ambient Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Slide Content Overlay */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-10 sm:py-14 z-10">
          
          {/* Top Row: Slide Counter & Tag */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-950/70 border border-white/10 backdrop-blur-md text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-mono text-amber-300 font-bold tracking-wider">{current.tag}</span>
            </div>

            <div className="flex items-center space-x-2 bg-stone-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono">
              <span className="text-amber-400 font-bold">0{currentSlide + 1}</span>
              <span className="text-stone-500">/</span>
              <span className="text-stone-400">0{SLIDES.length}</span>
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="ml-2 text-stone-400 hover:text-white transition"
                title={isPaused ? "Resume Auto Slide" : "Pause Auto Slide"}
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Center Main Text & Showcase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-md shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-left-4">
                <span className={`px-2.5 py-0.5 rounded-md ${current.badgeColor} border`}>
                  {current.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                {current.title}{' '}
                <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 drop-shadow-sm">
                  {current.highlightText}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed font-normal">
                {current.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={current.primaryCtaLink}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-xl shadow-amber-950/60 hover:scale-105 active:scale-95"
                >
                  <span>{current.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                {current.secondaryAction === 'reels' && onOpenReels && (
                  <button
                    type="button"
                    onClick={onOpenReels}
                    className="inline-flex items-center space-x-2 bg-stone-900/80 hover:bg-stone-800 text-white font-semibold px-5 py-3.5 rounded-xl text-sm border border-stone-700/80 backdrop-blur-md transition hover:border-amber-400/50"
                  >
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    <span>{current.secondaryCtaText}</span>
                  </button>
                )}

                {current.secondaryAction === 'visit' && onScheduleVisit && (
                  <button
                    type="button"
                    onClick={onScheduleVisit}
                    className="inline-flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold px-5 py-3.5 rounded-xl text-sm border border-emerald-500/40 backdrop-blur-md transition shadow-lg shadow-emerald-950/50"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{current.secondaryCtaText}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Live Specifications Glass Card */}
            <div className="hidden lg:block lg:col-span-4">
              <div className={`bg-stone-950/75 backdrop-blur-xl rounded-2xl p-6 border ${current.accentBorder} shadow-2xl space-y-4`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                      Lineage Attributes
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {current.specs.map((spec, i) => (
                    <div key={i} className="bg-stone-900/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-stone-400 uppercase font-bold">{spec.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">{spec.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Farm Heritage Registry</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Pure Gen 1
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Navigation Dots & Progress Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            
            {/* Interactive Dot Selectors */}
            <div className="flex items-center space-x-2">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-10 bg-amber-400' 
                      : 'w-2.5 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {/* Tooltip on hover */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-stone-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap border border-stone-700 pointer-events-none shadow-md">
                    {slide.highlightText}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Navigation Arrows */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Auto-Slide Progress Bar */}
      <div className="w-full h-1 bg-stone-900">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
};

