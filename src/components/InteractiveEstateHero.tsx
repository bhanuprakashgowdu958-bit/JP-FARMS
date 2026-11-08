'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Sun, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  PlayCircle, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Feather, 
  Volume2, 
  Scale, 
  Ruler, 
  HeartHandshake,
  MessageCircle,
  Clock
} from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface InteractiveEstateHeroProps {
  roosters: Rooster[];
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
  onSelectRooster?: (rooster: Rooster) => void;
}

interface BreedShowcaseData {
  id: string;
  breedKey: string;
  tabLabel: string;
  badge: string;
  name: string;
  tagId: string;
  lineage: string;
  description: string;
  height: string;
  weight: string;
  comb: string;
  diet: string;
  image: string;
  accentColor: string;
  borderColor: string;
  tagBg: string;
  tagText: string;
}

const FEATURED_BREEDS: BreedShowcaseData[] = [
  {
    id: 'peela-aseel',
    breedKey: 'aseel-peela',
    tabLabel: 'Pure Peela Aseel',
    badge: '👑 Royal Champion Line',
    name: 'Sikandar - Royal Peela Aseel',
    tagId: 'JP-AS-101',
    lineage: 'Direct Deccan Royal Bloodline • 7 Generations Preserved',
    description: 'Towering 26" upright warrior stance with fiery golden-orange neck hackles and a broad, heavy-boned muscular chest. Known for natural dominance and proud crowing.',
    height: '26.5 Inches',
    weight: '3.85 Kg',
    comb: 'Compact Pea Comb',
    diet: 'Sprouted Bajra & Crushed Almonds',
    image: '/banners/banner_rainbow_wings_crow.jpg',
    accentColor: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
    tagBg: 'bg-amber-100 text-amber-800 border-amber-200',
    tagText: 'text-amber-700',
  },
  {
    id: 'kadaknath',
    breedKey: 'kadaknath',
    tabLabel: 'Jhabua Kadaknath',
    badge: '🌿 High Melanin Purity',
    name: 'Kaal Bhairav - Pure Kadaknath',
    tagId: 'JP-KN-204',
    lineage: '100% DNA Pure Jhabua Lineage • Zero Cross-Breeding',
    description: 'Deep iridescent green and purple metallic luster over solid jet-black feathers. 100% black skin, beak, tongue, and bones with extraordinary natural disease resistance.',
    height: '21.5 Inches',
    weight: '2.40 Kg',
    comb: 'Blackened Pea Comb',
    diet: 'Organic Ragi Mash & Neem Greens',
    image: '/banners/night_2_black_kadaknath.jpg',
    accentColor: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
    tagBg: 'bg-purple-100 text-purple-800 border-purple-200',
    tagText: 'text-purple-700',
  },
  {
    id: 'aseel-kagar',
    breedKey: 'aseel-kagar',
    tabLabel: 'Aseel Kagar Stud',
    badge: '⭐ Primary Breeding Sire',
    name: 'Toofan - Heavyweight Kagar Stud',
    tagId: 'JP-KG-305',
    lineage: 'Son of Legendary "Kagar Badshah" • Deccan Heritage Line',
    description: 'Imposing heavyweight 4.1 Kg champion stud with deep coal-black plumage shining with a metallic emerald-green gloss. Thick white bone shanks and wide stance.',
    height: '27.5 Inches',
    weight: '4.10 Kg',
    comb: 'Tight Walnut Comb',
    diet: 'Soaked Wheat & Garlic Decoctions',
    image: '/banners/banner_alpha_warrior_staredown.jpg',
    accentColor: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    tagText: 'text-emerald-700',
  },
  {
    id: 'aseel-sindhi',
    breedKey: 'aseel-sindhi',
    tabLabel: 'Sindhi Heavy Aseel',
    badge: '🔥 Giant Tall Stature',
    name: 'Rustam - Sindhi Heavyweight',
    tagId: 'JP-SD-407',
    lineage: 'Western Valley Heritage Bloodline • Towering Lineage',
    description: 'Towering 28.5" standing height with an elongated muscular neck, pearl eyes, and a deep resonant crow. Majestic presence suited for large estate aviaries.',
    height: '28.5 Inches',
    weight: '4.35 Kg',
    comb: 'Compact Pea Comb',
    diet: 'Ayurvedic Bajra & Almond Paste',
    image: '/banners/midday_4_farm_stream.jpg',
    accentColor: 'from-rose-500 to-amber-600',
    borderColor: 'border-rose-400',
    tagBg: 'bg-rose-100 text-rose-800 border-rose-200',
    tagText: 'text-rose-700',
  },
];

