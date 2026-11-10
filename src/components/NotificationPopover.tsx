'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  Music
} from 'lucide-react';
import { useNotifications, AppNotification, NotificationType } from '@/lib/notificationStore';

interface NotificationPopoverProps {
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

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
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

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleItemClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    onClose();
    if (onOpenOrders) {
      onOpenOrders(notification.orderId);
    } else {
      window.dispatchEvent(new CustomEvent('open-orders-drawer', { detail: { orderId: notification.orderId } }));
    }
  };

  const handleTestChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChime();
    setJustPlayedChime(true);
    setTimeout(() => setJustPlayedChime(false), 800);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'confirmed':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'dispatched':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 relative">
            <Truck className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          </div>
        );
      case 'delivered':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-stone-700/50 border border-stone-600 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[400px] max-w-[calc(100vw-1.5rem)] bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md"
      role="dialog"
      aria-label="Order notifications"
    >
      {/* 1. Header */}
      <div className="p-3.5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-white tracking-wide">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-400">Live order & transit alerts</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Test Sound Preview */}
          <button
            type="button"
            onClick={handleTestChime}
            title="Test notification chime sound"
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition cursor-pointer ${
              justPlayedChime 
                ? 'bg-amber-500 text-stone-950 border-amber-400 scale-105' 
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-white/10 hover:text-amber-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold hidden sm:inline">Chime</span>
          </button>

          {/* Sound Toggle (Mute / Unmute) */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                : 'bg-stone-800 text-stone-400 border-white/10 hover:bg-stone-700'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-white/10 transition cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Subheader with Tabs & Actions */}
      <div className="px-3 py-2 bg-stone-950/60 border-b border-white/5 flex items-center justify-between text-xs">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-stone-800/80 p-0.5 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
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
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
              filter === 'unread'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center space-x-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* 3. Notification List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 overscroll-contain">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-white/10 text-stone-500 mx-auto flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm font-bold text-stone-300">No notifications</p>
            <p className="text-xs text-stone-500 mt-1 max-w-[240px] mx-auto">
              {filter === 'unread' 
                ? 'You are all caught up! No unread notifications.'
                : 'Status alerts for order confirmation, climate crate dispatch, and delivery will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`group p-3 transition flex items-start space-x-3 cursor-pointer ${
                notif.read
                  ? 'bg-stone-900/40 hover:bg-stone-800/50 opacity-80 hover:opacity-100'
                  : 'bg-amber-500/5 hover:bg-amber-500/10'
              }`}
            >
              {/* Type Icon */}
              {getTypeIcon(notif.type)}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between space-x-1">
                  <h4 className={`text-xs font-bold truncate ${notif.read ? 'text-stone-300' : 'text-white'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center space-x-1 shrink-0">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                    <span className="text-[10px] text-stone-500 flex items-center space-x-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatRelativeTime(notif.createdAt)}</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5 line-clamp-2">
                  {notif.message}
                </p>

                {/* Metadata Tags */}
                <div className="mt-2 flex items-center flex-wrap gap-1.5 text-[10px]">
                  {notif.orderId && (
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 border border-white/10 text-amber-300 font-mono font-bold">
                      {notif.orderId}
                    </span>
                  )}
                  {notif.type === 'dispatched' && (
                    <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                      <span>Climate Crate Live</span>
                    </span>
                  )}
                  {notif.type === 'delivered' && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-semibold">
                      ✓ Handed Over
                    </span>
                  )}
                  <span className="text-amber-400/80 group-hover:text-amber-300 font-medium flex items-center space-x-0.5 ml-auto">
                    <span>Track</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

              {/* Dismiss Single */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition cursor-pointer"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 4. Footer */}
      <div className="p-2.5 bg-stone-950 border-t border-white/10 flex items-center justify-between text-xs">
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
          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition cursor-pointer"
        >
          <span>View All Orders Tracking</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-stone-500 hover:text-red-400 flex items-center space-x-1 transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>
    </div>
  );
};
