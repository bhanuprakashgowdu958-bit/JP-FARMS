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
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cartStore';
import { useOrders } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';
import { GoogleIcon } from './GoogleSignInButton';
import { PhoneCaptureModal } from '@/components/PhoneCaptureModal';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
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

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryType, setDeliveryType] = useState<'doorstep_live_crate' | 'farm_pickup'>('doorstep_live_crate');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
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

    if (deliveryType === 'doorstep_live_crate' && (!formData.address || !formData.city)) {
      alert('Please provide your delivery address and city for live crate dispatch.');
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
        deliveryAddress: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim() || 'India',
        pincode: formData.pincode.trim() || '560001',
        deliveryType,
        paymentMethod,
        notes: formData.notes.trim(),
        status: 'confirmed',
      });

      // Auto-save phone and delivery address to profile & hardware storage for future 1-click orders
      if (effectivePhone.trim()) {
        try {
          updatePhone(effectivePhone.trim());
        } catch (e) {}
      }
      if (formData.address) {
        try {
          updateAddress({
            deliveryAddress: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          });
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
${deliveryType === 'doorstep_live_crate' ? `*Delivery Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` : ''}
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
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. Full-Width Top Header Bar */}
      <header className="shrink-0 px-4 sm:px-8 lg:px-12 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-stone-900 rounded-[10px] overflow-hidden flex items-center justify-center">
              <img src="/logo-square.png" alt="JP Farms Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Shopping Cart
              </h1>
              {cartCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  {cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              JP Farms Heritage Breeder Store & Avian Transit Dispatch
            </p>
          </div>
        </div>

        {/* Center Banner on Desktop */}
        <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-xl text-xs text-emerald-800 font-semibold">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Climate Crate Live Animal Delivery & Transit Care: <strong>Included Free</strong></span>
        </div>

        {/* Close Button */}
        <button
          onClick={closeCart}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-extrabold transition active:scale-95 cursor-pointer"
          aria-label="Close cart"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Value Assurance Strip (Mobile/Tablet) */}
      <div className="lg:hidden bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 px-4 py-2 border-b border-emerald-100 flex items-center space-x-2 text-[11px] text-emerald-800 font-medium shrink-0">
        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Live AC Crate Animal Delivery & Care: <strong>Included Free</strong></span>
      </div>

      {/* 2. Full-Screen Main Content Body */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8 overscroll-contain">
        <div className="max-w-6xl w-full mx-auto">
          
          {/* SUCCESS SCREEN */}
          {orderCompleted ? (
            <div className="max-w-xl mx-auto py-10 px-6 sm:px-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5 my-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Order Registered
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Thank You, {orderCompleted.customerName}!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your order <strong>#{orderCompleted.id}</strong> has been logged in JP Farms dispatch queue.
                </p>
              </div>

              <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-5 text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Order Amount:</span>
                  <span className="font-bold text-slate-900">₹{orderCompleted.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Delivery Method:</span>
                  <span className="font-bold text-slate-900">
                    {orderCompleted.deliveryType === 'doorstep_live_crate' ? '🚚 Climate Crate Doorstep Transit' : '🏡 Farm Pickup'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Preference:</span>
                  <span className="font-bold text-slate-900">
                    {orderCompleted.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Google Pay'}
                  </span>
                </div>
                {orderCompleted.deliveryAddress && (
                  <div className="flex justify-between pt-1 border-t border-sky-200/60">
                    <span className="text-slate-500 font-medium">Address:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[220px]">
                      {orderCompleted.deliveryAddress}, {orderCompleted.city}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Our farm dispatch manager will verify crate preparation and coordinate live GPS tracking with you directly on WhatsApp.
              </p>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 px-4 rounded-xl text-xs transition active:scale-95 shadow-md shadow-slate-900/10 cursor-pointer"
              >
                Continue Browsing Farm Showcase
              </button>
            </div>
          ) : items.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="max-w-md mx-auto py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 my-10 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore India&apos;s purest indigenous roosters and add them to your cart to order together.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-6 py-3 rounded-xl text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Explore Rooster Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: FULL SCREEN CART ITEMS VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                    <span>Selected Heritage Roosters</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      {cartCount} {cartCount === 1 ? 'Bird' : 'Birds'}
                    </span>
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const price = item.rooster.price || 9500;
                    const origPrice = item.rooster.originalPrice || Math.round(price * 1.25);
                    return (
                      <div 
                        key={item.rooster.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 group hover:border-amber-400 transition"
                      >
                        {/* Thumbnail */}
                        <div className="w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                          <img
                            src={item.rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                            alt={item.rooster.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono bg-black/85 text-amber-300 font-bold px-1.5 py-0.5 rounded shadow-sm">
                            #{item.rooster.tagId}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                                  {item.rooster.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.rooster.breed}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.rooster.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-baseline space-x-2">
                              <span className="font-black text-base text-slate-900">
                                ₹{(price * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {origPrice > price && (
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{(origPrice * item.quantity).toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                ₹{price.toLocaleString('en-IN')} / bird
                              </span>
                            </div>
                          </div>

                          {/* Controls & Badges */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Vaccinated Certified Stud</span>
                            </span>

                            <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() => updateQuantity(item.rooster.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition shadow-xs cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black px-2 text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.rooster.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition shadow-xs cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary (Sticky on Desktop) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                  <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-bold text-slate-500">{cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'}</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold text-slate-900">₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Direct Farm Savings:</span>
                        <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Climate Crate Live Packaging:</span>
                      <span className="text-emerald-700 font-black">FREE</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Veterinary Health Certificate:</span>
                      <span className="text-emerald-700 font-black">FREE</span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-extrabold text-sm text-slate-900">Total Payable:</span>
                      <span className="font-black text-2xl text-amber-600">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 px-4 rounded-2xl text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Buy ({cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'})</span>
                    <ArrowRight className="w-4 h-4 text-stone-950" />
                  </button>

                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Pure Indian Bloodline Certification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>AC Live Animal Crate Doorstep Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>WhatsApp Live GPS & Photo Verification</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STEP 2: FULL SCREEN CHECKOUT VIEW */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Checkout Details Form */}
              <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>← Back to Cart</span>
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    Step 2 of 2: Delivery & Handoff Details
                  </span>
                </div>

                {/* Delivery Type Option */}
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-2">
                    Select Delivery Method:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('doorstep_live_crate')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition cursor-pointer ${
                        deliveryType === 'doorstep_live_crate'
                          ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="font-extrabold">Doorstep Live Crate</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">AC climate vehicle with feed & hydration care</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('farm_pickup')}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition cursor-pointer ${
                        deliveryType === 'farm_pickup'
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-extrabold">Farm Pickup</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Direct handoff at JP Farms estate, Hoskote</p>
                    </button>
                  </div>
                </div>

                {/* Google Sign-in Verification Status */}
                {!isAuthenticated || !user ? (
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-orange-500/10 border-2 border-amber-400 rounded-2xl p-5 text-center space-y-3 shadow-xs">
                    <div className="flex items-center justify-center space-x-1.5 text-amber-900">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Sign-In Required to Place Order
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Please sign in with Google to confirm your reservation
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Guest accounts must sign in to activate live GPS climate crate tracking and WhatsApp dispatch updates.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-stone-50 text-slate-800 font-black py-3 px-6 rounded-xl border-2 border-amber-400 text-xs sm:text-sm shadow-xs transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>1-Click Sign In with Google</span>
                      </button>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        ⚡ Instant verification • Your cart remains completely safe
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm leading-tight">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Verified</span>
                    </span>
                  </div>
                )}

                {/* Customer Information Fields */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs"
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  {hasPhone ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-slate-700 font-bold flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <span>WhatsApp Mobile Number</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPhoneModalOpen(true)}
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Change in Profile</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          readOnly
                          value={effectivePhone}
                          className="w-full px-4 py-2.5 pl-9 pr-32 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-900 font-mono text-xs font-semibold select-none cursor-not-allowed shadow-inner"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Profile Verified</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        🔒 Auto-detected from profile for live transit tracking
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5 flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        <span>WhatsApp Mobile Number</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-amber-950">Mobile Not in Profile</p>
                            <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                              Required for live climate crate dispatch & WhatsApp delivery tracking.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsPhoneModalOpen(true)}
                              className="mt-2.5 inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-4 py-2 rounded-xl text-xs shadow-xs active:scale-95 transition cursor-pointer"
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
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">
                          Delivery Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House/Plot no., Street, Area"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Bangalore"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="560001"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Payment Mode Selection */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">
                      Payment Preference:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Cash on Delivery
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'border-sky-500 bg-sky-50 text-sky-950 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        UPI / Google Pay
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">
                      Special Delivery Instructions (Optional):
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before dispatch, morning arrival preferred"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 text-xs resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Order Review & Submit */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                  <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Order Review</span>
                    <span className="text-xs font-bold text-slate-500">{cartCount} {cartCount === 1 ? 'Rooster' : 'Roosters'}</span>
                  </h3>

                  {/* Mini items list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.rooster.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                        <div className="flex items-center space-x-2 truncate pr-2">
                          <img
                            src={item.rooster.images[0]}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-bold text-slate-800 truncate">{item.rooster.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 shrink-0">
                          ₹{((item.rooster.price || 9500) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Live Animal Crate Delivery:</span>
                      <span className="text-emerald-700 font-black">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Health Pass & Pedigree Certificate:</span>
                      <span className="text-emerald-700 font-black">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-extrabold text-sm text-slate-900">Total Payable:</span>
                      <span className="font-black text-2xl text-amber-600">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Submission Action Button */}
                  {!isAuthenticated || !user ? (
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="w-full flex items-center justify-center space-x-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 px-4 rounded-2xl text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer animate-pulse"
                    >
                      <GoogleIcon className="w-4 h-4 shrink-0" />
                      <span>Sign in with Google to Place Order</span>
                    </button>
                  ) : !hasPhone ? (
                    <button
                      type="button"
                      onClick={() => setIsPhoneModalOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 px-4 rounded-2xl text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 animate-pulse cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Update Mobile in Profile to Place Order</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 px-4 rounded-2xl text-sm transition shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${cartTotal.toLocaleString('en-IN')})`}</span>
                    </button>
                  )}

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 pt-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verified WhatsApp Live Handoff • 100% Bio-Secure</span>
                  </div>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Quick In-Place Phone Capture Modal (Never Leaves Checkout) */}
      <PhoneCaptureModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
};
