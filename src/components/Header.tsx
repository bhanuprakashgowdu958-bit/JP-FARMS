'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  PlayCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Settings, 
  Feather, 
  Sparkles, 
  MapPin, 
  ShoppingCart, 
  Package, 
  Truck 
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';
import { useOrders } from '@/lib/roosterStore';
import { GoogleSignInButton } from './GoogleSignInButton';

interface HeaderProps {
  onOpenReels?: () => void;
  onOpenOrders?: () => void;
  birdsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenReels, 
  onOpenOrders, 
  birdsCount = 7 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { orders } = useOrders();

  const activeOrdersCount = orders.filter(o => o.status === 'confirmed' || o.status === 'dispatched').length;
  const totalOrdersCount = orders.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 text-slate-800 shadow-xs">
      {/* Top Banner: Farm Heritage & Helpline */}
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

          {/* Quick Actions (Desktop: Google Sign In, My Orders, Cart) */}
          <div className="hidden sm:flex items-center space-x-2.5 shrink-0">
            {/* Google Sign In / Account Button */}
            <GoogleSignInButton variant="header" />

            {/* Amazon / Flipkart Style "Returns & Orders" Tracker */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="relative flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/90 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition active:scale-95 whitespace-nowrap group shadow-2xs"
              title="View & Track Your Orders"
            >
              <Package className="w-4 h-4 text-slate-700 group-hover:text-amber-600 transition" />
              <div className="text-left leading-tight hidden lg:block">
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Returns</span>
                <span className="block text-xs font-black text-slate-900">& Orders</span>
              </div>
              <span className="lg:hidden text-xs font-extrabold">Orders</span>
              
              {activeOrdersCount > 0 ? (
                <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-amber-600/30 flex items-center space-x-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{activeOrdersCount}</span>
                </span>
              ) : totalOrdersCount > 0 ? (
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {totalOrdersCount}
                </span>
              ) : null}
            </button>

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
          </div>

          {/* Mobile Actions: Google, Orders, Cart & Menu Button */}
          <div className="flex items-center lg:hidden space-x-1.5">
            {/* Mobile Google Sign In */}
            <GoogleSignInButton variant="compact" />

            {/* Mobile Orders Button */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="relative p-2 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
              aria-label="Track orders"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-slate-800" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {activeOrdersCount}
                </span>
              )}
            </button>

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
                className="hidden sm:flex items-center space-x-1 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1.5 rounded-lg"
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

      {/* Amazon / Flipkart Style Category Secondary Sub-Nav Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar space-x-3 sm:space-x-6 whitespace-nowrap">
          <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] font-bold">
            <a 
              href="#showcase" 
              className="flex items-center space-x-1.5 text-amber-400 hover:text-white transition"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>All Strains ({birdsCount})</span>
            </a>
            <a href="#showcase" className="hover:text-amber-300 transition text-slate-300">
              Champion Peela Aseel
            </a>
            <a href="#showcase" className="hover:text-amber-300 transition text-slate-300">
              Kagar & Sindhi
            </a>
            <a href="#showcase" className="hover:text-amber-300 transition text-slate-300">
              Kadaknath (Black Meat)
            </a>
            <a href="#biosecurity" className="hover:text-amber-300 transition text-slate-300 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Bio-Security & Vaccines</span>
            </a>
            <a href="#visit-guide" className="hover:text-amber-300 transition text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Visit Farm Estate</span>
            </a>
          </div>

          {/* Quick Track Orders Link in Sub-Nav */}
          <button
            type="button"
            onClick={onOpenOrders}
            className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 text-[11px] font-extrabold ml-auto shrink-0 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Orders</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile Google Sign In Banner */}
          <div className="pb-2 border-b border-sky-100">
            <GoogleSignInButton variant="page" />
          </div>

          {/* Mobile Orders Tracker Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders?.();
            }}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300/80 rounded-xl text-slate-900 font-extrabold text-sm"
          >
            <div className="flex items-center space-x-2.5">
              <Package className="w-5 h-5 text-amber-600" />
              <span>My Orders & Live Transit</span>
            </div>
            {activeOrdersCount > 0 ? (
              <span className="bg-amber-500 text-stone-950 text-xs font-black px-2 py-0.5 rounded-full">
                {activeOrdersCount} Active
              </span>
            ) : (
              <span className="text-xs text-amber-700 font-semibold">Track →</span>
            )}
          </button>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-sky-50 rounded-lg text-slate-800 font-semibold"
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
        </div>
      )}
    </header>
  );
};
