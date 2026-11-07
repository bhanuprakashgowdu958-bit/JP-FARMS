'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface TimeSlotBanner {
  id: string;
  timeSlot: 'morning' | 'midday' | 'evening' | 'night';
  name: string;
  shortLabel: string;
  hoursLabel: string;
  greeting: string;
  description: string;
  icon: typeof Sunrise;
  color: string;
  accentColor: string;
  src: string;
  alt: string;
  matchHour: (hour: number) => boolean;
}

const TIME_BANNERS: TimeSlotBanner[] = [
  {
    id: 'morning-dawn',
    timeSlot: 'morning',
    name: 'Morning Dawn',
    shortLabel: 'Morning',
    hoursLabel: '6:00 AM – 11:00 AM',
    greeting: 'Good Morning from JP Farms 🌅',
    description: 'The Sunrise Crow & Morning Energy',
    icon: Sunrise,
    color: 'from-amber-400 to-orange-500',
    accentColor: '#f59e0b',
    src: '/banners/main_hero_banner.jpg',
    alt: 'JP Farms Morning Sunrise Crowing Rooster with Smiling Sun',
    matchHour: (h) => h >= 6 && h < 11,
  },
  {
    id: 'sunny-midday',
    timeSlot: 'midday',
    name: 'Sunny Midday',
    shortLabel: 'Midday',
    hoursLabel: '11:00 AM – 5:00 PM',
    greeting: 'Good Afternoon from JP Farms ☀️',
    description: 'Free-Range Pasture Grazing & Chicks',
    icon: Sun,
    color: 'from-yellow-400 to-amber-500',
    accentColor: '#eab308',
    src: '/banners/banner_afternoon_pasture.jpg',
    alt: 'JP Farms Sunlit Pasture with Free-Range Chicks',
    matchHour: (h) => h >= 11 && h < 17,
  },
  {
    id: 'golden-evening',
    timeSlot: 'evening',
    name: 'Golden Sunset',
    shortLabel: 'Evening',
    hoursLabel: '5:00 PM – 8:30 PM',
    greeting: 'Good Evening from JP Farms 🌇',
    description: 'Sunset Hay Wagon & Estate Heritage',
    icon: Sunset,
    color: 'from-orange-500 to-rose-600',
    accentColor: '#f97316',
    src: '/banners/banner_sunset_wagon_estate.jpg',
    alt: 'JP Farms Sunset Farm Heritage Rooster on Rustic Wagon',
    matchHour: (h) => h >= 17 && h < 20.5,
  },
  {
    id: 'starlit-night',
    timeSlot: 'night',
    name: 'Starlit Night',
    shortLabel: 'Night',
    hoursLabel: '8:30 PM – 6:00 AM',
    greeting: 'Peaceful Night at JP Farms 🌙',
    description: 'Tranquil Roosting Hours & Fireflies',
    icon: Moon,
    color: 'from-indigo-400 to-purple-500',
    accentColor: '#a855f7',
    src: '/banners/banner_twilight_starlit_farm.jpg',
    alt: 'JP Farms Twilight Serenity with Starlit Farm and Fireflies',
    matchHour: (h) => h >= 20.5 || h < 6,
  },
];

const AUTO_TOUR_INTERVAL = 15000; // 15 seconds per slide during tour

interface PixarRoosterBanner3DProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const PixarRoosterBanner3D: React.FC<PixarRoosterBanner3DProps> = () => {
  // Determine index based on current client hour
  const getLiveIndex = useCallback((): number => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    const found = TIME_BANNERS.findIndex((b) => b.matchHour(hour));
    return found >= 0 ? found : 0;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveIndex, setLiveIndex] = useState(0);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync with real-time on mount and check periodically
  useEffect(() => {
    setMounted(true);
    const initialLive = getLiveIndex();
    setLiveIndex(initialLive);
    setCurrentIndex(initialLive);

    // Keep checking live time every minute
    const timeCheckInterval = setInterval(() => {
      const updatedLive = getLiveIndex();
      setLiveIndex(updatedLive);
      if (isLiveMode && !isAutoTour) {
        setCurrentIndex(updatedLive);
      }
    }, 60000);

    return () => clearInterval(timeCheckInterval);
  }, [getLiveIndex, isLiveMode, isAutoTour]);

