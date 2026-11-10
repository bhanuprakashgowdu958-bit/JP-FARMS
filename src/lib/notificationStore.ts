'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoosterOrder } from '@/types/rooster';

const NOTIFICATIONS_STORAGE_KEY = 'jp_farms_notifications_v1';
const SOUND_STORAGE_KEY = 'jp_farms_sound_enabled_v1';
const NOTIFIED_STATUS_KEY = 'jp_farms_notified_statuses_v1';

export type NotificationType = 'pending_approval' | 'confirmed' | 'dispatched' | 'delivered' | 'rejected' | 'info';

export interface AppNotification {
  id: string;
  orderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO string
  read: boolean;
  roosterName?: string;
  roosterTag?: string;
  deliveryType?: 'doorstep_live_crate' | 'farm_pickup';
  rejectionReason?: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [];

export function getStoredSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function saveStoredSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new Event('sound-preference-updated'));
  } catch (e) {
    console.error('Failed to save sound preference', e);
  }
}

/**
 * Native Web Audio API Chime:
 * Zero external MP3 dependencies, instant audio synthesis,
 * pleasant multi-harmonic bell chime.
 */
export function playNotificationChime(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!getStoredSoundEnabled()) return;

    const AudioContextClass = 
      window.AudioContext || 
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Notes: C6 (1046.5Hz) -> E6 (1318.5Hz) -> G6 (1567.98Hz)
    // Bell harmonic with soft exponential decay
    const notes = [
      { freq: 659.25, start: 0, duration: 0.18 },     // E5
      { freq: 880.00, start: 0.08, duration: 0.22 },    // A5
      { freq: 1174.66, start: 0.16, duration: 0.48 },  // D6
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      // Fast attack, smooth decay
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    });

    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 1200);
  } catch (e) {
    console.warn('Audio chime playback error:', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed: AppNotification[] = JSON.parse(saved);
    // Purge legacy demo notifications
    const cleaned = parsed.filter(
      (n) =>
        !n.id.startsWith('notif-init-') &&
        n.orderId !== 'JP-ORD-92812' &&
        n.orderId !== 'JP-ORD-88341' &&
        n.orderId !== 'JP-ORD-92408'
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.error('Failed to parse notifications', e);
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('notifications-updated'));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

/**
 * Add a notification and automatically play chime if enabled
 */
export function pushNotification(
  notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & { id?: string; createdAt?: string }
): AppNotification {
  const current = getStoredNotifications();
  const created: AppNotification = {
    id: notif.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: notif.createdAt || new Date().toISOString(),
    read: false,
    ...notif,
  };

  const updated = [created, ...current];
  saveStoredNotifications(updated);

  // Play audible chime
  playNotificationChime();

  return created;
}

/**
 * Sync order state changes with notifications
 */
export function checkAndNotifyOrders(orders: RoosterOrder[]): void {
  if (typeof window === 'undefined' || !orders || orders.length === 0) return;

  try {
    const rawNotified = localStorage.getItem(NOTIFIED_STATUS_KEY);
    const notifiedMap: Record<string, boolean> = rawNotified ? JSON.parse(rawNotified) : {};
    let hasNew = false;

    orders.forEach((order) => {
      if (!order.id || !order.status) return;
      const key = `${order.id}__${order.status}`;
      if (notifiedMap[key]) return;

      // Mark as notified
      notifiedMap[key] = true;
      hasNew = true;

      let title = '';
      let message = '';
      let type: NotificationType = 'confirmed';

      if (order.status === 'pending_approval') {
        type = 'pending_approval';
        title = `Order Received: #${order.id}`;
        message = `Your order for ${order.roosterName || 'Rooster'} is under admin verification. Health pass & crate scheduling in progress.`;
      } else if (order.status === 'confirmed') {
        type = 'confirmed';
        title = `Order Confirmed: #${order.id}`;
        message = `Your order for ${order.roosterName || 'Rooster'} has been accepted & approved by JP Farms! Health pass generated.`;
      } else if (order.status === 'rejected') {
        type = 'rejected';
        title = `Order Not Approved: #${order.id}`;
        message = order.rejectionReason 
          ? `Reason: ${order.rejectionReason}`
          : `Your order could not be processed at this time. Please contact JP Farms desk.`;
      } else if (order.status === 'dispatched') {
        type = 'dispatched';
        title = `Order Dispatched: #${order.id}`;
        message = `${order.roosterName || 'Rooster'} is in transit in our temperature-controlled Climate Crate with GPS tracking.`;
      } else if (order.status === 'delivered') {
        type = 'delivered';
        title = `Rooster Delivered: #${order.id}`;
        message = `Bio-secure doorstep handoff completed for ${order.roosterName || 'Rooster'}. Heritage health pass issued!`;
      }

      if (title) {
        pushNotification({
          orderId: order.id,
          type,
          title,
          message,
          roosterName: order.roosterName,
          roosterTag: order.roosterTag,
          deliveryType: order.deliveryType,
          rejectionReason: order.rejectionReason,
        });
      }
    });

    if (hasNew) {
      localStorage.setItem(NOTIFIED_STATUS_KEY, JSON.stringify(notifiedMap));
    }
  } catch (e) {
    console.error('Failed to sync order notifications', e);
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setNotifications(getStoredNotifications());
    setSoundEnabled(getStoredSoundEnabled());
    setIsLoaded(true);

    const handleNotifUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    const handleSoundUpdate = () => {
      setSoundEnabled(getStoredSoundEnabled());
    };

    window.addEventListener('notifications-updated', handleNotifUpdate);
    window.addEventListener('sound-preference-updated', handleSoundUpdate);

    return () => {
      window.removeEventListener('notifications-updated', handleNotifUpdate);
      window.removeEventListener('sound-preference-updated', handleSoundUpdate);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    const current = getStoredNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStoredNotifications(updated);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const current = getStoredNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    saveStoredNotifications(updated);
    setNotifications(updated);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    const current = getStoredNotifications();
    const updated = current.filter((n) => n.id !== id);
    saveStoredNotifications(updated);
    setNotifications(updated);
  }, []);

  const clearAll = useCallback(() => {
    saveStoredNotifications([]);
    setNotifications([]);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !getStoredSoundEnabled();
    saveStoredSoundEnabled(next);
    setSoundEnabled(next);
    if (next) {
      playNotificationChime();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    soundEnabled,
    isLoaded,
    addNotification: pushNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    toggleSound,
    playChime: playNotificationChime,
  };
}

