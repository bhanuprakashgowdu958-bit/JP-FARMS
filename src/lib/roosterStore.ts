'use client';

import { useState, useEffect } from 'react';
import { Rooster, CustomerInquiry, RoosterOrder } from '@/types/rooster';
import { INITIAL_ROOSTERS, INITIAL_INQUIRIES, INITIAL_ORDERS } from './data';
import { isFirebaseConfigured } from './firebase';
import { 
  getRoostersFromFirestore, 
  addRoosterToFirestore, 
  updateRoosterInFirestore, 
  deleteRoosterFromFirestore, 
  addInquiryToFirestore,
  subscribeToRoostersRealtime 
} from './firebaseService';

const ROOSTERS_STORAGE_KEY = 'jp_farms_roosters_v1';
const INQUIRIES_STORAGE_KEY = 'jp_farms_inquiries_v1';
const ORDERS_STORAGE_KEY = 'jp_farms_orders_v1';

export function getStoredRoosters(): Rooster[] {
  if (typeof window === 'undefined') return INITIAL_ROOSTERS;
  try {
    const saved = localStorage.getItem(ROOSTERS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ROOSTERS_STORAGE_KEY, JSON.stringify(INITIAL_ROOSTERS));
      return INITIAL_ROOSTERS;
    }
    const parsed: Rooster[] = JSON.parse(saved);
    // Ensure all stored roosters have price and stock status populated from initial defaults if missing
    return parsed.map((r) => {
      const match = INITIAL_ROOSTERS.find((init) => init.id === r.id);
      return {
        ...r,
        price: r.price || match?.price || 9500,
        originalPrice: r.originalPrice || match?.originalPrice || (r.price ? Math.round(r.price * 1.25) : 12000),
        inStock: r.inStock !== undefined ? r.inStock : (match?.inStock ?? true),
        rating: r.rating || match?.rating || 4.9,
        reviewsCount: r.reviewsCount || match?.reviewsCount || 35,
      };
    });
  } catch (e) {
    return INITIAL_ROOSTERS;
  }
}

export function saveStoredRoosters(roosters: Rooster[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROOSTERS_STORAGE_KEY, JSON.stringify(roosters));
    window.dispatchEvent(new Event('roosters-updated'));
  } catch (e) {
    console.error('Failed to save roosters', e);
  }
}

export function getStoredInquiries(): CustomerInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  try {
    const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_INQUIRIES;
  }
}

export function saveStoredInquiries(inquiries: CustomerInquiry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new Event('inquiries-updated'));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
}

