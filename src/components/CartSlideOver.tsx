'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Lock,
  Phone,
  Edit2,
  AlertTriangle,
  Navigation,
  Loader2,
  Map
} from 'lucide-react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cartStore';
import { useOrders } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';
import { GoogleIcon } from './GoogleSignInButton';
import { PhoneCaptureModal } from '@/components/PhoneCaptureModal';
import { AddressCaptureModal } from '@/components/AddressCaptureModal';
import { FARM_INFO, FARM_LOCATION } from '@/lib/data';
import { calculateDistanceKm } from '@/lib/utils';
import { RoosterOrder } from '@/types/rooster';
import type { LocationSelectResult } from './DeliveryZoneMap';

const DeliveryZoneMap = dynamic(
  () => import('./DeliveryZoneMap').then((mod) => mod.DeliveryZoneMap),
  {
    ssr: false,
    loading: () => (
      <div className="mt-2.5 h-44 rounded-2xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-500 space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
        <span>Loading 20 km Delivery Radius Map...</span>
      </div>
    ),
  }
);

export const CartSlideOver: React.FC = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartCount, 
    cartTotal, 
    cartOriginalTotal, 
    cartDiscount 
  } = useCart();

  const { addOrder } = useOrders();
  const { user, isAuthenticated, signInWithGoogle, updatePhone, updateAddress } = useAuth();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number | null>(null);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(true);

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryType, setDeliveryType] = useState<'doorstep_live_crate' | 'farm_pickup'>('doorstep_live_crate');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const isStaleDummyAddress = (addr?: string, city?: string) => {
    const text = `${addr || ''} ${city || ''}`.toLowerCase();
    return text.includes('benz circle') || text.includes('vijayawada') || text.includes('sri rama colony') || text.includes('bhdhjjdh');
  };

  // Auto-fill customer details from profile & saved address
  useEffect(() => {
    if (user) {
      const cleanAddr = isStaleDummyAddress(user.deliveryAddress, user.city) ? '' : (user.deliveryAddress || '');
      const cleanCity = user.city === 'Vijayawada' ? '' : (user.city || '');
      const cleanPincode = (user.pincode === '520010' && isStaleDummyAddress(user.deliveryAddress, user.city)) ? '' : (user.pincode || '');

      setFormData((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        phone: user.phoneNumber || prev.phone,
        address: prev.address || cleanAddr,
        city: prev.city || cleanCity,
        state: prev.state || user.state || '',
        pincode: prev.pincode || cleanPincode,
      }));
    }
  }, [user]);

  const effectivePhone = user?.phoneNumber || formData.phone;
  const hasPhone = Boolean(effectivePhone && effectivePhone.trim().replace(/\D/g, '').length >= 10);

  const rawAddr = formData.address || user?.deliveryAddress || '';
  const rawCity = formData.city || user?.city || '';
  const rawPincode = formData.pincode || user?.pincode || '';

  const effectiveAddress = isStaleDummyAddress(rawAddr, rawCity) ? '' : rawAddr;
  const effectiveCity = rawCity === 'Vijayawada' ? '' : rawCity;
  const effectivePincode = (rawPincode === '520010' && isStaleDummyAddress(rawAddr, rawCity)) ? '' : rawPincode;
  const hasAddress = Boolean(effectiveAddress && effectiveAddress.trim().length >= 3);

  const handleDetectGpsAddress = (silent = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (!silent) {
        alert('Geolocation is not supported by your browser. Please enter address manually.');
      }
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setMapCoords({ lat: latitude, lng: longitude });
          const dist = calculateDistanceKm(
            FARM_LOCATION.lat,
            FARM_LOCATION.lng,
            latitude,
            longitude
          );
          setDeliveryDistanceKm(dist);

          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          if (!res.ok) throw new Error('Failed to resolve coordinates');
          const data = await res.json();

          if (data && data.success) {
            const newAddress = data.address || '';
            const newCity = data.city || '';
            const newState = data.state || 'Andhra Pradesh';
            const newPincode = data.pincode || '';

            setFormData((prev) => ({
              ...prev,
              address: newAddress,
              city: newCity,
              state: newState,
              pincode: newPincode,
            }));

            // Also persist to profile & hardware storage for future 1-click orders
            updateAddress({
              deliveryAddress: newAddress,
              city: newCity,
              state: newState,
              pincode: newPincode,
            });

            if (!silent) {
              confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#f59e0b', '#10b981', '#0ea5e9'],
              });
            }
          } else if (!silent) {
            alert('Could not determine address from GPS coordinates. Please update address manually.');
          }
        } catch (err) {
          console.error('GPS reverse geocode error:', err);
          if (!silent) {
            alert('GPS detected your coordinates, but address lookup failed. Please enter your address manually.');
          }
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        if (!silent) {
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location permission was denied. Please allow location access in your browser settings or enter your address manually.');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert('Location position unavailable. Please check your device GPS / network and try again.');
          } else if (error.code === error.TIMEOUT) {
            alert('Location request timed out. Please try again.');
          } else {
            alert('Failed to detect GPS location. Please enter your address manually.');
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Auto-detect GPS delivery location as soon as the user lands on the checkout screen!
  useEffect(() => {
    if (isOpen && step === 'checkout') {
      handleDetectGpsAddress(true);
    }
  }, [isOpen, step]);

  const handleMapLocationSelect = (result: LocationSelectResult) => {
    setDeliveryDistanceKm(result.distanceKm);
    setMapCoords({ lat: result.lat, lng: result.lng });

    if (result.address) {
      setFormData((prev) => ({
        ...prev,
        address: result.address || prev.address,
        city: result.city || prev.city,
        state: result.state || prev.state,
        pincode: result.pincode || prev.pincode,
      }));
      try {
        updateAddress({
          deliveryAddress: result.address,
          city: result.city || '',
          state: result.state || 'Andhra Pradesh',
          pincode: result.pincode || '',
        });
      } catch (e) {}
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<RoosterOrder | null>(null);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(3);

  // Auto-dismiss confirmed screen after 3 seconds so screen does not stay stuck
  useEffect(() => {
    if (!orderCompleted) {
      setAutoCloseSeconds(3);
      return;
    }

    setAutoCloseSeconds(3);
    const interval = setInterval(() => {
      setAutoCloseSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orderCompleted]);

  // Prevent background page from scrolling when shopping cart is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setStep('checkout');
  };

  const handleBackToCart = () => {
    setStep('cart');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Sign-In Required: Please sign in with your Google account in 1 click to reserve your roosters and enable live tracking.');
      signInWithGoogle();
      return;
    }
    if (!hasPhone) {
      setIsPhoneModalOpen(true);
      return;
    }

    if (!formData.name) {
      alert('Please provide your name.');
      return;
    }

    if (deliveryType === 'doorstep_live_crate' && !hasAddress) {
      setIsAddressModalOpen(true);
      return;
    }

    if (deliveryType === 'doorstep_live_crate' && deliveryDistanceKm !== null && deliveryDistanceKm > FARM_LOCATION.maxDeliveryRadiusKm) {
      alert(`Doorstep Delivery Unavailable: Your delivery address is ~${deliveryDistanceKm} km from our farm estate (exceeding our ${FARM_LOCATION.maxDeliveryRadiusKm} km safe live animal transit radius). Please choose 'Farm Pickup' or contact us on WhatsApp for special transit arrangements.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order items
      const orderItems = items.map((item) => ({
        roosterId: item.rooster.id,
        roosterTag: item.rooster.tagId,
        roosterName: item.rooster.name,
        roosterBreed: item.rooster.breed,
        roosterImage: item.rooster.images[0] || '',
        price: item.rooster.price || 9500,
        quantity: item.quantity,
      }));

      const primaryItem = items[0].rooster;

      const fullAddress = formData.addressLine2?.trim()
        ? `${effectiveAddress.trim()}, ${formData.addressLine2.trim()}`
        : effectiveAddress.trim();

      // Save to store
      const newOrder = addOrder({
        roosterId: primaryItem.id,
        roosterTag: items.map((i) => `#${i.rooster.tagId}`).join(', '),
        roosterName: items.length === 1 ? primaryItem.name : `${primaryItem.name} + ${items.length - 1} more`,
        roosterBreed: items.map((i) => i.rooster.breed).join(', '),
        roosterImage: primaryItem.images[0] || '',
        price: cartTotal,
        items: orderItems,
        userId: user?.uid,
        userEmail: user?.email || undefined,
        customerName: formData.name.trim(),
        phoneNumber: effectivePhone.trim(),
        deliveryAddress: deliveryType === 'doorstep_live_crate' ? fullAddress : 'Farm Pickup - JP Farms Breeder Estate',
        city: (effectiveCity || 'Palamaner').trim(),
        state: (user?.state || formData.state || 'Andhra Pradesh').trim(),
        pincode: (effectivePincode || '517408').trim(),
        deliveryType,
        paymentMethod,
        notes: formData.notes.trim(),
        status: 'pending_approval',
      });

      // Auto-save phone to profile & hardware storage for future 1-click orders
      if (effectivePhone.trim()) {
        try {
          updatePhone(effectivePhone.trim());
        } catch (e) {}
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#0284c7', '#ec4899'],
      });

      setOrderCompleted(newOrder);
      clearCart();
      setIsSubmitting(false);
    } catch (err) {
      console.error('Order placement failed', err);
      setIsSubmitting(false);
      alert('Order could not be saved. Please try again.');
    }
  };

  const handleFinish = () => {
    setOrderCompleted(null);
    setStep('cart');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden overscroll-contain">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col overscroll-contain">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <span>Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount} {cartCount === 1 ? 'Bird' : 'Birds'}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-500">JP Farms Heritage Breeder Store</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Value Assurance Strip */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 px-4 py-2 border-b border-emerald-100 flex items-center space-x-2 text-[11px] text-emerald-800 font-medium">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Climate Crate Live Animal Delivery: <strong>Free (Within 20 km of Farm Estate)</strong></span>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
            
            {/* SUCCESS SCREEN */}
            {orderCompleted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ✓ Order Confirmed
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    Thank you, <strong>{orderCompleted.customerName}</strong>! Your order <strong>#{orderCompleted.id}</strong> is confirmed and submitted to JP Farms.
                  </p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs shadow-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                    <span className="text-emerald-950 font-black text-sm">Order #{orderCompleted.id}</span>
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Amount:</span>
                    <span className="font-extrabold text-slate-900">₹{orderCompleted.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Mode:</span>
                    <span className="font-bold text-slate-900">
                      {orderCompleted.deliveryType === 'doorstep_live_crate' ? '🚚 Climate Crate Doorstep' : '🏡 Farm Gate Pickup'}
                    </span>
                  </div>
                  {orderCompleted.deliveryType === 'doorstep_live_crate' && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Destination:</span>
                      <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                        {orderCompleted.deliveryAddress}, {orderCompleted.city}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-bold text-slate-900">
                      {orderCompleted.paymentMethod === 'cod' ? 'Cash on Delivery (Pay at Unboxing)' : 'UPI Payment'}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-950 leading-snug">
                      Farm dispatch manager has received your order. You will receive live status updates in the <strong>Alerts</strong> bell icon above as your birds are prepared and dispatched.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${(autoCloseSeconds / 3) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>Continue Browsing Farm ({autoCloseSeconds}s)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Returning to store automatically in {autoCloseSeconds}s...
                  </p>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* EMPTY CART STATE */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore India's purest indigenous roosters and add them to your cart to order together.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition hover:scale-105 active:scale-95"
                >
                  <span>Explore Roosters Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : step === 'cart' ? (
              /* STEP 1: CART ITEMS VIEW */
              <div className="space-y-4">
                
                {/* List of Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const price = item.rooster.price || 9500;
                    const origPrice = item.rooster.originalPrice || Math.round(price * 1.25);
                    return (
                      <div 
                        key={item.rooster.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs flex space-x-3 group hover:border-amber-400 transition"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                          <img
                            src={item.rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                            alt={item.rooster.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-black/80 text-amber-300 px-1 py-0.2 rounded">
                            #{item.rooster.tagId}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                                  {item.rooster.name}
                                </h4>
                                <p className="text-[10px] text-slate-500">{item.rooster.breed}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.rooster.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="mt-1 flex items-baseline space-x-2">
                              <span className="font-black text-sm text-slate-900">
                                ₹{(price * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {origPrice > price && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{(origPrice * item.quantity).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              ✓ Vaccinated Stud
                            </span>

                            <div className="flex items-center space-x-1.5 bg-slate-100 rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.rooster.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 transition"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1 text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.rooster.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 transition"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clear Cart Button */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-rose-600 transition"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Price Breakdown Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal ({cartCount}):</span>
                    <span>₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Direct Farm Savings:</span>
                      <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Live Climate Crate Packaging:</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Veterinary Certificate & Transit Pass:</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-extrabold text-sm text-slate-900">Total Payable:</span>
                    <span className="font-black text-xl text-amber-700">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              /* STEP 2: CHECKOUT FORM */
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1"
                  >
                    <span>← Back to Cart</span>
                  </button>
                  <span className="text-xs font-bold text-slate-600">
                    Order Total: <strong className="text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                {/* Guest Sign-In Notification Banner OR Verified Member Banner */}
                {!isAuthenticated || !user ? (
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-orange-500/10 border-2 border-amber-400 rounded-2xl p-4 text-center space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-center space-x-1.5 text-amber-900">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Sign-In Required to Place Order
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">
                      Please sign in with Google to confirm your reservation
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Guest accounts must sign in to activate live GPS climate crate tracking and WhatsApp dispatches.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-slate-800 font-bold py-2.5 px-3 rounded-xl border-2 border-amber-400 text-xs shadow-xs transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>1-Click Sign In with Google</span>
                      </button>
                      <p className="text-[10px] text-slate-400 mt-1">
                        ⚡ Instant verification • Your cart remains safe
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Customer Information */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500 text-xs"
                    />
                  </div>

                  {/* WhatsApp Mobile Number - Linked to Profile */}
                  {hasPhone ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 font-semibold flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-amber-600" />
                          <span>Mobile Number</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPhoneModalOpen(true)}
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-bold hover:underline flex items-center space-x-1"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          <span>Change in Profile</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          readOnly
                          value={effectivePhone}
                          className="w-full px-3 py-2 pl-8 pr-28 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-900 font-mono text-xs font-semibold select-none cursor-not-allowed shadow-inner"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Profile Verified</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                        <span>🔒 Auto-detected from profile (cannot be edited directly)</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>Mobile Number</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-xl p-3 shadow-xs">
                        <div className="flex items-start space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-amber-950">Mobile Not in Profile</p>
                            <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                              Required for live climate crate dispatch & WhatsApp delivery tracking. Please update your mobile in your profile.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsPhoneModalOpen(true)}
                              className="mt-2 inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs shadow-xs active:scale-95 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Update Mobile in Profile</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {deliveryType === 'doorstep_live_crate' && (
                    <>
                      {hasAddress ? (
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-slate-700 font-semibold flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-amber-600" />
                                <span>Delivery Address</span>
                                <span className="text-rose-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleDetectGpsAddress(false)}
                                disabled={isLocating}
                                className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 bg-amber-100/90 hover:bg-amber-200/90 px-2.5 py-0.5 rounded-lg border border-amber-300 transition active:scale-95 cursor-pointer disabled:opacity-50 shadow-2xs"
                                title="Auto-detect current delivery address via device GPS"
                              >
                                {isLocating ? (
                                  <>
                                    <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-700" />
                                    <span>Detecting GPS...</span>
                                  </>
                                ) : (
                                  <>
                                    <Navigation className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                                    <span>Auto-Detect GPS</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                name="address"
                                readOnly
                                value={
                                  isLocating && !effectiveAddress
                                    ? '📡 Auto-detecting your delivery location via GPS...'
                                    : effectiveAddress
                                }
                                placeholder="Auto-detecting your delivery location via GPS..."
                                className={`w-full px-3 py-2 pl-8 pr-3 rounded-xl border text-xs font-semibold select-none cursor-not-allowed shadow-inner ${
                                  isLocating && !effectiveAddress
                                    ? 'border-amber-400 bg-amber-50 text-amber-900 animate-pulse'
                                    : 'border-slate-300 bg-slate-100/90 text-slate-900'
                                }`}
                              />
                              {isLocating && !effectiveAddress ? (
                                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin absolute left-2.5 top-1/2 -translate-y-1/2" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                              <span>🔒 Auto-detected via GPS & profile (cannot be edited directly)</span>
                            </p>

                            {/* 20 km Delivery Radius Indicator */}
                            {deliveryDistanceKm !== null && (
                              deliveryDistanceKm <= FARM_LOCATION.maxDeliveryRadiusKm ? (
                                <div className="mt-1.5 flex items-center space-x-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="font-semibold">
                                    Within live delivery radius (~{deliveryDistanceKm} km from Farm Estate) • Eligible for Live Crate
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-2 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-2 border-dashed border-rose-300 rounded-xl p-3 shadow-xs">
                                  <div className="flex items-start space-x-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-black text-rose-950">
                                        Doorstep Delivery Unavailable at this Location
                                      </p>
                                      <p className="text-[11px] text-rose-800 leading-snug mt-0.5">
                                        Your address is <strong>~{deliveryDistanceKm} km</strong> from JP Farms Estate (exceeds our <strong>20 km</strong> safe live animal transit radius).
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}

                            {/* Interactive 20 km Delivery Zone Map with Draggable Pin */}
                            <div className="mt-2.5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                                  <Map className="w-3 h-3 text-amber-600" />
                                  <span>20 km Delivery Radius Map (Drag Pin Anywhere)</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowMap(!showMap)}
                                  className="text-[10px] text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                                >
                                  {showMap ? 'Hide Map' : 'Show Map'}
                                </button>
                              </div>

                              {showMap && (
                                <DeliveryZoneMap
                                  initialLat={mapCoords?.lat || null}
                                  initialLng={mapCoords?.lng || null}
                                  onLocationSelect={handleMapLocationSelect}
                                />
                              )}
                            </div>
                          </div>

                          {/* Address Line 2 / Landmark / Apartment */}
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                              Address Line 2 / Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              name="addressLine2"
                              value={formData.addressLine2}
                              onChange={handleInputChange}
                              placeholder="e.g. Landmark, Apartment, Floor, Gate details"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                readOnly
                                value={effectiveCity}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-700 text-xs font-medium cursor-not-allowed shadow-inner"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1">
                                Pincode
                              </label>
                              <input
                                type="text"
                                name="pincode"
                                readOnly
                                value={effectivePincode}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-700 text-xs font-medium cursor-not-allowed shadow-inner"
                              />
                            </div>
                          </div>
                        </>
                      ) : isLocating ? (
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Delivery Address</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-amber-950 animate-pulse shadow-xs">
                            <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
                            <div>
                              <p className="font-extrabold text-amber-950">Auto-Detecting Your Delivery Location via GPS...</p>
                              <p className="text-[11px] text-amber-800 mt-0.5">
                                Please allow location access if prompted. Pinning your exact delivery coordinates and calculating 20 km live transit radius.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Delivery Address</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-xl p-3 shadow-xs">
                            <div className="flex items-start space-x-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-amber-950">Address Not in Profile</p>
                                <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                                  Required for live climate crate dispatch and route planning. Please auto-detect via GPS or enter your address.
                                </p>
                                <div className="mt-2.5 flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleDetectGpsAddress(false)}
                                    disabled={isLocating}
                                    className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs shadow-xs active:scale-95 transition cursor-pointer disabled:opacity-50"
                                  >
                                    {isLocating ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Detecting GPS...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Navigation className="w-3.5 h-3.5 fill-current" />
                                        <span>Auto-Detect GPS</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="inline-flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Type Manually</span>
                                  </button>
                                </div>

                                {/* Interactive Map in Address Fallback */}
                                <div className="mt-3">
                                  <DeliveryZoneMap
                                    initialLat={mapCoords?.lat || null}
                                    initialLng={mapCoords?.lng || null}
                                    onLocationSelect={handleMapLocationSelect}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Payment Mode Selection */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Payment Preference:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        Cash on Delivery
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition ${
                          paymentMethod === 'upi'
                            ? 'border-sky-500 bg-sky-50 text-sky-950 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        UPI / Google Pay
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Special Delivery Instructions (Optional):
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before dispatch, morning arrival preferred"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500 text-xs resize-none"
                    />
                  </div>
                </div>

                {!isAuthenticated || !user ? (
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center space-x-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer animate-pulse"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span>Sign in with Google to Place Order (₹{cartTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4 text-stone-950" />
                  </button>
                ) : !hasPhone ? (
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 animate-pulse"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Update Mobile in Profile to Place Order</span>
                  </button>
                ) : deliveryType === 'doorstep_live_crate' && deliveryDistanceKm !== null && deliveryDistanceKm > FARM_LOCATION.maxDeliveryRadiusKm ? (
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center space-x-2 bg-slate-300 text-slate-600 font-bold py-3.5 px-4 rounded-xl text-xs cursor-not-allowed select-none shadow-none"
                  >
                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                    <span>Outside 20 km Delivery Radius (Undeliverable)</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming Order...' : `Confirm & Place Order (₹${cartTotal.toLocaleString('en-IN')})`}</span>
                  </button>
                )}

              </form>
            )}

          </div>

          {/* Drawer Footer (Sticky Actions when in Cart View) */}
          {!orderCompleted && items.length > 0 && step === 'cart' && (
            <div className="p-4 pb-safe bg-white border-t border-slate-200 space-y-3 shadow-lg">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500 font-medium">Subtotal ({cartCount} birds):</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/25 active:scale-95"
              >
                <span>Proceed to Buy ({cartCount} items)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Verified WhatsApp Live Handoff • 100% Bio-Secure Live Transit</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Quick In-Place Phone Capture Modal (Never Leaves Checkout) */}
      <PhoneCaptureModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      {/* Quick In-Place Address Capture Modal (Never Leaves Checkout) */}
      <AddressCaptureModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};

