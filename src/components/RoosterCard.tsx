'use client';

import React from 'react';
import { PlayCircle, MessageCircle, Eye, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface RoosterCardProps {
  rooster: Rooster;
  onSelect: (rooster: Rooster) => void;
  onOpenVideo?: (rooster: Rooster) => void;
  onInquire?: (rooster: Rooster) => void;
}

export const RoosterCard: React.FC<RoosterCardProps> = ({
  rooster,
  onSelect,
  onOpenVideo,
  onInquire,
}) => {
  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓 I am viewing Rooster #${rooster.tagId} (${rooster.name}, ${rooster.breed}) on your website. I would love to learn more about its bloodline and plan a farm visit.`,
  });

  const getBadgeStyle = (badge: Rooster['badge']) => {
    switch (badge) {
      case 'Champion Line':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md border border-amber-300';
      case 'Farm Stud':
        return 'bg-stone-900 text-amber-400 font-bold border border-amber-500/40 shadow-sm';
      case 'Heritage Pure':
        return 'bg-emerald-600 text-white font-bold shadow-sm';
      case 'Breeding Flock':
        return 'bg-blue-600 text-white font-bold shadow-sm';
      case 'Young Star':
        return 'bg-purple-600 text-white font-bold shadow-sm';
      default:
        return 'bg-stone-800 text-stone-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 hover:border-amber-500/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      
      {/* Top Image & Media Container */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 cursor-pointer" 
        onClick={() => onSelect(rooster)}
      >
        <img
          src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
          alt={rooster.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow">
            TAG: {rooster.tagId}
          </span>

          {/* Exhibition Badge */}
          <span className={`text-[11px] px-2.5 py-1 rounded-md flex items-center space-x-1 ${getBadgeStyle(rooster.badge)}`}>
            <Award className="w-3 h-3" />
            <span>{rooster.badge}</span>
          </span>
        </div>

        {/* Video Available Indicator Pill */}
        {rooster.videoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo ? onOpenVideo(rooster) : onSelect(rooster);
            }}
            className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-black/75 hover:bg-amber-600 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium border border-white/20 transition group/video"
          >
            <PlayCircle className="w-4 h-4 text-amber-400 group-hover/video:text-white" />
            <span>HD Stance Video</span>
          </button>
        )}

        {/* Breed Category Pill */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded bg-stone-950/80 text-stone-300 border border-stone-700">
            {rooster.breed.split('(')[0].trim()}
          </span>
        </div>
      </div>

      {/* Bird Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title & Breed */}
          <div>
            <h3 
              onClick={() => onSelect(rooster)}
              className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition cursor-pointer leading-snug line-clamp-1"
              title={rooster.name}
            >
              {rooster.name}
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">{rooster.breed}</p>
          </div>

          {/* Quick Biological Specifications Grid */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 py-2 px-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-center text-xs">
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold">Weight</p>
              <p className="font-semibold text-stone-800">{rooster.weight}</p>
            </div>
            <div className="border-x border-stone-200">
              <p className="text-[10px] text-stone-400 uppercase font-bold">Age</p>
              <p className="font-semibold text-stone-800">{rooster.age}</p>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold">Height</p>
              <p className="font-semibold text-stone-800">{rooster.height}</p>
            </div>
          </div>

          {/* Description snippet */}
          <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {rooster.description}
          </p>

          {/* Vaccination & Health Certification */}
          <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{rooster.vaccinationStatus}</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="pt-3 border-t border-stone-100 space-y-2.5">
          
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700">
              {rooster.combType.split('(')[0].trim()}
            </span>
            <button
              onClick={() => onSelect(rooster)}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center hover:underline"
            >
              <Eye className="w-3 h-3 mr-1" />
              Full Pedigree
            </button>
          </div>

          {/* Buttons: Inspect & Inquire */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelect(rooster)}
              className="w-full flex items-center justify-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Profile</span>
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Breeder</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
