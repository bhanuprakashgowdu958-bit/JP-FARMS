'use client';

import { useState, useEffect } from 'react';
import { Rooster, CustomerInquiry } from '@/types/rooster';
import { INITIAL_ROOSTERS, INITIAL_INQUIRIES } from './data';

const ROOSTERS_STORAGE_KEY = 'jp_farms_roosters_v1';
const INQUIRIES_STORAGE_KEY = 'jp_farms_inquiries_v1';

export function getStoredRoosters(): Rooster[] {
  if (typeof window === 'undefined') return INITIAL_ROOSTERS;
  try {
    const saved = localStorage.getItem(ROOSTERS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ROOSTERS_STORAGE_KEY, JSON.stringify(INITIAL_ROOSTERS));
      return INITIAL_ROOSTERS;
    }
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to read roosters from localStorage', e);
    return INITIAL_ROOSTERS;
  }
}

export function saveStoredRoosters(roosters: Rooster[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROOSTERS_STORAGE_KEY, JSON.stringify(roosters));
    // Dispatch custom event for real-time reactivity across components
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
    console.error('Failed to read inquiries', e);
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
    setRoosters(getStoredRoosters());
    setIsLoaded(true);

    const handleUpdate = () => {
      setRoosters(getStoredRoosters());
    };

    window.addEventListener('roosters-updated', handleUpdate);
    return () => window.removeEventListener('roosters-updated', handleUpdate);
  }, []);

  const addRooster = (newRooster: Omit<Rooster, 'id' | 'createdAt'>) => {
    const current = getStoredRoosters();
    const created: Rooster = {
      ...newRooster,
      id: `jp-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
    };
    const updated = [created, ...current];
    saveStoredRoosters(updated);
    setRoosters(updated);
    return created;
  };

  const updateRooster = (id: string, updates: Partial<Rooster>) => {
    const current = getStoredRoosters();
    const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveStoredRoosters(updated);
    setRoosters(updated);
  };

  const deleteRooster = (id: string) => {
    const current = getStoredRoosters();
    const updated = current.filter((r) => r.id !== id);
    saveStoredRoosters(updated);
    setRoosters(updated);
  };

  const toggleStatus = (id: string, newStatus: Rooster['status']) => {
    updateRooster(id, { status: newStatus });
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
    toggleStatus,
    resetToDefault,
  };
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(INITIAL_INQUIRIES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setInquiries(getStoredInquiries());
    setIsLoaded(true);

    const handleUpdate = () => {
      setInquiries(getStoredInquiries());
    };

    window.addEventListener('inquiries-updated', handleUpdate);
    return () => window.removeEventListener('inquiries-updated', handleUpdate);
  }, []);

  const addInquiry = (inquiry: Omit<CustomerInquiry, 'id' | 'createdAt'>) => {
    const current = getStoredInquiries();
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: `inq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString(),
    };
    const updated = [newInquiry, ...current];
    saveStoredInquiries(updated);
    setInquiries(updated);
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    const current = getStoredInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
    saveStoredInquiries(updated);
    setInquiries(updated);
  };

  return {
    inquiries,
    isLoaded,
    addInquiry,
    updateInquiryStatus,
  };
}
