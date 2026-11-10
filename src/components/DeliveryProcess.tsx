'use client';

import React from 'react';
import { 
  MapPin, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Navigation, 
  MessageCircle, 
  Sparkles, 
  Sun, 
  Eye, 
  Award, 
  ExternalLink,
  Copy
} from 'lucide-react';
import { FARM_INFO, FARM_LOCATION } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

const VISIT_HIGHLIGHTS = [
  {
    step: '01',
    title: 'Open-Sunlight Pasture Stroll',
    desc: 'Witness pure Aseel, Kadaknath, and heritage desi roosters roaming freely in natural sunlit paddocks with authentic dominant postures.',
    icon: Sun,
  },
  {
    step: '02',
    title: 'Physical & Stance Inspection',
    desc: 'Examine standing height, dense bone structures, compact pea combs, curved beaks, and vivid plumage iridescence up close.',
    icon: Eye,
  },
  {
    step: '03',
    title: 'Traditional Nutrition Tour',
    desc: 'Discover our daily organic conditioning formulas: sprouted pearl millet (bajra), crushed almond paste, boiled eggs, and herbal decoctions.',
    icon: ShieldCheck,
  },
  {
    step: '04',
    title: 'Pedigree & Lineage Discussion',
    desc: 'Meet our master breeder to explore genealogical charts, champion sire bloodlines, and scientific indigenous preservation practices.',
    icon: Award,
  },
];

export const DeliveryProcess: React.FC = () => {
  const [copiedCoords, setCopiedCoords] = React.useState(false);

  const visitWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! 🐓 I am planning to visit your heritage breeder estate at Kurapalli, Vutuvanka. Could you confirm visiting availability and share your Google Maps pin?`,
  });

  const handleCopyCoords = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${FARM_LOCATION.lat}, ${FARM_LOCATION.lng}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  return (
    <section id="visit-guide" className="py-16 sm:py-24 bg-gradient-to-b from-white via-amber-50/20 to-white border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Farm Visitation & Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit JP Farms & Experience Living Heritage
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We welcome avian enthusiasts, breeders, and families to visit our open pastures. Discover how pure Indian gamefowl genetics are preserved in a stress-free, natural environment.
          </p>
        </div>

        {/* 4 Highlights Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VISIT_HIGHLIGHTS.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-300 hover:shadow-md transition"
              >
                <div className="text-4xl font-black text-amber-100 absolute top-3 right-4 select-none group-hover:text-amber-200 transition">
                  {h.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {h.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Real Farm Location & Visitor Guide Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Exact Farm Location & Google Maps Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
                    <MapPin className="w-6 h-6 text-stone-950" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Google Maps Verified Pin
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      JP Farms Heritage Estate
                    </h3>
                  </div>
                </div>
              </div>

              {/* Exact Address Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {FARM_INFO.address}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Village: Kurapalli, Vutuvanka • Bangarupalem Mandal • Chittoor District, Andhra Pradesh - 517416
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-600 font-semibold flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>GPS Coordinates: <strong className="text-slate-900 font-mono">13.175048, 78.905406</strong></span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition active:scale-95"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCoords ? 'Copied!' : 'Copy GPS'}</span>
                  </button>
                </div>
              </div>

              {/* Live OpenStreetMap Interactive Visual Embed */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <iframe
                  title="JP Farms Location Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=78.895406%2C13.165048%2C78.915406%2C13.185048&layer=mapnik&marker=13.175048%2C78.905406`}
                  className="w-full h-full border-0 pointer-events-auto"
                  loading="lazy"
                />
                <a
                  href={FARM_LOCATION.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md border border-slate-200 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Direct Google Maps Action Button */}
            <div className="pt-2">
              <a
                href={FARM_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 px-6 rounded-2xl text-sm sm:text-base transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>Open in Google Maps (Live Navigation)</span>
                <ExternalLink className="w-4 h-4 text-stone-950" />
              </a>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Click above for turn-by-turn driving directions directly to our estate gate.
              </p>
            </div>
          </div>

          {/* Direct Farm Visitor Information Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30">
                Visitors & Breeders Welcome
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Plan Your Visit to JP Farms Estate
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Experience the strength, vitality, and proud crowing of indigenous Indian gamefowl. Walk through our naturally landscaped open paddocks and interact directly with our master breeder.
              </p>

              <div className="space-y-3 text-xs text-stone-200 pt-3 border-t border-white/10">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Location:</strong>
                    <p className="text-stone-300 text-[11px] mt-0.5">{FARM_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Visiting Hours:</strong>
                    <p className="text-stone-300 text-[11px] mt-0.5">{FARM_INFO.hours} • Open 24/7 All Day</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Bio-Security:</strong>
                    <p className="text-stone-300 text-[11px] mt-0.5">Footwear sanitization station provided at estate entrance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${FARM_INFO.phone}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-4 py-3 rounded-xl text-xs transition shadow-lg active:scale-95"
              >
                <Phone className="w-4 h-4 text-stone-950" />
                <span>Call Farm ({FARM_INFO.phone})</span>
              </a>

              <a
                href={visitWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-3 rounded-xl text-xs transition shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Map</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
