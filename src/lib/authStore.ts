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
  phone?: string | null;
  photoURL?: string;
  joinedAt: string;
  lastLoginAt: string;
}

const USER_STORAGE_KEY = 'jp_farms_user_v1';
const REGISTERED_USERS_KEY = 'jp_farms_registered_users_v1';

// Initial registered users list for admin directory demo
const INITIAL_REGISTERED_USERS: RegisteredCustomer[] = [
  {
    uid: 'google-usr-01',
    name: 'Kishore Varma',
    email: 'kishore.varma.agri@gmail.com',
    phone: '+91 98450 12345',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-05 10:15 AM',
    lastLoginAt: '2026-11-08 11:20 AM',
  },
  {
    uid: 'google-usr-02',
    name: 'Anil Kumar Reddy',
    email: 'anilkumar.breeder@gmail.com',
    phone: '+91 97312 88990',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-06 02:40 PM',
    lastLoginAt: '2026-11-08 04:45 PM',
  },
];

export function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Purge any legacy simulated mock user
    if (parsed.email === 'customer@gmail.com' || parsed.displayName === 'Customer (Google Account)' || parsed.displayName === 'Customer') {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
    return parsed;
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
        phone: user.phoneNumber || list[existingIndex].phone || '',
        lastLoginAt: now,
      };
    } else {
      list.unshift({
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL || '',
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

export function updateUserPhone(phone: string): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = getStoredUser();
    if (!user) return null;
    const cleanPhone = phone.trim();
    const updatedUser: AppUser = {
      ...user,
      phoneNumber: cleanPhone,
    };
    saveStoredUser(updatedUser);
    return updatedUser;
  } catch (e) {
    console.error('Failed to update phone number', e);
    return null;
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

    if (!auth) {
      alert('Firebase Auth is initializing. Please try again in a moment.');
      setIsLoading(false);
      return null;
    }

    try {
      const authMod: any = await import('firebase/auth');
      const provider = new authMod.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // Open authentic Google OAuth popup (accounts.google.com)
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
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setIsLoading(false);

      // 1. User dismissed or closed the Google popup
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return null;
      }

      // 2. Browser blocked popup
      if (err?.code === 'auth/popup-blocked') {
        alert('The Google Sign-In window was blocked by your browser. Please allow popups for this site and click Sign In again.');
        setError('Popup blocked by browser');
        return null;
      }

      // 3. Domain not authorized in Firebase Console
      if (err?.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-domain';
        alert(
          `Google Sign-In Setup Notice:\n\nDomain "${currentHost}" must be whitelisted in your Firebase Console.\n\nQuick steps:\n1. Open Firebase Console (console.firebase.google.com) > jp-farms\n2. Click Authentication > Settings > Authorized domains\n3. Click "Add domain" and add "${currentHost}"`
        );
        setError(`Domain ${currentHost} is not authorized in Firebase Console.`);
        return null;
      }

      // 4. Google provider disabled in Firebase Console
      if (err?.code === 'auth/operation-not-allowed') {
        alert(
          `Google Sign-In Setup Notice:\n\nThe Google provider needs to be enabled in your Firebase Console.\n\nQuick steps:\n1. Open console.firebase.google.com > jp-farms\n2. Click Authentication > Sign-in method\n3. Click "Google" and toggle "Enable"`
        );
        setError('Google Sign-In provider is disabled in Firebase Console.');
        return null;
      }

      // 5. API key update propagating or invalid
      if (err?.code === 'auth/api-key-not-valid') {
        alert(
          'Google Sign-In Notice:\n\nThe updated credentials are deploying to the live server.\nPlease press Ctrl + Shift + R (or Cmd + Shift + R on Mac) to refresh the browser cache and try again.'
        );
        setError('API key updating. Please hard-refresh the page.');
        return null;
      }

      alert(`Google Sign-In failed: ${err?.message || err?.code || 'Please check your connection and try again.'}`);
      setError(err?.message || 'Authentication failed');
      return null;
    }
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
    updatePhone: (phone: string) => {
      const updated = updateUserPhone(phone);
      if (updated) setUser(updated);
      return updated;
    },
  };
}
