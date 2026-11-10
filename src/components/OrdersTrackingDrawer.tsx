'use client';

import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Search, 
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { RoosterOrder } from '@/types/rooster';
import { useOrders } from '@/lib/roosterStore';
import { useAuth, isBhanuEmail } from '@/lib/authStore';
import { GoogleIcon } from '@/components/GoogleSignInButton';
import { FARM_INFO } from '@/lib/data';

interface OrdersTrackingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCatalog?: () => void;
  onBack?: () => void;
}

export const OrdersTrackingDrawer: React.FC<OrdersTrackingDrawerProps> = ({
  isOpen,
  onClose,
  onExploreCatalog,
  onBack,
}) => {
  const { orders } = useOrders();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_approval' | 'confirmed' | 'dispatched' | 'delivered' | 'rejected'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleBack = () => {
    onClose();
    if (onBack) {
      onBack();
    } else {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-side-menu'));
      }, 50);
    }
  };

  if (!isOpen) return null;

  const isAdmin = isBhanuEmail(user?.email);

  // Clean user digits for phone matching
  const userPhoneDigits = user?.phoneNumber?.replace(/\D/g, '') || '';
  const userDisplayName = user?.displayName?.toLowerCase().trim() || '';

  // Filter orders strictly by customer privacy
  const filteredOrders = orders.filter((order) => {
    // 1. Customer Privacy Isolation:
    // If not Admin, ONLY allow orders that belong to this customer
    if (!isAdmin) {
      if (!user) {
        // If guest, only show order if they searched by exact Order ID or phone number
        if (!searchQuery.trim()) return false;
        const q = searchQuery.toLowerCase().trim();
        const matchesExactId = order.id.toLowerCase() === q;
        const matchesExactPhone = order.phoneNumber.replace(/\D/g, '').length >= 10 && order.phoneNumber.replace(/\D/g, '') === q.replace(/\D/g, '');
        if (!matchesExactId && !matchesExactPhone) return false;
      } else {
        const orderPhone = (order.phoneNumber || '').replace(/\D/g, '');
        const matchesPhone = userPhoneDigits.length >= 10 && (orderPhone.endsWith(userPhoneDigits.slice(-10)) || userPhoneDigits.endsWith(orderPhone.slice(-10)));
        const matchesUserId = Boolean(user.uid && order.userId === user.uid);
        const matchesEmail = Boolean(user.email && order.userEmail && order.userEmail.toLowerCase() === user.email.toLowerCase());
        const matchesName = Boolean(userDisplayName && order.customerName && order.customerName.toLowerCase().trim() === userDisplayName);

        if (!matchesPhone && !matchesUserId && !matchesEmail && !matchesName) {
          return false;
        }
      }
    }

    // 2. Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesName = order.customerName.toLowerCase().includes(q);
      const matchesPhone = order.phoneNumber.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
      const matchesBird = order.roosterName.toLowerCase().includes(q) || order.roosterTag.toLowerCase().includes(q);
      const matchesCity = order.city.toLowerCase().includes(q);
      if (!matchesId && !matchesName && !matchesPhone && !matchesBird && !matchesCity) {
        return false;
      }
    }

    // 3. Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    return true;
  });

  const handleCopyOrderId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Top Header (Amazon/Flipkart Style) */}
          <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-900 via-stone-900 to-slate-950 text-white border-b border-stone-800 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="p-2 -ml-1 text-amber-400 hover:text-amber-300 bg-white/5 hover:bg-white/10 active:scale-95 rounded-xl border border-white/10 transition flex items-center space-x-1 shrink-0 cursor-pointer group"
                aria-label="Go back to menu"
                title="Go back to menu"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-bold">Back</span>
              </button>

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white truncate">
                    Returns & Orders
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full whitespace-nowrap">
                    Live GPS Tracker
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                  Real-time bio-secure climate crate delivery updates
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="Close orders drawer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Bar (if logged in) */}
          {user && (
            <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{user.displayName}</span>
                {user.phoneNumber && (
                  <span className="text-[10px] text-slate-600 font-mono">({user.phoneNumber})</span>
                )}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ Account Orders Synced
              </span>
            </div>
          )}

          {/* Search & Filter Strip */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. #JP-ORD-...), Name, Bird or City..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 text-xs">
              {(
                [
                  { id: 'all', label: `All Orders (${orders.length})` },
                  { id: 'pending_approval', label: '⏳ Under Review' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'dispatched', label: '🚚 In Transit' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'rejected', label: '✕ Not Approved' },
                ] as const
              ).map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilterStatus(chip.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                    filterStatus === chip.id
                      ? 'bg-slate-900 text-amber-300 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {searchQuery ? 'No matching orders found' : 'No Orders Placed Yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No orders match "${searchQuery}". Please check your order ID or phone number.`
                    : 'When you purchase a heritage rooster, live climate-controlled transit tracking and delivery progress will appear here.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExploreCatalog?.();
                    }}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                  >
                    <span>Explore Rooster Showcase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Menu</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isConfirmed = order.status === 'confirmed' || order.status === 'dispatched' || order.status === 'delivered';
                const isDispatched = order.status === 'dispatched' || order.status === 'delivered';
                const isDelivered = order.status === 'delivered';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-amber-300 transition"
                  >
                    {/* Order Card Top Bar */}
                    <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {order.id}
                          </span>
                          <button
                            onClick={() => handleCopyOrderId(order.id)}
                            className="text-slate-400 hover:text-slate-700 transition"
                            title="Copy Order ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedId === order.id && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              Copied!
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Placed: {order.orderDate}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {order.deliveryType === 'doorstep_live_crate' ? (
                          <span className="inline-flex items-center space-x-1 bg-sky-50 text-sky-800 border border-sky-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <Truck className="w-3 h-3 text-sky-600" />
                            <span>Live AC Crate</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Farm Gate Pickup</span>
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : order.status === 'dispatched'
                              ? 'bg-sky-100 text-sky-900 border border-sky-300 animate-pulse'
                              : order.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                              : order.status === 'rejected'
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {order.status === 'delivered'
                            ? '✓ Delivered (Closed)'
                            : order.status === 'dispatched'
                            ? '🚚 In Transit'
                            : order.status === 'pending_approval'
                            ? '⏳ Awaiting Review'
                            : order.status === 'rejected'
                            ? '✕ Not Approved'
                            : '🟡 Preparing Crate'}
                        </span>
                      </div>
                    </div>

                    {/* Bird Items Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={order.roosterImage || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=300&q=80'}
                          alt={order.roosterName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                                {order.roosterName}
                              </h4>
                              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                                {order.roosterBreed}
                              </p>
                              <span className="inline-block mt-1 font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                                {order.roosterTag}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-black text-slate-900">
                                ₹{order.price.toLocaleString('en-IN')}
                              </span>
                              <p className="text-[10px] text-slate-500 font-medium">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (UPI)'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Status Section: Rejected Notice vs Pending Notice vs Live Stepper */}
                      {order.status === 'rejected' ? (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-1.5 text-xs">
                          <div className="flex items-center space-x-2 text-rose-900 font-extrabold">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Order Not Approved by JP Farms Management</span>
                          </div>
                          <p className="text-rose-800 leading-relaxed text-[11px]">
                            <strong>Reason:</strong> {order.rejectionReason || 'Destination outside delivery zone or bird under veterinary quarantine.'}
                          </p>
                          <p className="text-stone-500 text-[10px] pt-1 border-t border-rose-200/60">
                            If you would like to arrange farm self-pickup or discuss alternative breeds, please contact our helpline desk.
                          </p>
                        </div>
                      ) : order.status === 'pending_approval' ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5 text-xs">
                          <div className="flex items-center space-x-2 text-amber-950 font-extrabold">
                            <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                            <span>Awaiting Farm Estate Verification</span>
                          </div>
                          <p className="text-amber-900 leading-relaxed text-[11px]">
                            Your order has been received! Our farm director is reviewing the avian health warranty exam and scheduling climate crate transport. You will receive an immediate chime notification upon approval.
                          </p>
                        </div>
                      ) : (
                        /* Amazon/Flipkart-Style 4-Step Live Tracking Stepper */
                        <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200/80">
                          <div className="flex items-center justify-between mb-3 text-xs">
                            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                              <Truck className="w-3.5 h-3.5 text-amber-600" />
                              <span>Live Crate Dispatch Progress</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {order.status === 'delivered' ? 'Completed' : 'Active Transit'}
                            </span>
                          </div>

                          {/* Stepper Progress Bar */}
                          <div className="relative">
                            {/* Background Connecting Line */}
                            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                            
                            {/* Active Filled Line */}
                            <div 
                              className="absolute top-3.5 left-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                              style={{
                                width: order.status === 'delivered' ? '100%' : order.status === 'dispatched' ? '66%' : '33%'
                              }}
                            />

                            {/* 4 Nodes */}
                            <div className="relative z-10 grid grid-cols-4 gap-1 text-center">
                              {/* Step 1: Confirmed */}
                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 mt-1 leading-tight">
                                  Order Booked
                                </span>
                                <span className="text-[9px] text-slate-400">Estate Confirmed</span>
                              </div>

                              {/* Step 2: Vet & Crate Sanitized */}
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                                  isConfirmed
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 mt-1 leading-tight">
                                  Vet Pass
                                </span>
                                <span className="text-[9px] text-slate-400">Sanitized</span>
                              </div>

                              {/* Step 3: AC Crate Transit */}
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                                  isDispatched
                                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                                    : 'bg-slate-200 text-slate-400'
                                }`}>
                                  <Truck className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 mt-1 leading-tight">
                                  In AC Transit
                                </span>
                                <span className="text-[9px] text-slate-400">Live GPS</span>
                              </div>

                              {/* Step 4: Doorstep Delivery */}
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                                  isDelivered
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-400'
                                }`}>
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 mt-1 leading-tight">
                                  Handed Off
                                </span>
                                <span className="text-[9px] text-slate-400">Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Description Callout */}
                          <div className="mt-4 p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-start space-x-2 text-xs">
                            {order.status === 'delivered' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-slate-900">Delivered to Doorstep</p>
                                  <p className="text-[11px] text-slate-600">
                                    Your rooster was delivered safely in bio-secure climate crate. 7-day health guarantee is active.
                                  </p>
                                </div>
                              </>
                            ) : order.status === 'dispatched' ? (
                              <>
                                <Truck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 animate-bounce" />
                                <div>
                                  <p className="font-bold text-sky-950">In AC Climate Crate Transit</p>
                                  <p className="text-[11px] text-slate-600">
                                    The vehicle is en route to {order.city}. Live GPS tracking is monitored.
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-amber-950">Preparing Sanitized Crate & Avian Vet Check</p>
                                  <p className="text-[11px] text-slate-600">
                                    Rooster tag {order.roosterTag} is undergoing pre-dispatch health check and crate sanitization at JP Farms estate.
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Delivery Address & Contact Row */}
                      <div className="text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-200/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span>Destination Address:</span>
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-slate-700">
                            {order.phoneNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 pl-5">
                          {order.customerName} • {order.deliveryAddress}, {order.city}, {order.state} - {order.pincode}
                        </p>
                        {order.notes && (
                          <p className="text-[10px] text-slate-500 italic pl-5">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Helpline */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Bio-Secure Transit Guarantee</span>
            </span>
            <a
              href={`tel:${FARM_INFO.phone}`}
              className="font-bold text-sky-800 hover:underline flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-sky-600" />
              <span>Dispatch Desk: {FARM_INFO.phone}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

