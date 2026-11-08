'use client';

import React from 'react';
import { 
  PlayCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Sun, 
  Feather, 
  MapPin, 
  Sparkles, 
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

interface HeroProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
  birdsCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReels, onScheduleVisit, birdsCount = 7 }) => {
  return (
    <section className="relative bg-gradient-to-b from-sky-50 via-sky-100/30 to-white text-slate-800 overflow-hidden border-b border-sky-100">
      
      {/* Subtle Sky Decorative Cloud & Glow Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-amber-100/40 blur-3xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        
        {/* Main Header / Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          
          {/* Overline Badge */}
          <div className="inline-flex items-center space-x-2 bg-sky-100/90 border border-sky-200 px-4 py-1.5 rounded-full text-xs font-bold text-sky-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="tracking-wide uppercase">
              INDIA&apos;S PREMIER HERITAGE AVIAN ESTATE • EST. 2016
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Preserving the Ancient Majesty of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-amber-600">
              Pure Indian Bloodlines
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Welcome to the official online sanctuary of <strong>JP Farms</strong>. We conserve pure Indian Aseel, Kadaknath, and indigenous gamefowl — raised under open morning skies on traditional sprouted grain diets, with <strong>unfiltered 4K walking videos</strong> for complete transparency.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            
            {/* Primary CTA: Explore Gallery */}
            <a
              href="#showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-sky-600/25 hover:scale-105 active:scale-95 transition-all text-sm"
            >
              <span>Explore Rooster Gallery</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-mono font-bold">
                {birdsCount} Strains
              </span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>

            {/* Secondary CTA: Watch Rooster TV */}
            {onOpenReels && (
              <button
                type="button"
                onClick={onOpenReels}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-sky-50/80 text-sky-800 font-bold px-6 py-3.5 rounded-xl border border-sky-200 shadow-sm hover:border-sky-300 transition-all text-sm group"
              >
                <PlayCircle className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                <span>Watch Rooster TV (Reels)</span>
                <span className="bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                  HD
                </span>
              </button>
            )}

            {/* Tertiary CTA: Schedule Visit */}
            {onScheduleVisit && (
              <button
                type="button"
                onClick={onScheduleVisit}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 font-bold px-5 py-3.5 rounded-xl border border-amber-300/80 transition-all text-sm"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Schedule Farm Visit</span>
              </button>
            )}

          </div>

        </div>

        {/* 4 Pillar Trust Cards (Luxury Frosted Sky Glass) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 sm:mt-16">
          
          {/* Pillar 1: Pure Bloodlines */}
          <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Award className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition">
              100% Pure Bloodlines
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Authentic Aseel Peela, Kagar, and Sindhi lines preserved across generations without industrial cross-breeding.
            </p>
            <div className="mt-3 pt-3 border-t border-sky-50 flex items-center text-[11px] font-semibold text-sky-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>Verifiable Pedigree</span>
            </div>
          </div>

          {/* Pillar 2: Open Sun Pastures */}
          <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Sun className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition">
              Free-Range Sun Pastures
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Birds roam naturally across grassy paddocks soaking unpolluted countryside breeze and natural vitamin D3.
            </p>
            <div className="mt-3 pt-3 border-t border-sky-50 flex items-center text-[11px] font-semibold text-amber-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>Zero Cramped Cages</span>
            </div>
          </div>

          {/* Pillar 3: Sprouted Bajra & Herbal Diet */}
          <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Feather className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Sprouted Bajra & Almonds
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Traditional high-energy organic conditioning: sprouted pearl millet, almonds, garlic greens, and mineral oyster shells.
            </p>
            <div className="mt-3 pt-3 border-t border-sky-50 flex items-center text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>0% Commercial Steroids</span>
            </div>
          </div>

          {/* Pillar 4: HD Video Documentation */}
          <div className="bg-white/85 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition">
              Unfiltered 4K Stance Proof
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Inspect walking gait, bone thickness, comb anatomy, and alert demeanor in high-definition video reels before visiting.
            </p>
            <div className="mt-3 pt-3 border-t border-sky-50 flex items-center text-[11px] font-semibold text-purple-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>100% Real Live Footage</span>
            </div>
          </div>

        </div>

        {/* Bottom Real-Time Estate Assurance Bar */}
        <div className="mt-10 pt-6 border-t border-sky-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Estate Open Today:</span>
            <span>7:00 AM – 7:00 PM (Visiting hours)</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Ranikhet & Fowl Pox Vaccinated</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Direct Breeder-to-Breeder Guidance</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
