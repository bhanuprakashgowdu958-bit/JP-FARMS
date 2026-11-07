'use client';

import React from 'react';
import { PlayCircle, ShieldCheck, CheckCircle2, Truck, ArrowRight, Award, Flame, Eye } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

interface HeroProps {
  onOpenReels?: () => void;
  availableCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReels, availableCount = 6 }) => {
  return (
    <section className="relative rooster-hero-mesh text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Farm Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>FRESH 2026 MATURE CHAMPION ROOSTERS READY FOR DISPATCH</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              India&apos;s Finest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Pure Bloodline Desi & Aseel
              </span>{' '}
              Roosters
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Every rooster at <strong>JP Farms</strong> is individually tagged, naturally fed with sprouted grains, fully vaccinated, and showcased with <strong>HD walking & stance videos</strong>. Reserve your pure champion breed online with safe all-India live transit.
            </p>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Pure Bloodline</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>HD Live Video Proof</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Vaccine Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Safe AC / Train Transit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Antibiotics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Farm Pickup</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-amber-950/50 hover:shadow-amber-500/20 transition-all duration-200 text-base"
              >
                <span>View Available Roosters</span>
                <span className="bg-stone-950/20 text-stone-950 px-2 py-0.5 rounded text-xs">
                  {availableCount} In Stock
                </span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenReels}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-stone-900/90 hover:bg-stone-800 text-white font-semibold px-6 py-4 rounded-xl border border-stone-700 hover:border-amber-500/50 transition-all text-base group"
              >
                <PlayCircle className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <span>Watch Video Reels TV</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Reels
                </span>
              </button>
            </div>

            {/* Trust Quote / Guarantee */}
            <div className="pt-2 flex items-center justify-center lg:justify-start space-x-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{FARM_INFO.guaranteeText}</span>
            </div>
          </div>

          {/* Right Column: Featured Rooster Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-600 to-emerald-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000"></div>

              {/* Card Container */}
              <div className="relative bg-stone-900/95 border border-stone-700/80 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Image Banner */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80"
                    alt="Featured Pure Aseel Peela Rooster"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-stone-950/90 backdrop-blur-md text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/40">
                      TAG: JP-AS-101
                    </span>
                    <span className="bg-emerald-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>AVAILABLE</span>
                    </span>
                  </div>

                  {/* Play Video Trigger Button */}
                  <button
                    onClick={onOpenReels}
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition"
                    title="Play Rooster Video"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:bg-amber-600 transition">
                      <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                    </div>
                  </button>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Featured Breed</p>
                      <h3 className="text-xl font-bold text-white">Sikandar • Pure Peela Aseel</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 line-through">₹10,000</p>
                      <p className="text-xl font-extrabold text-amber-400">₹8,500</p>
                    </div>
                  </div>
                </div>

                {/* Specs Pill Grid */}
                <div className="p-4 grid grid-cols-3 gap-2 bg-stone-950/70 border-t border-stone-800 text-center text-xs">
                  <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                    <p className="text-stone-400 text-[10px] uppercase font-semibold">Weight</p>
                    <p className="font-bold text-stone-100">3.85 Kg</p>
                  </div>
                  <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                    <p className="text-stone-400 text-[10px] uppercase font-semibold">Age</p>
                    <p className="font-bold text-stone-100">14 Months</p>
                  </div>
                  <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                    <p className="text-stone-400 text-[10px] uppercase font-semibold">Height</p>
                    <p className="font-bold text-stone-100">26 Inches</p>
                  </div>
                </div>

                {/* Micro CTA Footer */}
                <div className="p-3 bg-stone-900 flex items-center justify-between border-t border-stone-800">
                  <span className="text-xs text-stone-300 flex items-center">
                    <Award className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                    Championship Garuda Bloodline
                  </span>
                  <a
                    href="#catalog"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center"
                  >
                    <span>View Bird Details</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-400">3,450+</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Roosters Safely Delivered</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">100%</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Verified Pure Bloodline</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-400">18+ States</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">All-India Pet Transit Hubs</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-stone-100">9+ Years</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Heritage Breeding Legacy</p>
          </div>
        </div>

      </div>
    </section>
  );
};
