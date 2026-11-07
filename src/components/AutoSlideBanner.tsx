'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Award, 
  Sparkles, 
  Calendar, 
  Flame,
  Sun,
  ShieldCheck, 
  ArrowRight,
  Pause,
  Play,
  Clock,
  Compass,
  Zap
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

interface Slide3DItem {
  id: number;
  tagline: string;
  badge: string;
  badgeGradient: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  heroImage: string;
  bgGradient: string;
  glowColor: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryAction: 'reels' | 'visit';
  pillBadges: { icon: any; text: string; bg: string }[];
}

const SLIDES_3D: Slide3DItem[] = [
  {
    id: 1,
    tagline: 'ROYAL INDIAN GAMEFOWL • 100% PURE BLOODLINE',
    badge: '👑 Champion Sire Bloodline',
    badgeGradient: 'from-amber-400 via-orange-500 to-rose-500',
    titlePrefix: 'The Undisputed King of India:',
    titleHighlight: 'Pure Royal Aseel',
    description: 'Bred for majesty, bone density, and ancient fighting spirit. Standing proud at 26 inches with golden fire plumage, compact pea combs, and unbreakable natural stamina.',
    heroImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1400&q=85',
    bgGradient: 'from-amber-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    primaryButtonText: 'Explore Aseel Gallery',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Watch Stance Reels',
    secondaryAction: 'reels',
    pillBadges: [
      { icon: Flame, text: 'Alpha Upright Stance', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { icon: Award, text: '2026 Champion Pedigree', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
      { icon: Zap, text: 'Dense Bone Anatomy', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    ],
  },
  {
    id: 2,
    tagline: 'SACRED TRIBAL HERITAGE • 100% NATURAL MELANIN',
    badge: '🌿 Pure Jhabua Kadaknath',
    badgeGradient: 'from-purple-500 via-indigo-500 to-cyan-500',
    titlePrefix: 'The Black Diamond of Nature:',
    titleHighlight: 'Original Kadaknath',
    description: 'The ancient Kali Masi bloodline with 100% pure black skin, tongue, and bones. Iridescent emerald-purple luster, legendary medicinal vigor, and uncompromised genetic purity.',
    heroImage: 'https://images.unsplash.com/photo-1589332278453-611a91e5e04d?auto=format&fit=crop&w=1400&q=85',
    bgGradient: 'from-purple-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    primaryButtonText: 'View Kadaknath Strains',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Schedule Farm Visit',
    secondaryAction: 'visit',
    pillBadges: [
      { icon: Sparkles, text: '100% Melanin Pure', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { icon: ShieldCheck, text: 'Zero Antibiotic Raised', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
      { icon: Sun, text: 'High Immunity Line', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    ],
  },
  {
    id: 3,
    tagline: 'UNFILTERED 4K BROADCAST • DIRECT FROM THE PADDOCK',
    badge: '📹 JP Rooster TV Broadcast',
    badgeGradient: 'from-rose-500 via-pink-500 to-amber-500',
    titlePrefix: 'Real Posture in Motion:',
    titleHighlight: 'HD Video Cinema Reels',
    description: 'Inspect gait, crowing resonance, alertness, and aggressive balance in full motion. Every registered rooster is documented in authentic, unedited high definition.',
    heroImage: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1400&q=85',
    bgGradient: 'from-rose-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    primaryButtonText: 'Watch Rooster TV Now',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Open Full Reels Player',
    secondaryAction: 'reels',
    pillBadges: [
      { icon: PlayCircle, text: '1080p HD Stance Reels', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { icon: Zap, text: 'Authentic Crowing Audio', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { icon: Award, text: 'Verified Leg Tag IDs', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
    ],
  },
  {
    id: 4,
    tagline: 'NATURAL SUNLIGHT PADDOCKS • ETHICAL CONSERVATION',
    badge: '🌾 Organic Farm Sanctuary',
    badgeGradient: 'from-emerald-400 via-teal-500 to-amber-500',
    titlePrefix: 'Nourished on Traditional',
    titleHighlight: 'Sprouted Bajra & Almonds',
    description: 'Zero chemical broilers or commercial concentrates. Raised freely under natural open sunshine with sprouted pearl millet, boiled desi eggs, garlic greens, and herbal vitality tonics.',
    heroImage: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1400&q=85',
    bgGradient: 'from-emerald-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    primaryButtonText: 'Explore Diet & Care Standards',
    primaryButtonLink: '#biosecurity',
    secondaryButtonText: 'Schedule Farm Visit',
    secondaryAction: 'visit',
    pillBadges: [
      { icon: Sun, text: 'Open Sunlight Pastures', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { icon: ShieldCheck, text: 'Zero Chemical Hormones', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
      { icon: Sparkles, text: 'Vigorous Natural Vitality', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    ],
  },
  {
    id: 5,
    tagline: 'PREMIER CONSERVATION ESTATE • OPEN 7 DAYS A WEEK',
    badge: '📍 Highway 65 Living Estate',
    badgeGradient: 'from-cyan-400 via-blue-500 to-purple-600',
    titlePrefix: 'Experience Heritage in Person:',
    titleHighlight: 'Visitors Welcome Daily',
    description: 'Visit our open-air breeding paddocks daily from 7:00 AM to 7:00 PM. Observe majestic champion studs up close, discuss bloodline genetics with our master breeder, and enjoy scenic rural hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1400&q=85',
    bgGradient: 'from-blue-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    primaryButtonText: 'Plan Your Farm Visit',
    primaryButtonLink: '#visit-guide',
    secondaryButtonText: 'Schedule Appointment',
    secondaryAction: 'visit',
    pillBadges: [
      { icon: Compass, text: 'NH 65 Valley Corridor', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { icon: Clock, text: '7:00 AM – 7:00 PM Daily', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
      { icon: Award, text: 'Master Breeder Guided Tour', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    ],
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

  // EXACT REQUIREMENT: Auto slide every 40 seconds (40,000 milliseconds)
  const slideDuration = 40000;
  const progressInterval = 100; // Update progress bar every 100ms

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % SLIDES_3D.length);
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
    setCurrentSlide((prev) => (prev + 1) % SLIDES_3D.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES_3D.length) % SLIDES_3D.length);
    setProgress(0);
  };

  const current = SLIDES_3D[currentSlide];
  const secondsLeft = Math.ceil(((100 - progress) / 100) * (slideDuration / 1000));

  return (
    <section 
      className="relative w-full bg-stone-950 text-white overflow-hidden border-b border-stone-800 select-none min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* 3D Ambient Multi-Color Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Glowing Sphere matching current slide */}
        <div 
          className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[130px] transition-all duration-1000 ease-in-out opacity-60"
          style={{ backgroundColor: current.glowColor }}
        ></div>
        <div 
          className="absolute -bottom-32 -right-32 w-[38rem] h-[38rem] rounded-full blur-[140px] transition-all duration-1000 ease-in-out opacity-50"
          style={{ backgroundColor: current.glowColor }}
        ></div>
        {/* Subtle 3D Radial Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]"></div>
      </div>

      {/* Background Hero Transition Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {SLIDES_3D.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.heroImage}
              alt=""
              className="w-full h-full object-cover object-center scale-105 filter brightness-[0.22] contrast-[1.1] transition-transform duration-[40000ms] ease-linear"
              style={{
                transform: index === currentSlide ? 'scale(1.12)' : 'scale(1.0)',
              }}
            />
            {/* Chromatic Multi-Tone Vignette */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Main 3D Interactive Stage */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 flex-1 flex flex-col justify-between">
        
        {/* Top Header: 40-Second Auto-Slide Timer Pill & Counter */}
        <div className="flex items-center justify-between pb-6">
          
          {/* 3D Glass Pill with Countdown */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-stone-900/80 border border-white/15 backdrop-blur-xl shadow-2xl">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
              {current.tagline}
            </span>
          </div>

          {/* Slide Indicator & 40s Countdown Timer */}
          <div className="flex items-center space-x-3 bg-stone-900/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-xl text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <span>0{currentSlide + 1}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400">0{SLIDES_3D.length}</span>
            </div>

            <div className="h-3 w-px bg-stone-700"></div>

            {/* 40-Second Real-Time Counter */}
            <div className="flex items-center space-x-1 text-stone-300 text-[11px]" title="Auto-slides every 40 seconds">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPaused ? 'Paused' : `${secondsLeft}s`}</span>
            </div>

            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className="text-stone-400 hover:text-white transition p-0.5 rounded"
              title={isPaused ? "Resume Auto Slide" : "Pause Auto Slide (40s)"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* 3D Showcase Stage: Pure Cinematic Visuals (NO DATA BOXES) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          
          {/* Left Column: Bold 3D Headline, Badges & Interactive Buttons */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* 3D Luminous Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-500">
              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${current.badgeGradient}`}></span>
              <span className="text-xs font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                {current.badge}
              </span>
            </div>

            {/* Main Headline with 3D Depth */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              <span className="text-stone-300 font-extrabold text-2xl sm:text-4xl block mb-2">
                {current.titlePrefix}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 drop-shadow-[0_10px_25px_rgba(245,158,11,0.3)]">
                {current.titleHighlight}
              </span>
            </h1>

            {/* Cinematic Subtitle */}
            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
              {current.description}
            </p>

            {/* 3 Floating Colorful Badges (NO DATA TABLES) */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {current.pillBadges.map((pill, pIdx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pIdx}
                    className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md shadow-lg ${pill.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pill.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                href={current.primaryButtonLink}
                className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-7 py-4 rounded-2xl text-sm transition-all duration-200 shadow-2xl shadow-amber-950/80 hover:scale-105 active:scale-95"
              >
                <span>{current.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {current.secondaryAction === 'reels' && onOpenReels && (
                <button
                  type="button"
                  onClick={onOpenReels}
                  className="inline-flex items-center space-x-2 bg-stone-900/80 hover:bg-stone-800 text-white font-bold px-6 py-4 rounded-2xl text-sm border border-white/20 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-200 shadow-xl"
                >
                  <PlayCircle className="w-5 h-5 text-amber-400" />
                  <span>{current.secondaryButtonText}</span>
                </button>
              )}

              {current.secondaryAction === 'visit' && onScheduleVisit && (
                <button
                  type="button"
                  onClick={onScheduleVisit}
                  className="inline-flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl text-sm border border-emerald-400/40 backdrop-blur-xl transition-all duration-200 shadow-xl shadow-emerald-950/60"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{current.secondaryButtonText}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: 3D Holographic Perspective Card (PURE VISUAL - NO DATA) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            
            {/* 3D Card Container with Perspective Rotation */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] [perspective:1200px] group">
              
              {/* 3D Floating Glowing Auras */}
              <div 
                className="absolute inset-0 rounded-3xl blur-2xl opacity-60 transition-all duration-1000 group-hover:opacity-90"
                style={{ backgroundColor: current.glowColor }}
              ></div>

              {/* Main 3D Card Face with Tilt */}
              <div 
                className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transition-all duration-700 [transform:rotateY(-6deg)_rotateX(4deg)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)] animate-float-slow"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.85) 100%)',
                }}
              >
                {/* 3D Rooster Artwork */}
                <img
                  src={current.heroImage}
                  alt={current.titleHighlight}
                  className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.9] transition-transform duration-700 group-hover:scale-110"
                />

                {/* 3D Glass Vignette & Highlights */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10 pointer-events-none"></div>

                {/* Floating Top 3D Seal */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="px-3 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 shadow-xl flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>JP FARMS 3D</span>
                  </div>

                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-600/90 text-white shadow-lg backdrop-blur-md border border-emerald-400/30">
                    LIVING STUD
                  </span>
                </div>

                {/* Floating Bottom 3D Title Bar */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-stone-950/85 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-white truncate">
                      {current.titleHighlight}
                    </h4>
                    <span className="text-amber-400 text-xs font-mono font-bold">
                      0{currentSlide + 1}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                    {current.description}
                  </p>
                </div>

              </div>

              {/* Floating Decorative 3D Emblems */}
              <div className="absolute -bottom-3 -left-3 p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 shadow-2xl border border-amber-300/60 animate-float-reverse">
                <Award className="w-6 h-6" />
              </div>

              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-2xl bg-stone-900/90 text-amber-400 text-xs font-bold border border-amber-400/40 shadow-2xl backdrop-blur-md">
                <span>40s AUTO SLIDE</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Navigation: 40-Second Animated Progress Bar & Dot Selectors */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* 5 Slide Dot Selectors with Tooltips */}
          <div className="flex items-center space-x-2.5">
            {SLIDES_3D.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`group relative h-3 rounded-full transition-all duration-500 ${
                  idx === currentSlide 
                    ? 'w-12 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 shadow-lg shadow-amber-500/50' 
                    : 'w-3 bg-stone-700/80 hover:bg-stone-500'
                }`}
                aria-label={`Jump to 3D Slide ${idx + 1}`}
              >
                {/* Tooltip on hover */}
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block bg-stone-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border border-stone-700 pointer-events-none shadow-xl">
                  {slide.titleHighlight}
                </span>
              </button>
            ))}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={prevSlide}
              className="p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition active:scale-90 shadow-lg"
              aria-label="Previous 3D Slide"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition active:scale-90 shadow-lg"
              aria-label="Next 3D Slide"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 40-Second Smooth Running Linear Progress Bar */}
      <div className="w-full h-1.5 bg-stone-900/80 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 to-purple-500 transition-all duration-100 ease-linear shadow-lg"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </section>
  );
};
