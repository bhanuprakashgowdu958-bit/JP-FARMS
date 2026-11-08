'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Sparkles, 
  Award, 
  Phone, 
  MessageCircle, 
  ChevronRight,
  ExternalLink,
  Package,
  Calendar
} from 'lucide-react';
import { Rooster, RoosterOrder } from '@/types/rooster';
import { FARM_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';
import { useOrders } from '@/lib/roosterStore';
import { useAuth } from '@/lib/authStore';

interface CheckoutModalProps {
  rooster: Rooster | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (order: RoosterOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  rooster,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { addOrder } = useOrders();
  const { user, updatePhone } = useAuth();

  const [deliveryType, setDeliveryType] = useState<'doorstep_live_crate' | 'farm_pickup'>('doorstep_live_crate');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'advance_token'>('cod');
  
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<RoosterOrder | null>(null);

  if (!isOpen || !rooster) return null;

  const price = rooster.price || 9500;
  const originalPrice = rooster.originalPrice || Math.round(price * 1.25);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phoneNumber.trim()) {
      alert('Please provide your full name and phone number for the order.');
      return;
    }

    if (deliveryType === 'doorstep_live_crate' && (!deliveryAddress.trim() || !city.trim())) {
      alert('Please enter your complete delivery address and city for live-bird dispatch.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = addOrder({
        roosterId: rooster.id,
        roosterTag: rooster.tagId,
        roosterName: rooster.name,
        roosterBreed: rooster.breed,
        roosterImage: rooster.images[0] || '',
        price,
        items: [
          {
            roosterId: rooster.id,
            roosterTag: rooster.tagId,
            roosterName: rooster.name,
            roosterBreed: rooster.breed,
            roosterImage: rooster.images[0] || '',
            price,
            quantity: 1,
          },
        ],
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim() || 'JP Farms Estate Gate Pickup',
        city: city.trim() || 'Farm Gate',
        state: state.trim() || 'Andhra Pradesh',
        pincode: pincode.trim() || '500001',
        deliveryType,
        paymentMethod,
        notes: notes.trim(),
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      if (phoneNumber.trim()) {
        try {
          updatePhone(phoneNumber.trim());
        } catch (e) {}
      }

      setPlacedOrder(newOrder);
      onOrderSuccess?.(newOrder);
    } catch (err) {
      console.error('Error creating order', err);
      alert('Failed to place order. Please try again or message us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppOrderUrl = (order: RoosterOrder) => {
    const paymentLabel = 
      order.paymentMethod === 'cod' ? 'Cash on Delivery (Pay on Inspection)' :
      order.paymentMethod === 'upi' ? 'Instant UPI / QR' :
      'Advance Token (₹1,000)';

    const deliveryLabel = 
      order.deliveryType === 'doorstep_live_crate' ? 'Doorstep Climate Crate Delivery' : 'Farm Gate Paddock Pickup';

    const message = `*NEW ROOSTER ORDER - JP FARMS* 🐓
*Order ID:* ${order.id}
*Rooster:* ${order.roosterName}
*Tag ID:* #${order.roosterTag}
*Breed:* ${order.roosterBreed}
*Price:* ₹${order.price.toLocaleString('en-IN')}

*CUSTOMER DETAILS:*
- *Name:* ${order.customerName}
- *Phone:* ${order.phoneNumber}
- *Delivery Type:* ${deliveryLabel}
- *Address:* ${order.deliveryAddress}, ${order.city}, ${order.state} - ${order.pincode}
- *Payment Mode:* ${paymentLabel}
${order.notes ? `- *Notes:* ${order.notes}` : ''}

Please confirm bird availability and dispatch schedule. Thank you!`;

    return generateWhatsAppLink({
      phone: FARM_INFO.whatsapp,
      customMessage: message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header (E-commerce Style like Amazon/Flipkart) */}
        <div className="sticky top-0 z-20 bg-slate-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {placedOrder ? 'Order Confirmed!' : 'Express Rooster Checkout'}
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Genuine Heritage Bloodline • Health Guarantee</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {placedOrder ? (
            /* ============================================================ */
            /* ORDER SUCCESS SCREEN (Amazon/Zomato Style)                   */
            /* ============================================================ */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Order #{placedOrder.id}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{placedOrder.customerName}</span>! Your purebred rooster is reserved exclusively for you.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                  <img
                    src={placedOrder.roosterImage}
                    alt={placedOrder.roosterName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      TAG: {placedOrder.roosterTag}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {placedOrder.roosterName}
                    </h4>
                    <p className="text-xs text-slate-500">{placedOrder.roosterBreed}</p>
                    <p className="text-sm font-black text-emerald-700 mt-0.5">
                      ₹{placedOrder.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Delivery Mode:</span>
                    <span className="font-bold text-slate-800">
                      {placedOrder.deliveryType === 'doorstep_live_crate' ? 'Live Crate Doorstep' : 'Farm Gate Pickup'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-slate-800">
                      {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : placedOrder.paymentMethod === 'upi' ? 'Instant UPI' : 'Token Advance'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[240px]">
                      {placedOrder.city}, {placedOrder.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call-to-action on WhatsApp (Instant Dispatch Confirmation) */}
              <div className="space-y-3 max-w-lg mx-auto pt-2">
                <a
                  href={getWhatsAppOrderUrl(placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm shadow-xl shadow-emerald-700/25 transition active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Confirm on WhatsApp for Fastest Dispatch</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl text-xs transition"
                >
                  Continue Browsing JP Farms
                </button>
              </div>

            </div>
          ) : (
            /* ============================================================ */
            /* CHECKOUT FORM SCREEN                                         */
            /* ============================================================ */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Selected Rooster Mini Showcase */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-orange-50/50 border border-amber-200/80">
                <img
                  src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
                  alt={rooster.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border-2 border-white shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 shadow-xs">
                      #{rooster.tagId}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      In Stock
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 truncate mt-1">
                    {rooster.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{rooster.breed}</p>

                  <div className="flex items-baseline space-x-2 mt-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-950">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Option Selector (Doorstep vs Farm Gate) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  1. Select Delivery or Pickup
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div
                    onClick={() => setDeliveryType('doorstep_live_crate')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                      deliveryType === 'doorstep_live_crate'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === 'doorstep_live_crate' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className="text-xs">
                      <div className="flex items-center space-x-1">
                        <span className="font-extrabold text-slate-900">Doorstep Live-Bird Delivery</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Air-ventilated sanitized crate with feed & hydration. Handled safely.
                      </p>
                      <span className="inline-block mt-1 font-bold text-emerald-600 text-[11px]">
                        FREE Delivery Promotion
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryType('farm_pickup')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                      deliveryType === 'farm_pickup'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === 'farm_pickup' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-900">Farm Gate Paddock Pickup</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Visit JP Farms, inspect bird in person, collect directly from breeder.
                      </p>
                      <span className="inline-block mt-1 font-bold text-sky-600 text-[11px]">
                        Open 7 AM – 7 PM Daily
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Buyer Information Form */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  2. Buyer & Contact Information
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-1">Your Full Name *</span>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh Reddy"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-1">Mobile / WhatsApp Number *</span>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {deliveryType === 'doorstep_live_crate' && (
                    <>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-600 mb-1">Delivery Address *</span>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House/Plot No, Street / Farm Location"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <span className="block text-[11px] font-bold text-slate-600 mb-1">City / Town *</span>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Vijayawada"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold text-slate-600 mb-1">State</span>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Andhra Pradesh"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold text-slate-600 mb-1">Pincode</span>
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="520001"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">Special Instructions / Dispatch Notes (Optional)</span>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, delivery preferred in morning"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  3. Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Pay on inspection at doorstep or farm.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Instant UPI / QR</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Google Pay, PhonePe, Paytm, BHIM.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('advance_token')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      paymentMethod === 'advance_token'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">₹1,000 Token</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Reserve tag now, pay rest on delivery.
                    </p>
                  </div>

                </div>
              </div>

              {/* Price Calculation Bill (Amazon/Flipkart Style) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Bird Price ({rooster.name}):</span>
                  <span className="font-semibold text-slate-800">₹{price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sanitized Climate Crate & Health Certificate:</span>
                  <span className="font-semibold text-emerald-600">FREE (Saved ₹1,500)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Veterinary Deworming & Health Pass:</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
                  <span>Total Payable:</span>
                  <span className="text-lg text-emerald-700 font-black">₹{price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-4 px-6 rounded-2xl text-base shadow-xl shadow-amber-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-stone-950" />
                  <span>
                    {isSubmitting ? 'Confirming Order...' : `Place Order (₹${price.toLocaleString('en-IN')})`}
                  </span>
                  <ChevronRight className="w-5 h-5 text-stone-950" />
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  🔒 Safe & Secure Live-Bird Transaction • 100% Pure Indian Gamefowl Guarantee
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};

