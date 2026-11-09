'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  CheckCircle2, 
  X,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '@/lib/authStore';

interface AddressCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressCaptureModal: React.FC<AddressCaptureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateAddress } = useAuth();
  const [formData, setFormData] = useState({
    deliveryAddress: user?.deliveryAddress || '',
    city: user?.city || '',
    state: user?.state || 'Andhra Pradesh',
    pincode: user?.pincode || '',
  });

  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setFormData({
        deliveryAddress: user.deliveryAddress || '',
        city: user.city || '',
        state: user.state || 'Andhra Pradesh',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  if (!isOpen || !mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.deliveryAddress.trim() || formData.deliveryAddress.trim().length < 5) {
      setError('Please enter a valid street / delivery address');
      return;
    }

    if (!formData.city.trim()) {
      setError('Please enter your city');
      return;
    }

    updateAddress({
      deliveryAddress: formData.deliveryAddress.trim(),
      city: formData.city.trim(),
      state: formData.state.trim() || 'India',
      pincode: formData.pincode.trim() || '560001',
    });

    setIsSuccess(true);
    setError('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#0ea5e9'],
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Address Updated!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your delivery address has been saved to your profile for 1-click orders.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-md shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Update Delivery Address
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Auto-saved to your verified breeder profile for live AC crate dispatches.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Street / Area Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Plot/Door no, Street, Colony, Area"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Vijayawada"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="520010"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Save Address to Profile</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & Linked to your Google Profile</span>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
