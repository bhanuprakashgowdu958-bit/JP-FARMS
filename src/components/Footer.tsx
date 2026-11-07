'use client';

import React from 'react';
import Link from 'next/link';
import { Feather, Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export const Footer: React.FC = () => {
  const whatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms, I am interested in visiting the farm or inquiring about roosters.',
  });

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 p-0.5 shadow-lg">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                  <Feather className="w-5 h-5 text-amber-500 transform -rotate-12" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                JP FARMS
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              India&apos;s leading farm for pure bloodline Peela Aseel, Kagar, Sindhi Aseel, Kadaknath, and indigenous country roosters. Committed to heritage genetics and zero in-breeding.
            </p>

            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Govt. Certified Veterinary Protocols</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition">Available Roosters</a>
              </li>
              <li>
                <a href="#breeds" className="hover:text-amber-400 transition">Heritage Breed Guide</a>
              </li>
              <li>
                <a href="#biosecurity" className="hover:text-amber-400 transition">Farm Bio-Security & Diet</a>
              </li>
              <li>
                <a href="#transit" className="hover:text-amber-400 transition">Safe Pet Transit Logistics</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition">Breeder Reviews & Proofs</a>
              </li>
              <li>
                <Link href="/admin" className="text-amber-500 hover:text-amber-400 font-semibold transition">
                  Farm Owner / Admin Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Breeds */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Featured Breeds</h4>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>Pure Peela Aseel (Golden Red)</li>
              <li>Kagar Aseel (Emerald Green Sheen)</li>
              <li>Sindhi Heavy Aseel (28&quot; Tall)</li>
              <li>Pure Kadaknath (Jhabua Lineage)</li>
              <li>Natu Kodi (Indigenous Country Desi)</li>
              <li>Breeding Trios & Fertile Pairs</li>
            </ul>
          </div>

          {/* Col 4: Contact & Farm Visit */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Farm Contact & Location</h4>
            
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{FARM_INFO.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${FARM_INFO.phone}`} className="hover:text-white transition">
                  {FARM_INFO.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  WhatsApp: {FARM_INFO.whatsapp}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{FARM_INFO.hours}</span>
              </p>
            </div>

            <div className="pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Farm on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Ethical Disclaimer & Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 space-y-3">
          <p className="max-w-3xl mx-auto leading-relaxed text-[11px] text-stone-500">
            <strong>Ethical Breeding & Heritage Conservation:</strong> JP Farms is dedicated exclusively to the preservation, scientific conservation, and cruelty-free husbandry of indigenous Indian poultry genetics. We support sustainable backyard farming, disease-resistant heritage birds, and organic aviculture.
          </p>
          <p>
            © {new Date().getFullYear()} JP Farms. All rights reserved. Designed for elite livestock presentation.
          </p>
        </div>

      </div>
    </footer>
  );
};

