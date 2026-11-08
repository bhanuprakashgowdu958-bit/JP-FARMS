'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, PlayCircle, ShieldCheck, Menu, X, Settings, Feather, Sparkles, MapPin, ShoppingCart } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';

interface HeaderProps {
  onOpenReels?: () => void;
  birdsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReels, birdsCount = 7 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  const generalWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! I visited your website showcase and would like to learn more about your heritage roosters and plan a visit to your farm.`,
  });

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 text-slate-800 shadow-sm">
      {/* Top Banner: Farm Heritage & Visitors Welcome (Light Sky Blue Tint) */}
      <div className="bg-sky-50/90 border-b border-sky-100/80 text-xs px-4 py-1.5 text-sky-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-sky-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block"></span>
              {birdsCount} Champion Strains Documented • Visitors Welcome Daily
            </span>
            <span className="hidden sm:inline text-sky-300">•</span>
            <span className="hidden sm:inline text-sky-700">Pure Indian Gamefowl & Desi Avian Conservation</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${FARM_INFO.phone}`} 
              className="flex items-center text-sky-800 hover:text-sky-950 font-medium transition"
            >
              <Phone className="w-3 h-3 mr-1 text-sky-600" />
              <span>Farm Helpline: {FARM_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition duration-200 shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 transform -rotate-12" />
              </div>
            </div>
            <div className="shrink-0">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-sky-700 transition whitespace-nowrap">
                  JP FARMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 whitespace-nowrap">
                  Est. 2016
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wide whitespace-nowrap hidden sm:block">
                Heritage Desi Rooster Showcase Estate
              </p>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            {/* Live Shopping Cart Button (Amazon/Flipkart Style) */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black px-3.5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95 whitespace-nowrap group"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-stone-950 group-hover:scale-110 transition" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-stone-950 text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-amber-400/50 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition active:scale-95 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect with Farm</span>
            </a>
          </div>

          {/* Mobile Actions: Cart & Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Mobile Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-xs"
              aria-label="Open cart"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-stone-950" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-amber-300 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {onOpenReels && (
              <button
                onClick={onOpenReels}
                className="flex items-center space-x-1 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1.5 rounded-lg"
              >
                <PlayCircle className="w-4 h-4 text-sky-600" />
                <span>Videos</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-lg bg-sky-50 border border-sky-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-700">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-sky-50 rounded-lg text-slate-800"
            >
              🐓 Rooster Showcase ({birdsCount} Strains)
            </a>
            <a
              href="#breeds"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-sky-50 rounded-lg text-slate-800"
            >
              🛡️ Heritage Breeds (Aseel, Kadaknath, Desi)
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReels?.();
              }}
              className="flex items-center justify-between p-2 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-left"
            >
              <span className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-sky-600" />
                <span className="font-semibold">Watch Rooster TV Videos</span>
              </span>
              <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                VIDEOS
              </span>
            </button>
            <a
              href="#biosecurity"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-sky-50 rounded-lg text-slate-800"
            >
              🌿 Organic Nutrition & Natural Care
            </a>
            <a
              href="#visit-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-sky-50 rounded-lg text-slate-800"
            >
              📍 Schedule a Farm Visit
            </a>
          </nav>

          <div className="pt-3 border-t border-sky-100 flex flex-col gap-2">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-semibold py-3 rounded-xl shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message Farm on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