  // Handle Auto Tour (15 seconds per banner)
  useEffect(() => {
    if (!isAutoTour) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TIME_BANNERS.length);
    }, AUTO_TOUR_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoTour, currentIndex]);

  const activeBanner = TIME_BANNERS[currentIndex];
  const ActiveIcon = activeBanner.icon;

  const handleSelectTime = (index: number) => {
    setIsAutoTour(false);
    setCurrentIndex(index);
    setIsLiveMode(index === liveIndex);
  };

  const handleSnapToLive = () => {
    setIsAutoTour(false);
    setIsLiveMode(true);
    setCurrentIndex(liveIndex);
  };

  const toggleAutoTour = () => {
    setIsAutoTour((prev) => !prev);
    setIsLiveMode(false);
  };

  const nextSlide = () => {
    setIsAutoTour(false);
    setIsLiveMode(false);
    setCurrentIndex((prev) => (prev + 1) % TIME_BANNERS.length);
  };

  const prevSlide = () => {
    setIsAutoTour(false);
    setIsLiveMode(false);
    setCurrentIndex((prev) => (prev - 1 + TIME_BANNERS.length) % TIME_BANNERS.length);
  };

  return (
    <section 
      className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[720px] max-h-[88vh] overflow-hidden select-none border-b border-stone-800 bg-stone-950 group"
      aria-label="JP Farms Real-Time Time of Day Rooster Showcase"
    >
      {/* 4 HIGH-RESOLUTION CROSSFADE SCENES (100% CLEAN VISUAL) */}
      {TIME_BANNERS.map((banner, index) => {
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

      {/* TOP-LEFT AMBIENT TIME STATUS BADGE */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2.5 bg-stone-950/75 hover:bg-stone-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-stone-200 shadow-2xl transition duration-300">
        {isLiveMode ? (
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">LIVE FARM TIME</span>
          </span>
        ) : (
          <button 
            type="button" 
            onClick={handleSnapToLive}
            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold transition"
            title="Click to snap back to real-time"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold underline">Return to Live Time</span>
          </button>
        )}
        <div className="h-3 w-px bg-white/20" />
        <div className="flex items-center space-x-1.5 font-medium">
          <ActiveIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white font-semibold">{activeBanner.name}</span>
          <span className="hidden sm:inline text-stone-400 text-[11px]">({activeBanner.hoursLabel})</span>
        </div>
      </div>

      {/* SUBTLE LEFT & RIGHT HOVER ARROWS */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Time of Day"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/85 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronLeft className="w-6 h-6 text-amber-300" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Time of Day"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/85 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronRight className="w-6 h-6 text-amber-300" />
      </button>

      {/* BOTTOM-CENTER "TIME OF DAY CAPSULE" CONTROLLER */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1 sm:space-x-1.5 p-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/15 shadow-2xl max-w-[95vw] overflow-x-auto">
        
        {/* Real-Time Live Button */}
        <button
          type="button"
          onClick={handleSnapToLive}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            isLiveMode && !isAutoTour
              ? 'bg-emerald-600 text-white shadow-[0_0_12px_#059669]'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title="Sync with current real-world time"
        >
          <span className={`w-2 h-2 rounded-full ${isLiveMode && !isAutoTour ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
          <span>Live</span>
        </button>

        <div className="h-4 w-px bg-white/15 mx-0.5" />

        {/* 4 Time Slots (Morning, Midday, Evening, Night) */}
        {TIME_BANNERS.map((slot, index) => {
          const isSelected = index === currentIndex;
          const SlotIcon = slot.icon;
          const isActuallyCurrent = index === liveIndex;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleSelectTime(index)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-[0_0_14px_#f59e0b]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title={`${slot.name} (${slot.hoursLabel})`}
            >
              <SlotIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-amber-400'}`} />
              <span className="hidden md:inline">{slot.shortLabel}</span>
              {isActuallyCurrent && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Current Time" />
              )}
            </button>
          );
        })}

        <div className="h-4 w-px bg-white/15 mx-0.5" />

        {/* Auto Tour Toggle (15s slide across the whole day) */}
        <button
          type="button"
          onClick={toggleAutoTour}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            isAutoTour
              ? 'bg-amber-400 text-stone-950 shadow-[0_0_12px_#f59e0b]'
              : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'
          }`}
          title="Automatically tour all 4 times of day every 15 seconds"
        >
          {isAutoTour ? <Pause className="w-3 h-3 fill-stone-950" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline">Tour 15s</span>
        </button>
      </div>
    </section>
  );
};
