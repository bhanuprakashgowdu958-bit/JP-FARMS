'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  LogOut, 
  Award, 
  CheckCircle2, 
  ChevronRight,
  PhoneCall,
  Calendar,
  FileText,
  Phone,
  Edit3
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { useCart } from '@/lib/cartStore';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PhoneCaptureModal } from './PhoneCaptureModal';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface UserProfileHubProps {
  onOpenCart?: () => void;
}

export const UserProfileHub: React.FC<UserProfileHubProps> = ({ onOpenCart }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const [activeTabModal, setActiveTabModal] = useState<'health' | 'delivery' | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Time-based Indian greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Breeder';
  const memberCode = user?.uid ? user.uid.slice(0, 8).toUpperCase() : 'JP-EST2016';

  const vipWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Namaste JP Farms! I am ${user?.displayName || 'a member'} (Member ID: #${memberCode}). I would like to inquire about priority rooster reservations.`,
  });

  // ==========================================
  // 1. SIGNED-IN STATE: Personalized Profile Hub
  // ==========================================
  if (isAuthenticated && user) {
    return (
      <section id="profile-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5" aria-label="Customer Profile Hub">
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-amber-500/30 relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          {/* Top Profile Header Bar */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-800">
            
            {/* User Details */}
            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={user.displayName || 'User Profile'}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md shadow-amber-500/20"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-stone-900 flex items-center justify-center" title="Active Account">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-stone-100 tracking-tight">
                    {getGreeting()}, {firstName}!
                  </h2>
                  <span className="inline-flex items-center space-x-1 bg-amber-400/15 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Verified Breeder</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-stone-400 mt-1.5 flex-wrap gap-y-1">
                  <span className="font-mono text-stone-300">ID: #{memberCode}</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 truncate max-w-[180px] sm:max-w-none">{user.email}</span>
                  <span className="text-stone-600">•</span>
                  {user.phoneNumber ? (
                    <button
                      onClick={() => setIsPhoneModalOpen(true)}
                      className="inline-flex items-center space-x-1 text-amber-300 hover:text-amber-200 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 font-mono transition group"
                      title="Click to edit phone number"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{user.phoneNumber}</span>
                      <Edit3 className="w-2.5 h-2.5 text-stone-400 group-hover:text-white ml-0.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPhoneModalOpen(true)}
                      className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-0.5 rounded-lg border border-amber-400/40 text-[11px] font-bold transition animate-pulse"
                    >
                      <Phone className="w-3 h-3" />
                      <span>+ Add WhatsApp / Phone</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Quick Controls */}
            <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
              <a
                href={vipWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition active:scale-95 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>VIP WhatsApp</span>
              </a>

              <button
                onClick={() => signOut()}
                className="inline-flex items-center space-x-1 text-xs font-bold text-stone-400 hover:text-red-400 bg-stone-800/80 hover:bg-stone-800 px-3 py-2 rounded-xl border border-stone-700/60 transition"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* 4 Interactive Profile Hub Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
            
            {/* Card 1: Live Cart Status */}
            <div 
              onClick={onOpenCart}
              className="bg-stone-800/60 hover:bg-stone-800/90 border border-stone-700/70 hover:border-amber-500/50 rounded-2xl p-4 transition cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                {cartCount > 0 ? (
                  <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {cartCount} in Cart
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-500 font-semibold">Empty</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Your Bird Cart</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {cartCount > 0 ? `Total: ₹${cartTotal.toLocaleString('en-IN')}` : 'No roosters added yet'}
                </p>
              </div>
              <div className="flex items-center text-[11px] font-bold text-amber-400 mt-3 group-hover:translate-x-1 transition">
                <span>{cartCount > 0 ? 'Review & Checkout' : 'Browse Catalog'}</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>

            {/* Card 2: Climate Crate Delivery Tracking */}
            <div 
              onClick={() => setActiveTabModal('delivery')}
              className="bg-stone-800/60 hover:bg-stone-800/90 border border-stone-700/70 hover:border-sky-500/50 rounded-2xl p-4 transition cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="bg-sky-500/20 text-sky-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-sky-500/30">
                  Live Transit
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Climate Crate Logistics</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  AC temperature-controlled live animal transit across South India
                </p>
              </div>
              <div className="flex items-center text-[11px] font-bold text-sky-400 mt-3 group-hover:translate-x-1 transition">
                <span>Delivery Coverage Map</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>

            {/* Card 3: Avian Health & Pedigree Pass */}
            <div 
              onClick={() => setActiveTabModal('health')}
              className="bg-stone-800/60 hover:bg-stone-800/90 border border-stone-700/70 hover:border-emerald-500/50 rounded-2xl p-4 transition cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  100% Certified
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Avian Health Passports</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Marek, Ranikhet & Fowl Pox vaccination batch records
                </p>
              </div>
              <div className="flex items-center text-[11px] font-bold text-emerald-400 mt-3 group-hover:translate-x-1 transition">
                <span>View Health Standards</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>

            {/* Card 4: Farm Visit & Direct Consultation */}
            <a 
              href={vipWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-800/60 hover:bg-stone-800/90 border border-stone-700/70 hover:border-amber-400/50 rounded-2xl p-4 transition cursor-pointer group shadow-sm flex flex-col justify-between block"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="bg-amber-400/20 text-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30">
                  Open Daily
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">Schedule Farm Visit</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Visit JP Farms paddocks in Hoskote & meet champion bloodlines
                </p>
              </div>
              <div className="flex items-center text-[11px] font-bold text-amber-300 mt-3 group-hover:translate-x-1 transition">
                <span>Book Direct Tour</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </a>

          </div>

        </div>

        {/* Modal: Health Pass Details */}
        {activeTabModal === 'health' && (
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-extrabold text-base">JP Farms Certified Avian Health Pass</h3>
                </div>
                <button 
                  onClick={() => setActiveTabModal(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every rooster at JP Farms undergoes rigid biological quarantine and is administered full veterinary vaccines under certified avian surveillance:
              </p>
              <ul className="text-xs space-y-2 text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Day 1:</strong> Marek's Disease Subcutaneous Vaccine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Day 7:</strong> Newcastle / Ranikhet F1 Ocular Drops</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Day 14:</strong> Infectious Bursal Disease (Gumboro)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Day 42:</strong> Fowl Pox Wing Web Inoculation</span>
                </li>
              </ul>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTabModal(null)}
                  className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Climate Crate Delivery Info */}
        {activeTabModal === 'delivery' && (
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2 text-sky-700">
                  <Truck className="w-5 h-5" />
                  <h3 className="font-extrabold text-base">Climate-Controlled Animal Transit</h3>
                </div>
                <button 
                  onClick={() => setActiveTabModal(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                JP Farms operates dedicated climate-controlled express logistics across South India to guarantee zero stress for live champion birds:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800">Karnataka</p>
                  <p className="text-[11px] text-stone-500">Same-Day / Next-Day door delivery</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800">Andhra & Telangana</p>
                  <p className="text-[11px] text-stone-500">24-hour climate crate transit</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800">Tamil Nadu</p>
                  <p className="text-[11px] text-stone-500">Overnight direct express</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800">Kerala</p>
                  <p className="text-[11px] text-stone-500">Border hub dispatch points</p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTabModal(null)}
                  className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Capture / Edit Modal */}
        <PhoneCaptureModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
        />

      </section>
    );
  }

  // ==========================================
  // 2. LOGGED-OUT STATE: Breeder Circle Promo
  // ==========================================
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Join Breeder Circle Banner">
      <div className="bg-gradient-to-r from-amber-500/10 via-stone-100 to-sky-500/10 rounded-3xl p-5 sm:p-6 border border-amber-300/60 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Rooster Icon & Value Prop */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-black text-stone-900">
                Join the JP Farms Heritage Breeder Circle
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-400">
                1-Click Sign In
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Sign in with your Google account to unlock member discounts, track live orders, and reserve purebred chicks before public release.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto justify-end">
          <Link
            href="/signup"
            className="text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-200 shadow-xs transition"
          >
            Explore Benefits
          </Link>
          <GoogleSignInButton variant="compact" />
        </div>

      </div>
    </section>
  );
};
