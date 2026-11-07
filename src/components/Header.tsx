'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, PlayCircle, ShieldCheck, Menu, X, Settings, Feather, Sparkles } from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface HeaderProps {
  onOpenReels?: () => void;
  availableCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReels, availableCount = 6 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const generalWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Hello JP Farms! I visited your website and would like to learn more about the roosters currently available for purchase and transit details.`,
  });

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      {/* Top Banner: Farm Trust & Live Status */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 text-xs px-4 py-1.5 text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5 inline-block"></span>
              {availableCount} Verified Roosters Ready for Dispatch
            </span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="hidden sm:inline text-stone-400">All-India Safe Pet Transit Guaranteed</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${FARM_INFO.phone}`} 
              className="flex items-center text-stone-300 hover:text-emerald-400 transition"
            >
              <Phone className="w-3 h-3 mr-1" />
              <span>Call Farm: {FARM_INFO.phone}</span>
            </a>
            <Link
              href="/admin"
              className="text-stone-400 hover:text-amber-400 transition flex items-center space-x-1 pl-2 border-l border-stone-700"
              title="Farm Owner & Admin Management Portal"
            >
              <Settings className="w-3 h-3" />
              <span className="hidden md:inline">Admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-900/40 group-hover:scale-105 transition duration-200">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Feather className="w-6 h-6 text-amber-500 transform -rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-400 transition">
                  JP FARMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Est. 2016
                </span>
              </div>
              <p className="text-[11px] text-stone-400 tracking-wide">
                Pure Bloodline Desi & Aseel Roosters
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-stone-300">
            <a href="#catalog" className="hover:text-amber-400 transition py-1">
              Available Roosters
            </a>
            <a href="#breeds" className="hover:text-amber-400 transition py-1">
              Our Breeds
            </a>
            <button
              onClick={onOpenReels}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-semibold bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/40 px-3 py-1.5 rounded-full transition group"
            >
              <PlayCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              <span>Rooster Reels TV</span>
              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                Live
              </span>
            </button>
            <a href="#biosecurity" className="hover:text-amber-400 transition py-1">
              Health & Diet
            </a>
            <a href="#transit" className="hover:text-amber-400 transition py-1">
              Safe Delivery
            </a>
            <a href="#reviews" className="hover:text-amber-400 transition py-1">
              Customer Reviews
            </a>
          </nav>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Farm</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            {onOpenReels && (
              <button
                onClick={onOpenReels}
                className="flex items-center space-x-1 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2.5 py-1.5 rounded-lg"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Reels</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-300 hover:text-white p-2 rounded-lg bg-stone-900 border border-stone-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-base font-medium text-stone-200">
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-stone-800 rounded-lg"
            >
              🐓 Available Roosters ({availableCount})
            </a>
            <a
              href="#breeds"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-stone-800 rounded-lg"
            >
              🛡️ Heritage Breeds (Aseel, Kadaknath, Desi)
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReels?.();
              }}
              className="flex items-center justify-between p-2 bg-amber-950/40 border border-amber-600/40 text-amber-400 rounded-lg text-left"
            >
              <span className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5" />
                <span>Watch Rooster Reels TV</span>
              </span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                VIDEOS
              </span>
            </button>
            <a
              href="#biosecurity"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-stone-800 rounded-lg"
            >
              🌿 Farm Bio-Security & Feeding
            </a>
            <a
              href="#transit"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-stone-800 rounded-lg"
            >
              📦 Safe Live Transit Across India
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-stone-800 rounded-lg"
            >
              ⭐ Customer Reviews
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-stone-400 hover:text-amber-400 rounded-lg flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Farm Admin Portal</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us Directly</span>
            </a>
            <a
              href={`tel:${FARM_INFO.phone}`}
              className="flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium py-2.5 rounded-xl border border-stone-700"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Farm Manager: {FARM_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

