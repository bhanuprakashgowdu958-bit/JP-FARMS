'use client';

import { useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from './firebase';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  deliveryAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
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

export interface PersistentProfileData {
  phoneNumber?: string | null;
  deliveryAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  updatedAt?: string;
}

const USER_STORAGE_KEY = 'jp_farms_user_v1';
const REGISTERED_USERS_KEY = 'jp_farms_registered_users_v1';
const PERSISTENT_PROFILES_KEY = 'jp_farms_user_profiles_v2';

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

/**
 * Retrieve saved profile data across sessions (never deleted on logout)
 */
export function getSavedProfile(identifier: { email?: string | null; uid?: string }): PersistentProfileData | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Check persistent profiles dictionary
    const raw = localStorage.getItem(PERSISTENT_PROFILES_KEY);
    const dict: Record<string, PersistentProfileData> = raw ? JSON.parse(raw) : {};
    
    let profile: PersistentProfileData | null = null;
    if (identifier.email && dict[identifier.email.toLowerCase()]) {
      profile = { ...dict[identifier.email.toLowerCase()] };
    } else if (identifier.uid && dict[identifier.uid]) {
      profile = { ...dict[identifier.uid] };
    }

    // 2. Fallback: Check registered customers list
    if (!profile?.phoneNumber) {
      const customers = getRegisteredCustomers();
      const matched = customers.find(c =>
        (identifier.email && c.email?.toLowerCase() === identifier.email.toLowerCase()) ||
        (identifier.uid && c.uid === identifier.uid)
      );
      if (matched?.phone) {
        profile = {
          ...profile,
          phoneNumber: matched.phone,
        };
      }
    }

    return profile;
  } catch (e) {
    return null;
  }
}

/**
 * Save persistent profile data keyed by user's email and uid
 */
export function savePersistentProfile(identifier: { email?: string | null; uid: string }, data: Partial<PersistentProfileData>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PERSISTENT_PROFILES_KEY);
    const dict: Record<string, PersistentProfileData> = raw ? JSON.parse(raw) : {};
    const existing = getSavedProfile(identifier) || {};

    const merged: PersistentProfileData = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (identifier.email) {
      dict[identifier.email.toLowerCase()] = merged;
    }
    dict[identifier.uid] = merged;

    localStorage.setItem(PERSISTENT_PROFILES_KEY, JSON.stringify(dict));
  } catch (e) {
    console.error('Failed to save persistent profile', e);
  }
}

/**
 * Construct an AppUser from Firebase User while preserving their saved phone & address
 */
export function buildAppUser(fbUser: any): AppUser {
  const saved = getSavedProfile({ email: fbUser.email, uid: fbUser.uid });
  const currentSession = getStoredUser();
  const currentMatchingPhone = (currentSession && (currentSession.uid === fbUser.uid || currentSession.email === fbUser.email)) 
    ? currentSession.phoneNumber 
    : null;

  return {
    uid: fbUser.uid,
    displayName: fbUser.displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    phoneNumber: saved?.phoneNumber || currentMatchingPhone || fbUser.phoneNumber || null,
    deliveryAddress: saved?.deliveryAddress || currentSession?.deliveryAddress,
    city: saved?.city || currentSession?.city,
    state: saved?.state || currentSession?.state,
    pincode: saved?.pincode || currentSession?.pincode,
    createdAt: currentSession?.createdAt || new Date().toISOString(),
  };
}

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

async function syncProfileToFirestore(user: AppUser) {
  if (!db || !user?.uid) return;
  try {
    const { doc, setDoc }: any = await import('firebase/firestore');
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      deliveryAddress: user.deliveryAddress || null,
      city: user.city || null,
      state: user.state || null,
      pincode: user.pincode || null,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    // Non-blocking: fail gracefully if Firestore rules or offline
  }
}

