'use client';

import React, { useState } from 'react';
import { Phone, CheckCircle2, X, Shield, MessageCircle, Feather } from 'lucide-react';
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
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');

    // Validate 10-digit Indian mobile number
    if (cleanNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const formattedNumber = cleanNumber.length === 10 ? `+91 ${cleanNumber}` : `+${cleanNumber}`;
    updatePhone(formattedNumber);
    setIsSuccess(true);
    setError('');

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Rooster Crest */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Feather className="w-6 h-6 text-amber-600 transform -rotate-12" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h3 className="text-lg font-black text-stone-950 tracking-tight">{title}</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Phone Number Saved!</h4>
            <p className="text-xs text-emerald-700">
              Your profile is verified and synchronized with JP Farms Admin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Phone Input with +91 Prefix */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                WhatsApp / Mobile Number
              </label>
              <div className="relative flex rounded-2xl border border-stone-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-xs overflow-hidden transition">
                <span className="inline-flex items-center px-3.5 bg-stone-100 text-stone-700 font-bold text-xs border-r border-stone-200 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber.replace(/^\+91\s*/, '')}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs font-semibold text-red-600 mt-1.5">{error}</p>}
            </div>

            {/* Farm Trust Notice */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-stone-700 text-[11px] flex items-start space-x-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-tight text-stone-600">
                Used solely for live AC crate delivery coordination, vaccination papers, and booking confirmations. Zero spam.
              </p>
            </div>

            {/* Submit & Skip Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95"
              >
                Save Mobile Number
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
  );
};

