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
  Truck,
  ChevronRight,
  LogOut,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';
import { useOrders } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';
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
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { orders } = useOrders();
  const { user, signOut } = useAuth();

  const activeOrdersCount = orders.filter(o => o.status === 'confirmed' || o.status === 'dispatched').length;
  const totalOrdersCount = orders.length;

  const generalWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: 'Hello JP Farms! I visited your website showcase and would like to learn more about your heritage roosters and plan a visit to your farm.',
  });

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

          {/* Desktop Center Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-xs font-bold text-slate-700">
            <a href="#showcase" className="hover:text-amber-600 transition flex items-center space-x-1">
              <span>🐓 Rooster Showcase</span>
            </a>
            <a href="#breeds" className="hover:text-amber-600 transition flex items-center space-x-1">
              <span>🛡️ Heritage Breeds</span>
            </a>
            <a href="#biosecurity" className="hover:text-amber-600 transition flex items-center space-x-1">
              <span>🌿 Bio-Security & Diet</span>
            </a>
            <a href="#delivery" className="hover:text-amber-600 transition flex items-center space-x-1">
              <span>🚚 Live AC Crate Delivery</span>
            </a>
            <a href="#visit-guide" className="hover:text-amber-600 transition flex items-center space-x-1">
              <span>📍 Visit Estate</span>
            </a>
          </nav>

          {/* Top Right Actions (Desktop): Profile, Orders, Cart & Menu Bar */}
          <div className="hidden sm:flex items-center space-x-2.5 shrink-0">
            {/* Google Sign In / Account Avatar Button */}
            <GoogleSignInButton variant="header" />

            {/* My Orders Button */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-amber-500/40 shadow-sm transition active:scale-95 whitespace-nowrap group"
              title="Track Your Orders & Live Transit"
            >
              <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              <span>My Orders</span>
              {activeOrdersCount > 0 ? (
                <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full min-w-[18px] text-center flex items-center space-x-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{activeOrdersCount}</span>
                </span>
              ) : totalOrdersCount > 0 ? (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-slate-700">
                  {totalOrdersCount}
                </span>
              ) : null}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95 whitespace-nowrap group"
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

            {/* Menu Bar Button - Placed RIGHT NEXT TO CART */}
            <button
              type="button"
              onClick={() => setSideMenuOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 transition active:scale-95 text-xs font-extrabold shadow-xs whitespace-nowrap group"
              title="Open Navigation Menu"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 text-amber-400 group-hover:scale-110 transition duration-200" />
              <span>Menu</span>
            </button>
          </div>

          {/* Mobile Right Actions: Profile, Orders, Cart & Menu Button */}
          <div className="flex items-center sm:hidden space-x-1.5">
            {/* Mobile Google Sign In */}
            <GoogleSignInButton variant="compact" />

            {/* Mobile Orders Button */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="relative p-2.5 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30 shadow-xs transition active:scale-95"
              aria-label="Track orders"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-amber-400" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Mobile Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center justify-center shadow-xs transition active:scale-95"
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

            {/* Mobile Menu Bar Button - Placed RIGHT NEXT TO CART */}
            <button
              onClick={() => setSideMenuOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 transition active:scale-95 flex items-center justify-center shadow-xs"
              aria-label="Open menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Amazon / Flipkart Style Slide-Over Side Menu Drawer (Desktop & Mobile) */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSideMenuOpen(false)}
          />

          {/* Drawer Box */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              
              {/* Drawer Top Header (Amazon Hello User Style) */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-stone-900 to-slate-950 text-white flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center space-x-3">
                  {user ? (
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700 font-bold">
                      JP
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      {user ? `Hello, ${user.displayName?.split(' ')[0]}!` : 'Hello, Breeder!'}
                    </h3>
                    <p className="text-[11px] text-amber-400 font-semibold">
                      JP Farms Heritage Menu
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                  aria-label="Close menu drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                
                {/* 1. Orders & Tracking Highlight Card */}
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950">
                      Live Delivery Tracker
                    </span>
                    {activeOrdersCount > 0 ? (
                      <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>{activeOrdersCount} in Transit</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-semibold">Order History</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSideMenuOpen(false);
                      onOpenOrders?.();
                    }}
                    className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white font-black px-3.5 py-2.5 rounded-xl text-xs transition active:scale-95 shadow-md shadow-slate-900/10"
                  >
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>Track Orders & Live GPS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

                {/* 2. Heritage Rooster Showcase Strains */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Heritage Rooster Catalog ({birdsCount} Birds)
                  </h4>
                  <div className="space-y-1">
                    <a
                      href="#showcase"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <span>🐓</span>
                        <span>All Champion Roosters</span>
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                        {birdsCount} Strains
                      </span>
                    </a>

                    <a
                      href="#showcase"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <span>🥇</span>
                        <span>Pure Peela Aseel (Fighter Stance)</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <a
                      href="#showcase"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <span>🥈</span>
                        <span>Kagar & Sindhi Heritage</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <a
                      href="#showcase"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <span>🖤</span>
                        <span>Kadaknath (Black Meat Lineage)</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    {onOpenReels && (
                      <button
                        onClick={() => {
                          setSideMenuOpen(false);
                          onOpenReels();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 text-sky-800 font-bold transition text-left"
                      >
                        <span className="flex items-center space-x-2">
                          <PlayCircle className="w-4 h-4 text-sky-600" />
                          <span>Rooster TV Reels & Videos</span>
                        </span>
                        <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-black">
                          HD
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Farm Care, Health & Bio-Security */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Estate Standards & Logistics
                  </h4>
                  <div className="space-y-1">
                    <a
                      href="#biosecurity"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Marek & ND Vaccination Standards</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <a
                      href="#delivery"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-sky-600" />
                        <span>Live AC Crate Delivery Process</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <a
                      href="#visit-guide"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>Schedule Farm Visit (Hoskote Estate)</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* 4. Support & Direct Farm Connect */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Help & Farm Contacts
                  </h4>
                  <div className="space-y-1">
                    <a
                      href={generalWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-bold transition"
                    >
                      <span className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>WhatsApp Breeder Helpline</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    </a>

                    <a
                      href={`tel:${FARM_INFO.phone}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-sky-600" />
                        <span>Call Dispatch: {FARM_INFO.phone}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <Link
                      href="/admin"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Farm Admin Panel</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* 5. User Sign Out (if logged in) */}
                {user && (
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setSideMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold transition"
                    >
                      <span className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out ({user.email})</span>
                      </span>
                    </button>
                  </div>
                )}

              </div>

              {/* Drawer Bottom Guarantee */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1.5 font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Pure Indian Gamefowl</span>
                </span>
                <span className="font-mono">Est. 2016</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};
