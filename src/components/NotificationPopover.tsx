'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  Trash2, 
  Truck, 
  CheckCircle2, 
  PackageCheck, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  X,
  Music,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNotifications, AppNotification, NotificationType } from '@/lib/notificationStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders?: (orderId?: string) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const NotificationPopover: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
}) => {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'transit'>('all');
  const [justPlayedChime, setJustPlayedChime] = useState(false);

  const {
    notifications,
    unreadCount,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    toggleSound,
    playChime,
  } = useNotifications();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'transit') return n.type === 'dispatched';
    return true;
  });

  const handleItemClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    onClose();
    if (onOpenOrders) {
      onOpenOrders(notification.orderId);
    } else {
      window.dispatchEvent(
        new CustomEvent('open-orders-drawer', { detail: { orderId: notification.orderId } })
      );
    }
  };

  const handleTestChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChime();
    setJustPlayedChime(true);
    setTimeout(() => setJustPlayedChime(false), 900);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'pending_approval':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        );
      case 'confirmed':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'dispatched':
        return (
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 relative shadow-sm">
            <Truck className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          </div>
        );
      case 'delivered':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <PackageCheck className="w-5 h-5" />
          </div>
        );
      case 'rejected':
        return (
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-sm">
            <X className="w-5 h-5 text-rose-400" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-stone-800 border border-stone-700 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  const drawerContent = (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Notifications Drawer">
      {/* 1. Backdrop Overlay (Smooth blur & dim) */}
      <div 
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 2. Slide-Over Panel — Anchored flush to the RIGHT edge (E-Commerce Standard like Swiggy, Blinkit, Shopify) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-amber-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overscroll-contain">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black text-white tracking-wide truncate">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-2 py-0.5 rounded-full shrink-0">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 truncate">
                  Live order status & climate transit updates
                </p>
              </div>
            </div>

            {/* Actions: Sound Chime Test, Sound Toggle, Close */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Test Chime Button */}
              <button
                type="button"
                onClick={handleTestChime}
                title="Play test notification sound"
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer ${
                  justPlayedChime 
                    ? 'bg-amber-500 text-stone-950 border-amber-400 scale-105 shadow-md shadow-amber-500/30' 
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-white/10 hover:text-amber-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Test Chime</span>
              </button>

              {/* Sound Toggle (Mute / Unmute) */}
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? 'Notification sound enabled (Click to mute)' : 'Notification sound muted (Click to unmute)'}
                className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                    : 'bg-stone-800 text-stone-400 border-white/10 hover:bg-stone-750'
                }`}
                aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
              </button>

              {/* Close Drawer Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar & Quick Actions */}
          <div className="px-4 py-2.5 bg-stone-950/70 border-b border-white/5 flex items-center justify-between text-xs">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-stone-800/80 p-0.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filter === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('transit')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filter === 'transit'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                In Transit ({notifications.filter((n) => n.type === 'dispatched').length})
              </button>
            </div>

            {/* Mark All As Read */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center space-x-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          {/* Sound Status Banner */}
          <div className="px-4 py-1.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/10 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${soundEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
              <span>Chime: <strong className={soundEnabled ? 'text-emerald-400' : 'text-stone-400'}>{soundEnabled ? 'Active (Pleasant Bell)' : 'Muted'}</strong></span>
            </span>
            <span className="text-stone-500 text-[10px]">Tap any card to view live tracking</span>
          </div>

          {/* Scrollable Notification Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain divide-y-0">
            {filteredNotifications.length === 0 ? (
              <div className="py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-stone-800/80 border border-white/10 text-stone-500 mx-auto flex items-center justify-center mb-4 shadow-inner">
                  <Bell className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-bold text-stone-200">No notifications found</h3>
                <p className="text-xs text-stone-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {filter === 'unread'
                    ? 'All notifications have been read. Great job keeping up!'
                    : filter === 'transit'
                    ? 'No orders currently in live transit. Place an order to track Climate Crate live updates.'
                    : 'Order updates, health certificates, and dispatch tracking will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    notif.read
                      ? 'bg-stone-850/60 hover:bg-stone-800 border-white/5 opacity-85 hover:opacity-100'
                      : 'bg-stone-850 border-amber-500/30 hover:border-amber-400/60 shadow-md shadow-black/40'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Status Badge */}
                    {getTypeIcon(notif.type)}

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <h4 className={`text-xs font-black truncate ${notif.read ? 'text-stone-200' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 flex items-center space-x-1 shrink-0">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{formatRelativeTime(notif.createdAt)}</span>
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed mb-3">
                        {notif.message}
                      </p>

                      {/* Meta Pills & Action */}
                      <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
                        {notif.orderId && (
                          <span className="px-2 py-0.5 rounded-lg bg-stone-900 border border-white/10 text-amber-300 font-mono font-bold text-[10px]">
                            #{notif.orderId}
                          </span>
                        )}

                        {notif.type === 'pending_approval' && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-[10px] flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Pending Review</span>
                          </span>
                        )}

                        {notif.type === 'confirmed' && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px] flex items-center space-x-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Confirmed</span>
                          </span>
                        )}

                        {notif.type === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-lg bg-rose-950 border border-rose-500/30 text-rose-400 font-semibold text-[10px] flex items-center space-x-1">
                            <X className="w-3 h-3 text-rose-400" />
                            <span>Not Approved</span>
                          </span>
                        )}

                        {notif.type === 'dispatched' && (
                          <span className="px-2 py-0.5 rounded-lg bg-sky-950 border border-sky-500/30 text-sky-400 font-semibold text-[10px] flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                            <span>Climate Crate Live</span>
                          </span>
                        )}

                        {notif.type === 'delivered' && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px] flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Bio-Secure Handoff Complete</span>
                          </span>
                        )}

                        {/* Interactive Track CTA */}
                        <span className="ml-auto flex items-center space-x-1 text-amber-400 group-hover:text-amber-300 font-bold text-xs pt-0.5">
                          <span>Track</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </span>
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-stone-750 text-stone-500 hover:text-red-400 transition cursor-pointer shrink-0"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Bottom Bar */}
          <div className="p-4 bg-stone-950 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenOrders) {
                  onOpenOrders();
                } else {
                  window.dispatchEvent(new CustomEvent('open-orders-drawer'));
                }
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 transition cursor-pointer group"
            >
              <span>View All Orders Tracking</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-stone-500 hover:text-red-400 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
