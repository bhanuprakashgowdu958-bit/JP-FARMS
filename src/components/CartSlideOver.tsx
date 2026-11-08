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
  const { user, isAuthenticated, signInWithGoogle, updateAddress } = useAuth();
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

      // Auto-save delivery address to profile for future 1-click orders
      if (user && formData.address) {
        updateAddress({
          deliveryAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        });
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
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
            <span>Climate Crate Live Animal Delivery & Transit Care: <strong>Included Free</strong></span>
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

                {/* Delivery Type Option */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Select Delivery Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('doorstep_live_crate')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        deliveryType === 'doorstep_live_crate'
                          ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>Doorstep Live Crate</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">AC vehicle with food/water</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('farm_pickup')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        deliveryType === 'farm_pickup'
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Farm Pickup</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Direct handoff at estate</p>
                    </button>
                  </div>
                </div>

                {/* Google Sign In Helper in Checkout */}
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-amber-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{user.displayName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Google Verified
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-slate-800 font-bold py-2.5 px-3 rounded-xl border border-slate-300 text-xs shadow-xs transition hover:border-amber-400 active:scale-[0.99]"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span>Sign in with Google to auto-fill details</span>
                  </button>
                )}

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
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Delivery Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House/Plot no., Street, Area"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Bangalore"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="560001"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-sky-500 text-xs"
                          />
                        </div>
                      </div>
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

                {!hasPhone ? (
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 animate-pulse"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Update Mobile in Profile to Place Order</span>
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
    </div>
  );
};