async function fetchFirestoreProfile(uid: string): Promise<PersistentProfileData | null> {
  if (!db || !uid) return null;
  try {
    const { doc, getDoc }: any = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as PersistentProfileData;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function updateUserPhone(phone: string): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = getStoredUser();
    if (!user) return null;
    const cleanPhone = phone.trim();

    // 1. Permanently remember this phone for this user (never lost on sign-out)
    savePersistentProfile({ email: user.email, uid: user.uid }, { phoneNumber: cleanPhone });

    // 2. Update active session user
    const updatedUser: AppUser = {
      ...user,
      phoneNumber: cleanPhone,
    };
    saveStoredUser(updatedUser);

    // 3. Asynchronously sync to Firestore cloud
    syncProfileToFirestore(updatedUser);

    return updatedUser;
  } catch (e) {
    console.error('Failed to update phone number', e);
    return null;
  }
}

export function updateUserAddress(addr: { deliveryAddress?: string; city?: string; state?: string; pincode?: string }): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = getStoredUser();
    if (!user) return null;

    // 1. Permanently remember address for this user
    savePersistentProfile({ email: user.email, uid: user.uid }, addr);

    // 2. Update active session user
    const updatedUser: AppUser = {
      ...user,
      ...(addr.deliveryAddress !== undefined ? { deliveryAddress: addr.deliveryAddress.trim() } : {}),
      ...(addr.city !== undefined ? { city: addr.city.trim() } : {}),
      ...(addr.state !== undefined ? { state: addr.state.trim() } : {}),
      ...(addr.pincode !== undefined ? { pincode: addr.pincode.trim() } : {}),
    };
    saveStoredUser(updatedUser);

    // 3. Asynchronously sync to Firestore cloud
    syncProfileToFirestore(updatedUser);

    return updatedUser;
  } catch (e) {
    console.error('Failed to update address', e);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial load from localStorage active session
    setUser(getStoredUser());
    setIsLoading(false);

    // Sync with Firebase Auth state if configured
    let unsubscribe = () => {};
    if (auth && isFirebaseConfigured) {
      import('firebase/auth').then((authMod: any) => {
        if (authMod?.onAuthStateChanged) {
          unsubscribe = authMod.onAuthStateChanged(auth, async (fbUser: any) => {
            if (fbUser) {
              const appUser = buildAppUser(fbUser);
              saveStoredUser(appUser);
              setUser(appUser);

              // If phone was missing locally, try checking Firestore cloud doc
              if (!appUser.phoneNumber) {
                try {
                  const remote = await fetchFirestoreProfile(fbUser.uid);
                  if (remote?.phoneNumber) {
                    savePersistentProfile({ email: fbUser.email, uid: fbUser.uid }, remote);
                    const enriched: AppUser = {
                      ...appUser,
                      phoneNumber: remote.phoneNumber,
                      deliveryAddress: remote.deliveryAddress || appUser.deliveryAddress,
                      city: remote.city || appUser.city,
                      state: remote.state || appUser.state,
                      pincode: remote.pincode || appUser.pincode,
                    };
                    saveStoredUser(enriched);
                    setUser(enriched);
                  }
                } catch (e) {}
              }
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

      const appUser = buildAppUser(fbUser);

      // If phone was missing locally, try checking Firestore cloud doc
      if (!appUser.phoneNumber) {
        try {
          const remote = await fetchFirestoreProfile(fbUser.uid);
          if (remote?.phoneNumber) {
            savePersistentProfile({ email: fbUser.email, uid: fbUser.uid }, remote);
            appUser.phoneNumber = remote.phoneNumber;
            if (remote.deliveryAddress) appUser.deliveryAddress = remote.deliveryAddress;
            if (remote.city) appUser.city = remote.city;
            if (remote.state) appUser.state = remote.state;
            if (remote.pincode) appUser.pincode = remote.pincode;
          }
        } catch (e) {}
      }

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
    updateAddress: (addr: { deliveryAddress?: string; city?: string; state?: string; pincode?: string }) => {
      const updated = updateUserAddress(addr);
      if (updated) setUser(updated);
      return updated;
    },
  };
}
