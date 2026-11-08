'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  Clock
} from 'lucide-react';

export type TimeSlotKey = 'morning' | 'midday' | 'evening' | 'night';

export interface BannerItem {
  id: string;
  src: string;
  alt: string;
  title: string;
}

export interface TimeSlotConfig {
  key: TimeSlotKey;
  title: string;
  shortLabel: string;
  hoursLabel: string;
  greeting: string;
  badge: string;
  icon: typeof Sunrise;
  color: string;
  matchHour: (hour: number) => boolean;
  banners: BannerItem[];
}

export const TIME_SLOTS: Record<TimeSlotKey, TimeSlotConfig> = {
  morning: {
    key: 'morning',
    title: 'Morning Dawn',
    shortLabel: 'Morning',
    hoursLabel: '6:00 AM – 11:00 AM',
    greeting: 'Good Morning from JP Farms 🌅',
    badge: 'Morning Sunrise & Rooster Awakening',
    icon: Sunrise,
    color: 'from-amber-400 to-orange-500',
    matchHour: (h) => h >= 6 && h < 11,
    banners: [
      {
        id: 'morning-1',
        src: '/banners/morning_1_sunrise_crow.jpg',
        alt: 'Morning Sunrise Crow with 3D Smiling Sun',
        title: 'Morning Crow & Smiling Sun',
      },
      {
        id: 'morning-2',
        src: '/banners/morning_2_fence_feeding.jpg',
        alt: 'Morning Rooster on Fence Eating Grains',
        title: 'Fence Breakfast & Valley Sunrise',
      },
      {
        id: 'morning-3',
        src: '/banners/morning_3_pasture_dawn.jpg',
        alt: 'Morning Farm Pasture at First Light',
        title: 'First Light Over the Farm Pastures',
      },
    ],
  },
  midday: {
    key: 'midday',
    title: 'Sunny Midday',
    shortLabel: 'Midday',
    hoursLabel: '11:00 AM – 5:00 PM',
    greeting: 'Good Afternoon from JP Farms ☀️',
    badge: 'Free-Range Foraging & Pasture Grazing',
    icon: Sun,
    color: 'from-yellow-400 to-amber-500',
    matchHour: (h) => h >= 11 && h < 17,
    banners: [
      {
        id: 'midday-1',
        src: '/banners/banner_rainbow_wings_crow.jpg',
        alt: 'Triumphant Rooster Crowing with Open Wings Under Farm Rainbow',
        title: 'Triumphant Crow & Farm Rainbow',
      },
      {
        id: 'midday-2',
        src: '/banners/midday_1_chicks_pasture.jpg',
        alt: 'Rooster Guiding Fluffy Chicks Across Clover Meadow',
        title: 'Free-Range Clover Pasture with Chicks',
      },
      {
        id: 'midday-3',
        src: '/banners/midday_3_peela_champion.jpg',
        alt: 'Champion Peela Aseel on Ancient Stone Gate in Noon Sun',
        title: 'Alpha Champion on Ancient Stone Gate',
      },
      {
        id: 'midday-4',
        src: '/banners/midday_4_farm_stream.jpg',
        alt: 'Rooster by Sparkling Freshwater Farm Stream',
        title: 'Sparkling Farm Stream & Willows',
      },
    ],
  },
  evening: {
    key: 'evening',
    title: 'Golden Sunset',
    shortLabel: 'Evening',
    hoursLabel: '5:00 PM – 8:30 PM',
    greeting: 'Good Evening from JP Farms 🌇',
    badge: 'Golden Hour & Evening Roosting',
    icon: Sunset,
    color: 'from-orange-500 to-rose-600',
    matchHour: (h) => h >= 17 && h < 20.5,
    banners: [
      {
        id: 'evening-1',
        src: '/banners/evening_1_sunset_wagon.jpg',
        alt: 'Rooster on Hay Wagon with Handcrafted JP Farms Sign',
        title: 'Sunset Hay Wagon & JP Farms Sign',
      },
      {
        id: 'evening-2',
        src: '/banners/evening_2_sunset_fence.jpg',
        alt: 'Majestic Rooster on Top Rail of Fence at Sunset',
        title: 'Sunset Over the Rolling Pastures',
      },
      {
        id: 'evening-3',
        src: '/banners/banner_royal_peela_aseel.jpg',
        alt: 'Royal Golden Peela Aseel on Rustic Fence at Sunset',
        title: 'Royal Peela Aseel in Sunset Glow',
      },
    ],
  },
  night: {
    key: 'night',
    title: 'Starlit Night',
    shortLabel: 'Night',
    hoursLabel: '8:30 PM – 6:00 AM',
    greeting: 'Peaceful Night at JP Farms 🌙',
    badge: 'Tranquil Roosting Hours & Fireflies',
    icon: Moon,
    color: 'from-indigo-400 to-purple-500',
    matchHour: (h) => h >= 20.5 || h < 6,
    banners: [
      {
        id: 'night-1',
        src: '/banners/night_1_twilight_fireflies.jpg',
        alt: 'Crescent Moon with Floating Golden Fireflies and Lantern',
        title: 'Crescent Moon & Floating Fireflies',
      },
      {
        id: 'night-2',
        src: '/banners/night_2_black_kadaknath.jpg',
        alt: 'Iridescent Black Kadaknath on Moonlit Stone Ledge',
        title: 'Midnight Emerald Black Kadaknath',
      },
    ],
  },
};

const AUTO_SLIDE_INTERVAL = 15000; // 15 seconds per banner

