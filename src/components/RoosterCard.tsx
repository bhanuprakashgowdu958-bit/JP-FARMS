'use client';

import React from 'react';
import { PlayCircle, MessageCircle, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Rooster } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';

interface RoosterCardProps {
  rooster: Rooster;
  onSelect: (rooster: Rooster) => void;
  onOpenVideo?: (rooster: Rooster) => void;
  onBookNow?: (rooster: Rooster) => void;
}

export const RoosterCard: React.FC<RoosterCardProps> = ({
  rooster,
  onSelect,
  onOpenVideo,
  onBookNow,
}) => {
  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    tagId: rooster.tagId,
    roosterName: rooster.name,
    breed: rooster.breed,
    price: rooster.price,
  });

  const isSold = rooster.status === 'sold';
  const isReserved = rooster.status === 'reserved';
  const isAvailable = rooster.status === 'available';

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
      isSold 
        ? 'border-stone-200 opacity-75 grayscale-[20%]' 
        : 'border-stone-200 hover:border-amber-500/60 hover:shadow-xl'
    }`}>
      
      {/* Top Image & Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 cursor-pointer" onClick={() => onSelect(rooster)}>
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
            {rooster.tagId}
          </span>

          {/* Status Badge */}
          {isAvailable && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-md flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>AVAILABLE</span>
            </span>
          )}
          {isReserved && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 shadow-md">
              TOKEN RESERVED
            </span>
          )}
          {isSold && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-stone-700 text-stone-200 shadow-md">
              SOLD OUT
            </span>
          )}
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
            <span>HD Video Available</span>
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
          {/* Title & Age */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                onClick={() => onSelect(rooster)}
                className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition cursor-pointer leading-snug line-clamp-1"
                title={rooster.name}
              >
                {rooster.name}
              </h3>
              <p className="text-xs text-stone-500 font-medium">{rooster.breed}</p>
            </div>
          </div>

          {/* Quick Specifications Grid */}
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

          {/* Color & Lineage snippet */}
          <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {rooster.description}
          </p>

          {/* Vaccination tag */}
          <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{rooster.vaccinationStatus}</span>
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          
          {/* Price Bar */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Farm Price</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-stone-900">
                  {formatPrice(rooster.price)}
                </span>
                {rooster.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatPrice(rooster.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onSelect(rooster)}
              className="text-xs text-stone-500 hover:text-stone-900 underline font-medium flex items-center"
            >
              <Eye className="w-3 h-3 mr-1" />
              Full Specs
            </button>
          </div>

          {/* Conversion Buttons */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* View Details Button */}
            <button
              type="button"
              onClick={() => onSelect(rooster)}
              className="w-full flex items-center justify-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-3 rounded-xl text-xs transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Bird</span>
            </button>

            {/* Direct WhatsApp / Buy Button */}
            {isAvailable ? (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Buy</span>
              </a>
            ) : isReserved ? (
              <button
                disabled
                className="w-full bg-amber-100 text-amber-800 font-semibold py-2.5 px-3 rounded-xl text-xs cursor-not-allowed"
              >
                Token Held
              </button>
            ) : (
              <a
                href={generateWhatsAppLink({
                  phone: FARM_INFO.whatsapp,
                  customMessage: `Hi JP Farms, I saw Rooster #${rooster.tagId} (${rooster.name}) which is sold out. When will you have similar roosters available?`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium py-2.5 px-3 rounded-xl text-xs"
              >
                <span>Request Similar</span>
              </a>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
