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
  filterClass?: string;
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
      {
        id: 'morning-4',
        src: '/banners/morning_4_royal_peela.jpg',
        alt: 'Royal Peela Aseel Rooster with Morning Sunflowers',
        title: 'Royal Peela Aseel in Morning Sun',
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
        src: '/banners/midday_1_chicks_pasture.jpg',
        alt: 'Rooster Guiding Fluffy Chicks Across Clover Meadow',
        title: 'Free-Range Clover Pasture with Chicks',
      },
      {
        id: 'midday-2',
        src: '/banners/midday_2_meadow_feeding.jpg',
        alt: 'Single Heritage Rooster on Wooden Fence in Sunlit Valley',
        title: 'Sunlit Fence Breakfast & Valley View',
      },
      {
        id: 'midday-3',
        src: '/banners/midday_3_peela_champion.jpg',
        alt: 'Champion Peela Aseel on Ancient Stone Gate',
        title: 'Warrior Pedigree in High Noon Sun',
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
        alt: 'Rooster on Hay Wagon with JP Farms Sign',
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
        src: '/banners/evening_3_golden_panorama.jpg',
        alt: 'Royal Golden Peela Aseel Rooster on Rustic Fence at Sunset',
        title: 'Royal Peela Aseel in Golden Sunset Glow',
      },
      {
        id: 'evening-4',
        src: '/banners/evening_4_sunset_showcase.jpg',
        alt: 'Heritage Rooster Crowing on Farm Cart at Sunset',
        title: 'Sunset Heritage Crow & Warm Skies',
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
        alt: 'Iridescent Black Kadaknath on Stone Ledge at Night',
        title: 'Midnight Emerald Black Kadaknath',
      },
      {
        id: 'night-3',
        src: '/banners/night_3_moonlit_roost.jpg',
        alt: 'Moonlit Heritage Rooster Resting on Fence',
        title: 'Moonlit Roost on the Wooden Fence',
        filterClass: 'brightness-[0.7] hue-rotate-[195deg] saturate-[1.15] contrast-[1.1]',
      },
      {
        id: 'night-4',
        src: '/banners/night_4_midnight_pasture.jpg',
        alt: 'Peaceful Nocturnal Farm Pasture Under Moonbeams',
        title: 'Midnight Pasture & Quiet Farmhouse',
        filterClass: 'brightness-[0.68] hue-rotate-[195deg] saturate-[1.1] contrast-[1.1]',
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
  const [slideIndex, setSlideIndex] = useState(0); // 0 to 3
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

  // Active time slot config & banners (always exactly 4 banners)
  const currentSlot = TIME_SLOTS[activeSlotKey];
  const banners = currentSlot.banners;
  const ActiveIcon = currentSlot.icon;

  // Auto-slide every 15 seconds through the 4 banners of the active time slot
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
      className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[720px] max-h-[88vh] overflow-hidden select-none border-b border-stone-800 bg-stone-950 group"
      aria-label={`JP Farms ${currentSlot.title} Rooster Showcase`}
    >
      {/* 4 HIGH-RESOLUTION CROSSFADE BANNERS FOR ACTIVE TIME SLOT */}
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
              className={`w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04] ${
                banner.filterClass || ''
              }`}
            />
          </div>
        );
      })}

      {/* TOP-LEFT AMBIENT REAL-TIME BADGE */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2.5 bg-stone-950/80 hover:bg-stone-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-stone-200 shadow-2xl transition duration-300">
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
            <span className="text-[10px] uppercase font-bold underline">Return to Live</span>
          </button>
        )}

        <div className="h-3 w-px bg-white/20" />

        <div className="flex items-center space-x-1.5 font-medium">
          <ActiveIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white font-semibold">{currentSlot.title}</span>
          <span className="text-amber-300 text-[11px] font-mono">({slideIndex + 1}/4)</span>
          <span className="hidden sm:inline text-stone-400 text-[11px]">({currentSlot.hoursLabel})</span>
        </div>
      </div>

      {/* SUBTLE LEFT & RIGHT HOVER ARROWS */}
      <button
        type="button"
        onClick={prevBanner}
        aria-label="Previous Banner"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/85 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronLeft className="w-6 h-6 text-amber-300" />
      </button>

      <button
        type="button"
        onClick={nextBanner}
        aria-label="Next Banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-950/40 hover:bg-stone-950/85 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <ChevronRight className="w-6 h-6 text-amber-300" />
      </button>

      {/* BOTTOM-CENTER CONTROLLER (TIME SLOTS + 4 SLIDE DOTS + 15S INDICATOR) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
        
        {/* Active Slot's 4 Banner Slide Dots */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-950/60 backdrop-blur-md border border-white/10 shadow-lg">
          {banners.map((banner, index) => {
            const isActive = index === slideIndex;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => setSlideIndex(index)}
                aria-label={`Show ${currentSlot.shortLabel} banner ${index + 1}`}
                title={banner.title}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isActive 
                    ? 'w-6 bg-amber-400 shadow-[0_0_8px_#f59e0b]' 
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
          <span className="text-[9px] font-mono text-stone-400 pl-1">15s auto</span>
        </div>

        {/* 4 Time Slot Selection Pills */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 p-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-white/15 shadow-2xl max-w-[95vw] overflow-x-auto">
          
          {/* Real-Time Live Button */}
          <button
            type="button"
            onClick={handleSnapToLive}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              isLiveMode
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_#059669]'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title="Snap to current real-world time"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
            <span>Live</span>
          </button>

          <div className="h-4 w-px bg-white/15 mx-0.5" />

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
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-[0_0_14px_#f59e0b]'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
                title={`${slot.title} (${slot.hoursLabel}) - 4 Banners`}
              >
                <SlotIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-amber-400'}`} />
                <span>{slot.shortLabel}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-stone-950/20 text-stone-950' : 'bg-white/10 text-stone-400'}`}>
                  4
                </span>
                {isActuallyLive && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" title="Currently Live Time" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
