'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  ShoppingCart, 
  Award, 
  CheckCircle2, 
  Edit3, 
  LogOut, 
  ShieldCheck, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';
import { useCart } from '@/lib/cartStore';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { GoogleSignInButton } from './GoogleSignInButton';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders?: () => void;
  onOpenCart?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
  onOpenCart,
}) => {
  const { user, isAuthenticated, signOut, updatePhone, updateAddress } = useAuth();
  const { cartCount } = useCart();

  const [mounted, setMounted] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    deliveryAddress: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (user) {
      setPhoneNumberInput(user.phoneNumber?.replace(/\+91\s?/, '') || '');
      setAddressForm({
        deliveryAddress: user.deliveryAddress || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
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

  const vipWhatsAppUrl = generateWhatsAppLink({
    phone: FARM_INFO.whatsapp,
    customMessage: `Namaste JP Farms! I am ${user?.displayName || 'a member'} (Member ID: #${memberCode}). I would like to inquire regarding my breeder profile & orders.`,
  });

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

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.deliveryAddress.trim() || !addressForm.city.trim() || !addressForm.pincode.trim()) {
      alert('Please fill in street address, city, and pincode.');
      return;
    }
    updateAddress(addressForm);
    setIsEditingAddress(false);
    setSavedSuccessMsg('Delivery address saved for climate crate dispatches!');
    setTimeout(() => setSavedSuccessMsg(null), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto z-10 animate-in zoom-in-95 duration-200 max-h-[92vh]"
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
                <div className="pt-1 flex items-center justify-between text-xs">
                  {user.phoneNumber ? (
                    <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {user.phoneNumber}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">No phone number added yet</span>
                  )}
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SMS/WhatsApp Tracking Ready</span>
                  </span>
                </div>
              )}
            </div>

            {/* Saved Delivery Address Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-slate-800">Saved Delivery Address</span>
                </div>
                {!isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{user.deliveryAddress ? 'Edit Address' : '+ Add Address'}</span>
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="pt-2 space-y-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">House / Farm Address</label>
                    <textarea
                      rows={2}
                      value={addressForm.deliveryAddress}
                      onChange={(e) => setAddressForm({ ...addressForm, deliveryAddress: e.target.value })}
                      placeholder="Door No, Street, Landmark..."
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">City / Town</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="e.g. Bangalore"
                        className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="e.g. 560001"
                        className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="e.g. Karnataka / Andhra Pradesh"
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : user.deliveryAddress ? (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5">
                  <p className="font-semibold">{user.deliveryAddress}</p>
                  <p className="text-slate-500">
                    {user.city}
                    {user.state ? `, ${user.state}` : ''}
                    {user.pincode ? ` - ${user.pincode}` : ''}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No delivery address saved yet.</p>
              )}
            </div>

            {/* Quick Account Shortcuts */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenOrders) onOpenOrders();
                  else window.dispatchEvent(new CustomEvent('open-orders-drawer'));
                }}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-left font-bold transition active:scale-95 cursor-pointer group shadow-sm"
              >
                <Package className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition" />
                <p className="text-xs font-black">My Orders</p>
                <p className="text-[10px] text-slate-400">Live GPS tracking</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCart) onOpenCart();
                }}
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-left font-bold transition active:scale-95 cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ShoppingCart className="w-5 h-5 text-stone-950 group-hover:scale-110 transition" />
                  {cartCount > 0 && (
                    <span className="text-[10px] bg-stone-950 text-amber-300 font-black px-1.5 py-0.2 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <p className="text-xs font-black">My Cart</p>
                <p className="text-[10px] text-stone-800">Review selected birds</p>
              </button>
            </div>

            {/* Direct VIP WhatsApp & Sign Out */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={vipWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>VIP WhatsApp Desk</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
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
