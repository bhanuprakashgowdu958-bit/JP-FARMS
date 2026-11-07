'use client';

import React from 'react';
import { 
  Sparkles, 
  PlayCircle, 
  Calendar, 
  Award, 
  Flame, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Feather,
  Sun,
  Eye,
  MessageCircle
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface ColorfulShowcaseBannerProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const ColorfulShowcaseBanner: React.FC<ColorfulShowcaseBannerProps> = ({
  onOpenReels,
  onScheduleVisit,
}) => {
  const whatsAppBannerUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms! 🐓 I saw the Grand Heritage Showcase Banner on your website and would like to arrange a farm visit to see your roosters.',
  });

  const TICKER_ITEMS = [
    { text: '100% Pure Bloodline Guarantee', icon: Award, color: 'text-amber-300' },
    { text: 'Organic Sprouted Bajra & Almond Diet', icon: Sun, color: 'text-emerald-300' },
    { text: 'Complete Avian Veterinary Cards', icon: ShieldCheck, color: 'text-cyan-300' },
    { text: 'Unfiltered HD Stance Videos on Rooster TV', icon: PlayCircle, color: 'text-rose-300' },
    { text: 'Open-Range Pastures & Natural Sun', icon: Feather, color: 'text-yellow-300' },
    { text: 'Farm Open for Visitors 7:00 AM - 7:00 PM Daily', icon: MapPin, color: 'text-violet-300' },
  ];

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white border-y border-stone-800">
      
      {/* Top Jewel-Tone Spectrum Gradient Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-600 animate-gradient-pan"></div>

      {/* Dynamic Multi-Color Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Amber-Gold Orb Left */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"></div>
        {/* Emerald Orb Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-emerald-500/15 blur-3xl"></div>
        {/* Violet-Ruby Orb Right */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"></div>
        {/* Subtle Overlay Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Header & Announcement Pill */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-950/40">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300">
              GRAND LIVING AVIAN EXHIBITION • 2026
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Celebrate the Royal Strength of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">
              India&apos;s Purest Desi Roosters
            </span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From towering <strong>Sindhi Heavyweights</strong> to radiant <strong>Peela Aseels</strong> and jet-black <strong>Jhabua Kadaknaths</strong>, explore authentic indigenous bloodlines maintained in unpolluted natural pasture.
          </p>

        </div>

        {/* 4 Colorful Breed Cards Spectrum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
          
          {/* Card 1: Pure Peela Aseel (Golden Amber) */}
          <div className="group relative rounded-2xl p-5 bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/40 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30 group-hover:scale-110 transition">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              👑 Champion Strains
            </span>
            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-amber-300 transition">
              Pure Peela Aseel
            </h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              26&quot; upright posture with golden-yellow and bright fiery plumage. Broad bone density and compact pea comb.
            </p>
            <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-amber-400 font-semibold">
              <span>Weight: 3.8+ Kg</span>
              <span>Heritage Pure</span>
            </div>
          </div>

          {/* Card 2: Pure Kadaknath (Electric Violet & Jet Black) */}
          <div className="group relative rounded-2xl p-5 bg-gradient-to-br from-purple-950/40 via-stone-900 to-stone-950 border border-purple-500/40 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/30 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🌿 High Medicinal Melanin
            </span>
            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-purple-300 transition">
              Jhabua Kadaknath
            </h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              100% black skin, tongue, and bones with green-purple iridescent luster. Outstanding disease resistance.
            </p>
            <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-purple-400 font-semibold">
              <span>Weight: 2.4+ Kg</span>
              <span>Zero Chemicals</span>
            </div>
          </div>

          {/* Card 3: Aseel Kagar (Emerald Sheen) */}
          <div className="group relative rounded-2xl p-5 bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ⭐ Primary Farm Studs
            </span>
            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-emerald-300 transition">
              Aseel Kagar Studs
            </h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Heavyweight studs with tight walnut comb, deep metallic green gloss, and fearless muscular posture.
            </p>
            <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
              <span>Weight: 4.1+ Kg</span>
              <span>Deccan Bloodline</span>
            </div>
          </div>

          {/* Card 4: Sindhi Heavy Aseel (Crimson Ruby) */}
          <div className="group relative rounded-2xl p-5 bg-gradient-to-br from-rose-950/40 via-stone-900 to-stone-950 border border-rose-500/40 hover:border-rose-400 transition-all duration-300 shadow-lg hover:shadow-rose-500/20 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/30 group-hover:scale-110 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              🔥 Giant Tall Stature
            </span>
            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-rose-300 transition">
              Sindhi Heavy Aseel
            </h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Towering 28.5&quot; height with elongated muscular neck, pearl eyes, and deep resonant crowing sound.
            </p>
            <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-rose-400 font-semibold">
              <span>Height: 28.5 Inches</span>
              <span>Regal Posture</span>
            </div>
          </div>

        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-10">
          
          {/* Schedule Visit Button */}
          {onScheduleVisit && (
            <button
              type="button"
              onClick={onScheduleVisit}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>Schedule VIP Farm Visit</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}

          {/* Watch Rooster TV */}
          {onOpenReels && (
            <button
              type="button"
              onClick={onOpenReels}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white font-bold text-sm border border-stone-700/80 hover:border-amber-400/50 backdrop-blur-md transition-all duration-200"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Watch JP Rooster TV Reels</span>
            </button>
          )}

          {/* WhatsApp Direct */}
          <a
            href={whatsAppBannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

        </div>

      </div>

      {/* Bottom Continuous Colorful Marquee Strip */}
      <div className="bg-stone-900/90 border-t border-stone-800 py-2.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-300">
                <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                <span>{item.text}</span>
                <span className="text-stone-600 pl-4">•</span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

