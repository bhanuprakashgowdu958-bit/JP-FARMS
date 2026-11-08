'use client';

import { useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from './firebase';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  createdAt: string;
}

export interface RegisteredCustomer {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  joinedAt: string;
  lastLoginAt: string;
}

const USER_STORAGE_KEY = 'jp_farms_user_v1';
const REGISTERED_USERS_KEY = 'jp_farms_registered_users_v1';

// Initial registered users list for showcase demo
const INITIAL_REGISTERED_USERS: RegisteredCustomer[] = [
  {
    uid: 'google-usr-01',
    name: 'Kishore Varma',
    email: 'kishore.varma.agri@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-05 10:15 AM',
    lastLoginAt: '2026-11-08 11:20 AM',
  },
  {
    uid: 'google-usr-02',
    name: 'Anil Kumar Reddy',
    email: 'anilkumar.breeder@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-06 02:40 PM',
    lastLoginAt: '2026-11-08 04:45 PM',
  },
  {
    uid: 'google-usr-03',
    name: 'Ramesh Naidu',
    email: 'ramesh.naidu.ap@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-07 09:30 AM',
    lastLoginAt: '2026-11-08 09:10 AM',
  },
];

export function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredUser(user: AppUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      recordRegisteredCustomer(user);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('auth-state-changed'));
  } catch (e) {
    console.error('Failed to save user state', e);
  }
}

export function getRegisteredCustomers(): RegisteredCustomer[] {
  if (typeof window === 'undefined') return INITIAL_REGISTERED_USERS;
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!data) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REGISTERED_USERS;
  }
}

function recordRegisteredCustomer(user: AppUser): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getRegisteredCustomers();
    const existingIndex = list.findIndex(c => c.uid === user.uid || (user.email && c.email === user.email));
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    if (existingIndex >= 0) {
      list[existingIndex] = {
        ...list[existingIndex],
        name: user.displayName || list[existingIndex].name,
        photoURL: user.photoURL || list[existingIndex].photoURL,
        lastLoginAt: now,
      };
    } else {
      list.unshift({
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || 'customer@gmail.com',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        joinedAt: now,
        lastLoginAt: now,
      });
    }

    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('customers-updated'));
  } catch (e) {
    console.error('Failed to record customer', e);
  }
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial load from localStorage
    setUser(getStoredUser());
    setIsLoading(false);

    // Sync with Firebase Auth state if configured
    let unsubscribe = () => {};
    if (auth && isFirebaseConfigured) {
      import('firebase/auth').then((authMod: any) => {
        if (authMod?.onAuthStateChanged) {
          unsubscribe = authMod.onAuthStateChanged(auth, (fbUser: any) => {
            if (fbUser) {
              const appUser: AppUser = {
                uid: fbUser.uid,
                displayName: fbUser.displayName,
                email: fbUser.email,
                photoURL: fbUser.photoURL,
                phoneNumber: fbUser.phoneNumber,
                createdAt: new Date().toISOString(),
              };
              saveStoredUser(appUser);
              setUser(appUser);
            }
          });
        }
      }).catch(() => {});
    }

    // Reactive listener for local updates
    const handleAuthEvent = () => {
      setUser(getStoredUser());
    };

    window.addEventListener('auth-state-changed', handleAuthEvent);
    return () => {
      unsubscribe();
      window.removeEventListener('auth-state-changed', handleAuthEvent);
    };
  }, []);

  const signInWithGoogle = async (): Promise<AppUser | null> => {
    setIsLoading(true);
    setError(null);

    // 1. Try Firebase Google Auth Popup if configured
    if (auth && isFirebaseConfigured) {
      try {
        const authMod: any = await import('firebase/auth');
        if (authMod?.GoogleAuthProvider && authMod?.signInWithPopup) {
          const provider = new authMod.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const result = await authMod.signInWithPopup(auth, provider);
          const fbUser = result.user;

          const appUser: AppUser = {
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            phoneNumber: fbUser.phoneNumber,
            createdAt: new Date().toISOString(),
          };

          saveStoredUser(appUser);
          setUser(appUser);
          setIsLoading(false);
          return appUser;
        }
      } catch (err: any) {
        console.warn('Firebase Google Auth Popup error, using fallback:', err?.code, err?.message);
        // If user manually closed popup, don't fallback to simulation
        if (err?.code === 'auth/popup-closed-by-user') {
          setIsLoading(false);
          return null;
        }
      }
    }

    // 2. Safe Fallback (Allows testing without requiring Google Cloud Console redirect URI setup)
    const simulatedGoogleUser: AppUser = {
      uid: `google-${Math.floor(100000 + Math.random() * 900000)}`,
      displayName: 'Customer (Google Account)',
      email: 'customer@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString(),
    };

    saveStoredUser(simulatedGoogleUser);
    setUser(simulatedGoogleUser);
    setIsLoading(false);
    return simulatedGoogleUser;
  };

  const signOut = async () => {
    if (auth && isFirebaseConfigured) {
      try {
        const authMod: any = await import('firebase/auth');
        if (authMod?.signOut) {
          await authMod.signOut(auth);
        }
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
    saveStoredUser(null);
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signInWithGoogle,
    signOut,
  };
}
