'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Phone, 
  CheckCircle2, 
  X, 
  Award, 
  Feather
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';

interface PhoneCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const PhoneCaptureModal: React.FC<PhoneCaptureModalProps> = ({
  isOpen,
  onClose,
  title = 'Complete Your Breeder Profile',
  subtitle = 'Add your WhatsApp / Mobile Number for live climate crate delivery tracking & order dispatch updates.',
}) => {
  const { user, updatePhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ? user.phoneNumber.replace(/^\+91\s*/, '') : '');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const cleanDigits = phoneNumber.trim().replace(/\D/g, '');
  const isComplete = cleanDigits.length === 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const formattedNumber = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5, 10)}`;
    updatePhone(formattedNumber);
    setIsSuccess(true);
    setError('');

    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#0284c7', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Breeder';

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white text-stone-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-amber-500/30 overflow-hidden relative animate-in zoom-in-95 duration-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOP VISUAL BANNER: Majestic 3D Rooster Artwork */}
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-stone-950">
          <img
            src="/banners/ad_rooster_golden_grains_commercial.jpg"
            alt="JP Farms 3D Rooster"
            className="w-full h-full object-cover object-center opacity-85 scale-105 hover:scale-100 transition-transform duration-700"
          />
          
          {/* Subtle Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent"></div>

          {/* Top Pill Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center space-x-1.5 bg-stone-950/80 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-400/40 shadow-md">
              <Award className="w-3 h-3 text-amber-400" />
              <span>VIP Breeder Verification</span>
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 text-stone-300 hover:text-white bg-stone-950/60 hover:bg-stone-900/90 backdrop-blur-xs p-1.5 rounded-full border border-stone-700/80 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floating User Avatar */}
        <div className="relative z-10 flex justify-center -mt-8">
          <div className="relative">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={user?.displayName || 'User Avatar'}
              className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-amber-400/60 bg-white"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-2">
          
          {/* Header Title */}
          <div className="text-center space-y-1 mb-5">
            <h3 className="text-lg font-black text-stone-950 tracking-tight">
              Namaste, {firstName}! 🐓
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              Add your mobile number for order tracking and live dispatch updates.
            </p>
          </div>

          {isSuccess ? (
            /* Celebratory Success State */
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-emerald-950">Mobile Verified!</h4>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                Your profile is synchronized with JP Farms Admin. Priority dispatch alerts are now active.
              </p>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Phone Input with +91 Prefix */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mobile</span>
                  </label>
                  
                  {/* Live Character Count Indicator */}
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition ${
                    isComplete 
                      ? 'text-emerald-700 bg-emerald-100 border border-emerald-300' 
                      : 'text-stone-400 bg-stone-100'
                  }`}>
                    {isComplete ? '✓ 10 Digits Complete' : `${cleanDigits.length}/10 digits`}
                  </span>
                </div>

                <div className="relative flex rounded-2xl border-2 border-stone-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 shadow-sm overflow-hidden transition group">
                  <div className="inline-flex items-center px-3.5 bg-stone-50 text-stone-800 font-bold text-xs border-r border-stone-200 select-none space-x-1.5">
                    <span className="text-sm">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-3 text-base font-mono font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-normal focus:outline-hidden tracking-wider"
                    autoFocus
                  />
                  {isComplete && (
                    <div className="flex items-center pr-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in-50" />
                    </div>
                  )}
                </div>
                {error && <p className="text-xs font-semibold text-red-600 mt-1.5">{error}</p>}
              </div>

              {/* Submit & Dismiss Actions */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={cleanDigits.length < 10}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-md ${
                    isComplete 
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 hover:shadow-lg hover:shadow-amber-500/30 active:scale-98 cursor-pointer' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>Save</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-stone-400 hover:text-stone-600 text-xs font-semibold transition"
                >
                  Remind Me Later
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
