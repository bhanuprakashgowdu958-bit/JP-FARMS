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
  MessageCircle, 
  Sparkles,
  MapPin,
  Lock,
  Phone,
  Edit2,
  AlertTriangle,
  Navigation,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cartStore';
import { useOrders } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';
import { GoogleIcon } from './GoogleSignInButton';
import { PhoneCaptureModal } from '@/components/PhoneCaptureModal';
import { AddressCaptureModal } from '@/components/AddressCaptureModal';
import { FARM_INFO, FARM_LOCATION } from '@/lib/data';
import { generateWhatsAppLink, calculateDistanceKm } from '@/lib/utils';
import { RoosterOrder } from '@/types/rooster';

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

  // Auto-fill customer details from profile & saved address
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        phone: user.phoneNumber || prev.phone,
        address: prev.address || user.deliveryAddress || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);

  const effectivePhone = user?.phoneNumber || formData.phone;
  const hasPhone = Boolean(effectivePhone && effectivePhone.trim().replace(/\D/g, '').length >= 10);

  const effectiveAddress = formData.address || user?.deliveryAddress || '';
  const effectiveCity = formData.city || user?.city || '';
  const effectivePincode = formData.pincode || user?.pincode || '';
  const hasAddress = Boolean(effectiveAddress && effectiveAddress.trim().length >= 3);

  const handleDetectGpsAddress = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter address manually.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
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

            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#f59e0b', '#10b981', '#0ea5e9'],
            });
          } else {
            alert('Could not determine address from GPS coordinates. Please update address manually.');
          }
        } catch (err) {
          console.error('GPS reverse geocode error:', err);
          alert('GPS detected your coordinates, but address lookup failed. Please enter your address manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location permission was denied. Please allow location access in your browser settings or enter your address manually.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location position unavailable. Please check your device GPS / network and try again.');
        } else if (error.code === error.TIMEOUT) {
          alert('Location request timed out. Please try again.');
        } else {
          alert('Failed to detect GPS location. Please enter your address manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<RoosterOrder | null>(null);

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
        customerName: formData.name.trim(),
        phoneNumber: effectivePhone.trim(),
        deliveryAddress: deliveryType === 'doorstep_live_crate' ? fullAddress : 'Farm Pickup - JP Farms Breeder Estate',
        city: (effectiveCity || 'Vijayawada').trim(),
        state: (user?.state || formData.state || 'Andhra Pradesh').trim(),
        pincode: (effectivePincode || '520010').trim(),
        deliveryType,
        paymentMethod,
        notes: formData.notes.trim(),
        status: 'confirmed',
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

      // Prepare WhatsApp message
      const itemsListText = items.map((item, idx) => 
        `${idx + 1}. *${item.rooster.name}* (Tag #${item.rooster.tagId}) - ₹${(item.rooster.price || 9500).toLocaleString('en-IN')} x ${item.quantity}`
      ).join('\n');

      const whatsAppMsg = `🐓 *NEW ORDER PLACED ON JP FARMS WEBSITE!*

*Order ID:* ${newOrder.id}
*Customer Name:* ${formData.name}
*Phone:* ${effectivePhone}
*Delivery Type:* ${deliveryType === 'doorstep_live_crate' ? '🚚 Climate-Controlled Live Animal Crate Dispatch' : '🏡 Self Farm Pickup'}
${deliveryType === 'doorstep_live_crate' ? `*Delivery Address:* ${effectiveAddress}${formData.addressLine2?.trim() ? `\n*Landmark / Unit:* ${formData.addressLine2.trim()}` : ''}\n*City & PIN:* ${effectiveCity || 'Vijayawada'}${effectivePincode ? ` - ${effectivePincode}` : ''}` : ''}
*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Google Pay / PhonePe UPI'}

📦 *ORDERED BIRDS (${cartCount} items):*
${itemsListText}

💰 *TOTAL PAYABLE:* ₹${cartTotal.toLocaleString('en-IN')}

Please confirm availability and dispatch schedule. Thank you!`;

      const whatsAppUrl = generateWhatsAppLink({
        phone: FARM_INFO.whatsapp,
        customMessage: whatsAppMsg,
      });

      setOrderCompleted(newOrder);
      clearCart();
      setIsSubmitting(false);

      // Open WhatsApp in new tab
      window.open(whatsAppUrl, '_blank');

    } catch (err) {
      console.error('Order placement failed', err);
      setIsSubmitting(false);
      alert('Order could not be saved. Please try again or WhatsApp us directly.');
    }
  };

  const handleFinish = () => {
    setOrderCompleted(null);
    setStep('cart');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* SUCCESS SCREEN */}
            {orderCompleted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Order Registered
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Thank You, {orderCompleted.customerName}!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    Your order <strong>#{orderCompleted.id}</strong> has been logged in JP Farms dispatch queue.
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Amount:</span>
                    <span className="font-bold text-slate-900">₹{orderCompleted.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery:</span>
                    <span className="font-bold text-slate-900">
                      {orderCompleted.deliveryType === 'doorstep_live_crate' ? 'Live Crate Transit' : 'Farm Pickup'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-bold text-slate-900">
                      {orderCompleted.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Our farm dispatch manager will verify the crate preparation and coordinate live GPS tracking with you on WhatsApp.
                </p>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Continue Browsing Farm
                </button>
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
                                onClick={handleDetectGpsAddress}
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
                                value={effectiveAddress}
                                className="w-full px-3 py-2 pl-8 pr-3 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-900 text-xs font-semibold select-none cursor-not-allowed shadow-inner"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
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
                                <div className="mt-2 bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-2 border-dashed border-rose-300 rounded-xl p-3 shadow-xs space-y-2">
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

                                  <div className="pt-1 border-t border-rose-200/70 flex flex-col sm:flex-row gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setDeliveryType('farm_pickup')}
                                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black py-2 px-2.5 rounded-lg text-xs transition active:scale-95 text-center shadow-xs cursor-pointer"
                                    >
                                      🏡 Switch to Farm Pickup (Free)
                                    </button>
                                    <a
                                      href={generateWhatsAppLink({
                                        phone: FARM_INFO.whatsapp,
                                        customMessage: `Hello JP Farms! 🐓\n\nI want to order roosters from your website, but my delivery address (${effectiveAddress}) is ~${deliveryDistanceKm} km away (outside the 20 km local radius).\n\nCan we arrange a special long-distance AC vehicle or train dispatch?`
                                      })}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2.5 rounded-lg text-xs transition active:scale-95 text-center flex items-center justify-center space-x-1 shadow-xs"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>Special Transit Inquiry</span>
                                    </a>
                                  </div>
                                </div>
                              )
                            )}
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
                                    onClick={handleDetectGpsAddress}
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
                    onClick={() => setDeliveryType('farm_pickup')}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-rose-500/25 active:scale-95 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Outside 20 km Delivery Radius • Switch to Farm Pickup</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${cartTotal.toLocaleString('en-IN')})`}</span>
                  </button>
                )}

              </form>
            )}

          </div>

          {/* Drawer Footer (Sticky Actions when in Cart View) */}
          {!orderCompleted && items.length > 0 && step === 'cart' && (
            <div className="p-4 bg-white border-t border-slate-200 space-y-3 shadow-lg">
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

