'use client';

import React from 'react';

interface PixarRoosterBanner3DProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const PixarRoosterBanner3D: React.FC<PixarRoosterBanner3DProps> = () => {
  return (
    <section 
      className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[720px] max-h-[88vh] overflow-hidden select-none border-b border-stone-800 bg-stone-950"
    >
      {/* TOTAL SCREEN HERO BANNER IMAGE (100% CLEAN VISUAL - NO WORDS OR BUTTONS) */}
      <img
        src="/banners/main_hero_banner.jpg"
        alt="JP Farms Heritage Rooster Banner"
        loading="eager"
        fetchPriority="high"
        className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04]"
      />
    </section>
  );
};