export function useRoosters() {
  const [roosters, setRoosters] = useState<Rooster[]>(INITIAL_ROOSTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Initial fast local load
    setRoosters(getStoredRoosters());
    setIsLoaded(true);

    // 2. If Firebase is configured, subscribe to live Firestore updates
    if (isFirebaseConfigured) {
      const unsubscribe = subscribeToRoostersRealtime((liveRoosters) => {
        if (liveRoosters && liveRoosters.length > 0) {
          setRoosters(liveRoosters);
          saveStoredRoosters(liveRoosters);
        }
      });
      return () => unsubscribe();
    } else {
      // Fetch from internal backend API
      fetch('/api/roosters')
        .then(res => res.json())
        .then(result => {
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            setRoosters(result.data);
            saveStoredRoosters(result.data);
          }
        })
        .catch(() => {});
    }

    const handleUpdate = () => {
      setRoosters(getStoredRoosters());
    };

    window.addEventListener('roosters-updated', handleUpdate);
    return () => window.removeEventListener('roosters-updated', handleUpdate);
  }, []);

  const addRooster = async (newRooster: Omit<Rooster, 'id' | 'createdAt'>) => {
    const current = getStoredRoosters();
    let createdId = `jp-${Date.now().toString().slice(-4)}`;

    if (isFirebaseConfigured) {
      try {
        createdId = await addRoosterToFirestore(newRooster);
      } catch (e) {
        console.error('Error adding to Firestore:', e);
      }
    }

    const created: Rooster = {
      ...newRooster,
      id: createdId,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
    };

    const updated = [created, ...current];
    saveStoredRoosters(updated);
    setRoosters(updated);

    if (!isFirebaseConfigured) {
      try {
        await fetch('/api/roosters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(created),
        });
      } catch (e) {
        console.error('Failed to sync rooster to server', e);
      }
    }

    return created;
  };

  const updateRooster = async (id: string, updates: Partial<Rooster>) => {
    const current = getStoredRoosters();
    const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveStoredRoosters(updated);
    setRoosters(updated);

    if (isFirebaseConfigured) {
      try {
        await updateRoosterInFirestore(id, updates);
      } catch (e) {
        console.error('Error updating in Firestore:', e);
      }
    } else {
      try {
        await fetch('/api/roosters', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
        });
      } catch (e) {
        console.error('Failed to sync rooster update to server', e);
      }
    }
  };

  const deleteRooster = async (id: string) => {
    const current = getStoredRoosters();
    const updated = current.filter((r) => r.id !== id);
    saveStoredRoosters(updated);
    setRoosters(updated);

    if (isFirebaseConfigured) {
      try {
        await deleteRoosterFromFirestore(id);
      } catch (e) {
        console.error('Error deleting from Firestore:', e);
      }
    } else {
      try {
        await fetch(`/api/roosters?id=${id}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to sync rooster deletion to server', e);
      }
    }
  };

  const toggleBadge = (id: string, newBadge: Rooster['badge']) => {
    updateRooster(id, { badge: newBadge });
  };

  const resetToDefault = () => {
    saveStoredRoosters(INITIAL_ROOSTERS);
    setRoosters(INITIAL_ROOSTERS);
  };

  return {
    roosters,
    isLoaded,
    addRooster,
    updateRooster,
    deleteRooster,
    toggleBadge,
    resetToDefault,
  };
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(INITIAL_INQUIRIES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setInquiries(getStoredInquiries());
    setIsLoaded(true);

    fetch('/api/inquiries')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setInquiries(result.data);
          saveStoredInquiries(result.data);
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      setInquiries(getStoredInquiries());
    };

    window.addEventListener('inquiries-updated', handleUpdate);
    return () => window.removeEventListener('inquiries-updated', handleUpdate);
  }, []);

  const addInquiry = async (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt'>) => {
    const current = getStoredInquiries();
    let createdId = `inq-${Date.now().toString().slice(-4)}`;

    if (isFirebaseConfigured) {
      try {
        createdId = await addInquiryToFirestore(inquiry);
      } catch (e) {
        console.error('Error saving inquiry to Firestore:', e);
      }
    }

    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: createdId,
      createdAt: new Date().toLocaleString(),
    };
    const updated = [newInquiry, ...current];
    saveStoredInquiries(updated);
    setInquiries(updated);

    if (!isFirebaseConfigured) {
      try {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInquiry),
        });
      } catch (e) {
        console.error('Failed to sync inquiry to server', e);
      }
    }

    return newInquiry;
  };

  const updateInquiryStatus = async (id: string, status: CustomerInquiry['status']) => {
    const current = getStoredInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
    saveStoredInquiries(updated);
    setInquiries(updated);

    try {
      await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.error('Failed to sync inquiry update to server', e);
    }
  };

  return {
    inquiries,
    isLoaded,
    addInquiry,
    updateInquiryStatus,
  };
}

export function getStoredOrders(): RoosterOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: RoosterOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders-updated'));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<RoosterOrder[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setOrders(getStoredOrders());
    setIsLoaded(true);

    const handleUpdate = () => {
      setOrders(getStoredOrders());
    };
    window.addEventListener('orders-updated', handleUpdate);
    return () => window.removeEventListener('orders-updated', handleUpdate);
  }, []);

  const addOrder = (orderData: Omit<RoosterOrder, 'id' | 'orderDate' | 'status'> & { id?: string; status?: RoosterOrder['status'] }) => {
    const newOrder: RoosterOrder = {
      id: orderData.id || `JP-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: orderData.status || 'confirmed',
      ...orderData,
    };
    const current = getStoredOrders();
    const updated = [newOrder, ...current];
    saveStoredOrders(updated);
    setOrders(updated);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: RoosterOrder['status']) => {
    const current = getStoredOrders();
    const updated = current.map((o) => (o.id === id ? { ...o, status } : o));
    saveStoredOrders(updated);
    setOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const current = getStoredOrders();
    const updated = current.filter((o) => o.id !== id);
    saveStoredOrders(updated);
    setOrders(updated);
  };

  return {
    orders,
    isLoaded,
    addOrder,
    updateOrderStatus,
    deleteOrder,
  };
}
