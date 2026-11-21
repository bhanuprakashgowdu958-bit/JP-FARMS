'use client';

import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export const Footer: React.FC = () => {
  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms, I am interested in visiting the farm and exploring your heritage roosters.',
  });

  return (
    <footer className="bg-[#1c1410] text-slate-300 border-t border-amber-900/30">

      {/* Trust Badge Strip */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-amber-200/60 font-semibold">
            {[
              `Est. ${FARM_INFO.establishedYear}`,
              `${FARM_INFO.totalBirdsDocumented}+ Birds Documented`,
              '12 Pure Bloodlines',
              'Chittoor, Andhra Pradesh',
              '0% Steroids • 0% Antibiotics',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="space-y-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/30">
                  <div className="w-full h-full bg-[#1c1410] rounded-[10px] overflow-hidden flex items-center justify-center">
                    <img src="/logo-square.png" alt="JP Farms Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="font-black text-xl tracking-tight text-white font-playfair">JP FARMS</p>
                  <p className="text-[10px] text-amber-400/70 font-semibold tracking-widest uppercase">Heritage Estate</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {"India's premier conservation estate for pure bloodline Peela Aseel, Kagar, Sindhi Aseel, Kadaknath, and indigenous country roosters."}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Certified Avian Bio-Security &amp; Veterinary Care</span>
            </div>
            {/* WhatsApp CTA */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25d366] hover:bg-[#1db954] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white/80">Explore</h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              {[
                { href: '#showcase', label: 'Rooster Living Gallery' },
                { href: '#breeds', label: 'Heritage Breed Guide' },
                { href: '#biosecurity', label: 'Natural Diet & Care Standards' },
                { href: '#visit-guide', label: 'Farm Visitation & Route Guide' },
                { href: '#reviews', label: 'Breeder & Visitor Reviews' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="hover:text-amber-400 transition flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-px bg-amber-500 transition-all duration-200 shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Breeds */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white/80">Preserved Breeds</h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              {[
                'Pure Peela Aseel (Golden Red)',
                'Kagar Aseel (Emerald Sheen)',
                'Sindhi Heavy Aseel (28" Tall)',
                'Pure Kadaknath (Jhabua Line)',
                'Natu Kodi (Indigenous Desi)',
                'Documented Pedigree Sires',
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-500/50 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white/80">Farm Contact</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{FARM_INFO.address}</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${FARM_INFO.phone}`} className="hover:text-white transition">
                  {FARM_INFO.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  WhatsApp: {FARM_INFO.whatsapp}
                </a>
              </p>
              <p className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{FARM_INFO.hours}</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} JP Farms. Dedicated to the Conservation of Indigenous Indian Gamefowl.</p>
          <div className="flex items-center space-x-4">
            <a href="#showcase" className="hover:text-amber-400 transition">Showcase</a>
            <span className="text-white/20">•</span>
            <a href="#breeds" className="hover:text-amber-400 transition">Breeds</a>
            <span className="text-white/20">•</span>
            <a href="#visit-guide" className="hover:text-amber-400 transition">Plan Visit</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
