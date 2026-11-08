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
      {
        id: 'morning-4',
        src: '/banners/banner_alpha_warrior_staredown.jpg',
        alt: 'Alpha Warrior Staredown: Golden Peela vs Emerald Kagar Aseel',
        title: 'Alpha Warrior Staredown & Morning Sunbeams',
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
        src: '/banners/banner_alpha_warrior_staredown.jpg',
        alt: 'Alpha Warrior Staredown: Golden Peela vs Emerald Kagar Aseel in Sunlit Pasture',
        title: 'Alpha Warrior Staredown Face-Off',
      },
      {
        id: 'midday-3',
        src: '/banners/midday_1_chicks_pasture.jpg',
        alt: 'Rooster Guiding Fluffy Chicks Across Clover Meadow',
        title: 'Free-Range Clover Pasture with Chicks',
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
      className="relative w-full overflow-hidden select-none bg-slate-950 group"
      aria-label={`JP Farms ${currentSlot.title} Rooster Showcase`}
    >
      {/* 100% FULL-BLEED EDGE-TO-EDGE BANNERS (Auto-adjusting ratio: 16:10 on Mobile, 2.7:1 on Desktop) */}
      <div 
        className="relative w-full overflow-hidden aspect-[16/10] sm:aspect-[2.7/1] min-h-[220px] sm:min-h-0"
      >
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

        {/* AMAZON-STYLE SOFT BOTTOM GRADIENT BLEND INTO SKY-BLUE BACKGROUND */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-[#f4f9fd] via-[#f4f9fd]/30 to-transparent pointer-events-none z-10" />

        {/* FULL-BLEED EDGE NAVIGATION ARROWS (AMAZON STYLE) */}
        <button
          type="button"
          onClick={prevBanner}
          aria-label="Previous Banner"
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg sm:shadow-xl border border-sky-100/80 flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-slate-700" />
        </button>

        <button
          type="button"
          onClick={nextBanner}
          aria-label="Next Banner"
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg sm:shadow-xl border border-sky-100/80 flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-slate-700" />
        </button>

      </div>
    </section>
  );
};
