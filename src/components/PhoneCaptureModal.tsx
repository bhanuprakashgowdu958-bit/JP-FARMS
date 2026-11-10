'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { 
  Phone, 
  CheckCircle2, 
  X,
  Award,
  ShieldCheck
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
}) => {
  const { user, updatePhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ? user.phoneNumber.replace(/^\+91\s*/, '') : '');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update local input state when user data changes
  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber.replace(/^\+91\s*/, ''));
    }
  }, [user?.phoneNumber]);

  if (!isOpen || !mounted) return null;

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
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#0284c7', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const displayName = user?.displayName || 'Customer';
  const email = user?.email || 'Google User';
  const photo = user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] bg-stone-950/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-white text-stone-900 rounded-3xl max-w-sm sm:max-w-md w-full shadow-2xl border-2 border-amber-500/40 overflow-hidden relative my-auto animate-in zoom-in-95 duration-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Amber Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-sky-500 w-full"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Header Title */}
          <div>
            <h3 className="text-lg font-black text-stone-950 tracking-tight flex items-center space-x-2">
              <Phone className="w-5 h-5 text-amber-600" />
              <span>Add Mobile Number</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Required for live climate crate delivery tracking & order dispatch updates.
            </p>
          </div>

          {/* CUSTOMER PROFILE CARD (100% Guaranteed Visible) */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center space-x-3.5 shadow-xs">
            <div className="relative shrink-0">
              <img
                src={photo}
                alt={displayName}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs" title="Google Verified">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h4 className="text-sm font-black text-stone-900 truncate">
                  {displayName}
                </h4>
                <span className="text-[9px] uppercase font-black tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono truncate mt-0.5">
                {email}
              </p>
            </div>
          </div>

          {isSuccess ? (
            /* Celebratory Success State */
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-1.5 animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-emerald-950">Mobile Saved!</h4>
              <p className="text-xs text-emerald-700 font-medium">
                Your profile is updated and synchronized with JP Farms Admin.
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
              <div className="pt-1 space-y-2">
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
                  className="w-full py-1.5 text-stone-400 hover:text-stone-600 text-xs font-semibold transition cursor-pointer"
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

  return createPortal(modalContent, document.body);
};
