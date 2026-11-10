'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Edit3, 
  LogOut, 
  ShieldCheck, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { GoogleSignInButton } from './GoogleSignInButton';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders?: () => void;
  onOpenCart?: () => void;
}

const formatDisplayPhone = (raw?: string | null): string => {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const last10 = digits.slice(2);
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5, 10)}`;
  }
  return raw;
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
  onOpenCart,
}) => {
  const { user, isAuthenticated, signInWithGoogle, signOut, updatePhone } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (user) {
      setPhoneNumberInput(user.phoneNumber?.replace(/\+91\s?/, '') || '');
    }
  }, [user]);

  // Lock scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const memberCode = user?.uid ? user.uid.slice(0, 8).toUpperCase() : 'JP-EST2016';

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumberInput.trim().replace(/\D/g, '');
    if (clean.length === 10) {
      const formatted = `+91 ${clean.slice(0, 5)} ${clean.slice(5, 10)}`;
      updatePhone(formatted);
      setIsEditingPhone(false);
      setSavedSuccessMsg('Phone number updated successfully!');
      setTimeout(() => setSavedSuccessMsg(null), 2500);
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto z-10 animate-in zoom-in-95 duration-200 max-h-[96vh]"
        role="dialog"
        aria-modal="true"
        aria-label="My Profile"
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-stone-900 to-slate-950 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-amber-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer flex items-center space-x-1"
              aria-label="Back"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-black text-white">My Profile</h2>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Breeder Account
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300">JP Farms Official Member Sanctuary</p>
              <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Sync (Desktop & Mobile)</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0"
            aria-label="Close profile modal"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {savedSuccessMsg && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 flex items-center space-x-2 animate-in slide-in-from-top shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        {!isAuthenticated || !user ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <User className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sign In to Your Breeder Profile</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Access live transit GPS tracking, saved farm delivery addresses, and verified breeder passes.
              </p>
            </div>
            <div className="max-w-xs mx-auto pt-2">
              <GoogleSignInButton variant="page" />
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-2xl p-4 border border-amber-200/80 shadow-xs flex items-center space-x-3.5">
              <img
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={user.displayName || 'Profile'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-slate-900 truncate">
                    {user.displayName || 'Registered Breeder'}
                  </h3>
                  <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                  Member ID: #{memberCode}
                </p>
                <p className="text-[11px] text-slate-600 truncate flex items-center space-x-1 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email || 'Google Account'}</span>
                </p>
              </div>
            </div>

            {/* Contact & Phone Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-slate-800">Mobile Phone (Delivery & Dispatch)</span>
                </div>
                {!isEditingPhone && (
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{user.phoneNumber ? 'Edit' : '+ Add'}</span>
                  </button>
                )}
              </div>

              {isEditingPhone ? (
                <form onSubmit={handleSavePhone} className="pt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-2 rounded-xl select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumberInput}
                      onChange={(e) => setPhoneNumberInput(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      Save Phone
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pt-1 text-xs">
                  {user.phoneNumber ? (
                    <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                      {formatDisplayPhone(user.phoneNumber)}
                    </span>
                  ) : (
                    <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-xl p-2.5">
                      <span className="text-amber-900 text-xs font-semibold">No phone number added yet</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingPhone(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        + Add Phone
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>,
    document.body
  );
};