interface PixarRoosterBanner3DProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const PixarRoosterBanner3D: React.FC<PixarRoosterBanner3DProps> = () => {
  // Determine time slot from user's local clock
  const getLiveSlotKey = useCallback((): TimeSlotKey => {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    const keys = Object.keys(TIME_SLOTS) as TimeSlotKey[];
    const match = keys.find((k) => TIME_SLOTS[k].matchHour(hour));
    return match || 'morning';
  }, []);

  const [activeSlotKey, setActiveSlotKey] = useState<TimeSlotKey>('night');
  const [liveSlotKey, setLiveSlotKey] = useState<TimeSlotKey>('night');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Sync with real-time hour on client mount
  useEffect(() => {
    const liveKey = getLiveSlotKey();
    setLiveSlotKey(liveKey);
    setActiveSlotKey(liveKey);

    // Check time every minute
    const interval = setInterval(() => {
      const updated = getLiveSlotKey();
      setLiveSlotKey(updated);
      if (isLiveMode) {
        setActiveSlotKey(updated);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [getLiveSlotKey, isLiveMode]);

  // Active time slot config & banners (each strictly unique)
  const currentSlot = TIME_SLOTS[activeSlotKey];
  const banners = currentSlot.banners;
  const ActiveIcon = currentSlot.icon;

  // Auto-slide every 15 seconds through the unique banners of the active time slot
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [banners.length, slideIndex, activeSlotKey]);

  const nextBanner = () => {
    setSlideIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setSlideIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleSelectSlot = (slotKey: TimeSlotKey) => {
    setActiveSlotKey(slotKey);
    setSlideIndex(0);
    setIsLiveMode(slotKey === liveSlotKey);
  };

  const handleSnapToLive = () => {
    setActiveSlotKey(liveSlotKey);
    setSlideIndex(0);
    setIsLiveMode(true);
  };

  return (
    <section 
      className="w-full bg-[#f4f9fd] pt-3 sm:pt-5 pb-3 border-b border-sky-100"
      aria-label={`JP Farms ${currentSlot.title} Rooster Showcase`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* AMAZON / FLIPKART STYLE HERO BANNER CONTAINER */}
        <div className="relative w-full h-[220px] sm:h-[320px] md:h-[390px] lg:h-[450px] xl:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden select-none border border-sky-200/80 shadow-lg shadow-sky-950/5 bg-slate-900 group">
          
          {/* 100% UNIQUE HIGH-RESOLUTION CROSSFADE BANNERS */}
          {banners.map((banner, index) => {
            const isActive = index === slideIndex;
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
                  className={`w-full h-full object-cover object-[center_35%] filter brightness-[1.02] contrast-[1.04] transition-transform duration-[15000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* TOP-LEFT AMBIENT REAL-TIME BADGE */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center space-x-2 bg-white/90 hover:bg-white backdrop-blur-md px-3 py-1 rounded-full border border-sky-200/80 text-[11px] text-slate-800 shadow-md transition duration-300">
            {isLiveMode ? (
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-[9px]">LIVE</span>
              </span>
            ) : (
              <button 
                type="button" 
                onClick={handleSnapToLive}
                className="flex items-center space-x-1 text-sky-700 hover:text-sky-900 font-semibold transition"
                title="Click to snap back to real-time"
              >
                <Clock className="w-3 h-3 text-sky-600" />
                <span className="text-[9px] uppercase font-bold underline">Return to Live</span>
              </button>
            )}

            <div className="h-2.5 w-px bg-slate-200" />

            <div className="flex items-center space-x-1.5 font-medium">
              <ActiveIcon className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-900 font-bold">{currentSlot.title}</span>
              <span className="text-sky-700 text-[10px] font-mono font-bold">({slideIndex + 1}/{banners.length})</span>
            </div>
          </div>

          {/* FLIPKART / AMAZON STYLE CIRCULAR NAVIGATION ARROWS */}
          <button
            type="button"
            onClick={prevBanner}
            aria-label="Previous Banner"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-sky-100 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={nextBanner}
            aria-label="Next Banner"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-sky-100 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
          </button>

          {/* BOTTOM-CENTER SLIDE DOTS (Amazon / Flipkart Style) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md">
            {banners.map((banner, index) => {
              const isActive = index === slideIndex;
              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Show ${currentSlot.shortLabel} banner ${index + 1}`}
                  title={banner.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-5 sm:w-6 bg-white shadow-sm' 
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              );
            })}
            <span className="text-[9px] font-mono text-white/90 pl-1">15s auto</span>
          </div>

        </div>

        {/* TIME OF DAY SWITCHER PILL BAR (Flipkart Category Rail Style - Below Banner) */}
        <div className="flex items-center justify-center mt-3">
          <div className="flex items-center space-x-1 sm:space-x-1.5 p-1 rounded-full bg-white border border-sky-200/90 shadow-sm max-w-full overflow-x-auto">
            
            {/* Real-Time Live Button */}
            <button
              type="button"
              onClick={handleSnapToLive}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                isLiveMode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
              }`}
              title="Snap to current real-world time"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
              <span>Live</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* 4 Time Slots (Morning, Midday, Evening, Night) */}
            {(['morning', 'midday', 'evening', 'night'] as TimeSlotKey[]).map((slotKey) => {
              const slot = TIME_SLOTS[slotKey];
              const isSelected = slotKey === activeSlotKey;
              const SlotIcon = slot.icon;
              const isActuallyLive = slotKey === liveSlotKey;

              return (
                <button
                  key={slotKey}
                  type="button"
                  onClick={() => handleSelectSlot(slotKey)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white font-bold shadow-md shadow-sky-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
                  }`}
                  title={`${slot.title} (${slot.hoursLabel}) - ${slot.banners.length} Unique Banners`}
                >
                  <SlotIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                  <span>{slot.shortLabel}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'}`}>
                    {slot.banners.length}
                  </span>
                  {isActuallyLive && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="Currently Live Time" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