export const InteractiveEstateHero: React.FC<InteractiveEstateHeroProps> = ({
  roosters,
  onOpenReels,
  onScheduleVisit,
  onSelectRooster,
}) => {
  const [selectedBreedIndex, setSelectedBreedIndex] = useState(0);
  const currentBreed = FEATURED_BREEDS[selectedBreedIndex];

  const whatsAppVisitUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓 I am exploring ${currentBreed.name} (${currentBreed.tagId}) on your interactive showcase and would like to schedule a farm visit to inspect the bird in person.`,
  });

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f0f9ff] via-[#f4f9fd] to-white border-b border-sky-100 pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-hidden">
      
      {/* Subtle Atmospheric Sky Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[550px] h-[550px] rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP HEADER: BRANDING & INTERACTIVE EXPLORER TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200/80 shadow-xs text-xs font-bold text-sky-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider">LIVING AVIAN CONSERVATION ESTATE • EST. 2016</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Experience the Living Majesty of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-700 to-amber-600">
              Pure Indian Gamefowl
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Select a heritage breed below to inspect verifiable biometric height, bone density, comb anatomy, and unfiltered 4K video proof.
          </p>

          {/* INTERACTIVE BREED SELECTOR PILL TABS */}
          <div className="pt-2 flex items-center justify-center">
            <div className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 rounded-2xl bg-white border border-sky-200/90 shadow-sm max-w-full overflow-x-auto">
              {FEATURED_BREEDS.map((breed, index) => {
                const isSelected = index === selectedBreedIndex;
                return (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => setSelectedBreedIndex(index)}
                    className={`flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/25 scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
                    }`}
                  >
                    <span>{breed.tabLabel}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN INTERACTIVE SPLIT STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-sky-100 shadow-xl shadow-sky-950/5">
          
          {/* LEFT COLUMN: EDITORIAL DETAILS & BIOMETRIC SPECS (48%) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tag, Badge & Bloodline */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${currentBreed.tagBg}`}>
                  {currentBreed.badge}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Tag: {currentBreed.tagId}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {currentBreed.name}
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-sky-700">
                {currentBreed.lineage}
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {currentBreed.description}
            </p>

            {/* 4 BIOMETRIC SPECIFICATION TILES */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Spec 1: Height */}
              <div className="bg-sky-50/60 border border-sky-100/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-sky-700 font-bold uppercase tracking-wider">
                  <Ruler className="w-3.5 h-3.5 text-sky-600" />
                  <span>Standing Height</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900">
                  {currentBreed.height}
                </div>
                <p className="text-[10px] text-slate-500">Upright Warrior Stance</p>
              </div>

              {/* Spec 2: Weight */}
              <div className="bg-sky-50/60 border border-sky-100/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-sky-700 font-bold uppercase tracking-wider">
                  <Scale className="w-3.5 h-3.5 text-sky-600" />
                  <span>Adult Weight</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900">
                  {currentBreed.weight}
                </div>
                <p className="text-[10px] text-slate-500">Dense Bone Structure</p>
              </div>

              {/* Spec 3: Comb Anatomy */}
              <div className="bg-sky-50/60 border border-sky-100/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-bold uppercase tracking-wider">
                  <Feather className="w-3.5 h-3.5 text-amber-600" />
                  <span>Comb Anatomy</span>
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {currentBreed.comb}
                </div>
                <p className="text-[10px] text-slate-500">Heritage Purebred Trait</p>
              </div>

              {/* Spec 4: Nutrition */}
              <div className="bg-sky-50/60 border border-sky-100/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  <Sun className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nutrition</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 truncate" title={currentBreed.diet}>
                  {currentBreed.diet}
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold">0% Commercial Steroids</p>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              
              {/* Primary: Schedule Visit */}
              <a
                href={whatsAppVisitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-sky-600/25 transition-all text-xs sm:text-sm active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Paddock Inspection</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              {/* Secondary: Watch Video Proof */}
              {onOpenReels && (
                <button
                  type="button"
                  onClick={onOpenReels}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-sky-50 hover:bg-sky-100/80 text-sky-800 font-bold px-5 py-3.5 rounded-xl border border-sky-200 transition-all text-xs sm:text-sm group"
                >
                  <PlayCircle className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                  <span>Watch 4K Stance Video</span>
                  <span className="bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    HD
                  </span>
                </button>
              )}

            </div>

            {/* Guarantee footer */}
            <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full pedigree lineage documentation & veterinary health card provided upon visit.</span>
            </div>

          </div>

          {/* RIGHT COLUMN: DYNAMIC MASTER 3D ARTWORK SHOWCASE (52%) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-sky-200/90 shadow-2xl bg-slate-900 group">
              <img
                key={currentBreed.id}
                src={currentBreed.image}
                alt={currentBreed.name}
                className="w-full h-full object-cover object-[center_35%] filter brightness-[1.03] contrast-[1.03] transition-all duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Sleek Master Metadata Strip Below the Frame (Zero Image Obstruction) */}
            <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-sky-200/80 shadow-xs text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono font-bold text-sky-800">{currentBreed.tagId}</span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-slate-800">{currentBreed.name}</span>
              </div>
              <div className="text-slate-500 font-medium hidden sm:block">
                Master 3D Avian Render • 100% Pure Bloodline
              </div>
            </div>
          </div>

        </div>

        {/* 3-TILE MODERN BENTO FEATURE GRID (FLIPKART / APPLE STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* Bento Tile 1: Live Farm Visiting Status */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm space-y-3 hover:border-sky-300 transition group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ● Open Today
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Paddock Tours Active
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visiting Hours: <strong>7:00 AM – 7:00 PM Daily</strong>
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Located on the NH 65 corridor. Direct guided tours of pure Aseel Peela, Kagar, and Kadaknath breeding paddocks.
            </p>

            <a
              href="#visit-guide"
              className="inline-flex items-center text-xs font-bold text-sky-700 hover:text-sky-900 transition pt-1"
            >
              <span>View Driving Highway Routes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Bento Tile 2: Rooster TV Shorts Proof */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm space-y-3 hover:border-sky-300 transition group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 group-hover:scale-110 transition">
                <PlayCircle className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                4K Unfiltered HD
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Rooster TV Video Reels
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unedited Walking Stance & Crowing Proof
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect bone thickness, comb anatomy, and proud demeanor in vertical HD video shorts before booking your visit.
            </p>

            <button
              type="button"
              onClick={onOpenReels}
              className="inline-flex items-center text-xs font-bold text-sky-700 hover:text-sky-900 transition pt-1"
            >
              <span>Watch Video Proofs Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Bento Tile 3: Certified Avian Bio-Security */}
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm space-y-3 hover:border-sky-300 transition group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                100% Certified Pure
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ayurvedic Nutrition & Care
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sprouted Bajra, Garlic & Almonds
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              0% commercial steroids or growth hormones. Complete 4-stage Ranikhet and Fowl Pox veterinary vaccination cards.
            </p>

            <a
              href="#biosecurity"
              className="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-900 transition pt-1"
            >
              <span>Explore Farm Care Standards</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

        </div>

      </div>

    </section>
  );
};
