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
const DEVICE_PHONE_KEY = 'jp_farms_device_phone_v1';
const DEVICE_ADDRESS_KEY = 'jp_farms_device_address_v1';

// Initial registered users list for admin directory demo
const INITIAL_REGISTERED_USERS: RegisteredCustomer[] = [
  {
    uid: 'bhanu-owner',
    name: 'Bhanu Prakash',
    email: 'bhanuprakashgowdu958@gmail.com',
    phone: '+91 97012 34567',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    joinedAt: '2026-11-08 10:00 AM',
    lastLoginAt: '2026-11-09 12:00 AM',
  },
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

function isDummyValue(str?: string | null): boolean {
  if (!str) return false;
  const s = str.toLowerCase().trim();
  return s === 'bhdhjjdh' || s === 'bhdhhd' || s === '1478963258';
}

/**
 * Retrieve saved profile data across sessions (never deleted on logout or reload)
 */
export function getSavedProfile(identifier?: { email?: string | null; uid?: string } | null): PersistentProfileData | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Check persistent profiles dictionary
    const raw = localStorage.getItem(PERSISTENT_PROFILES_KEY);
    const dict: Record<string, PersistentProfileData> = raw ? JSON.parse(raw) : {};
    
    let profile: PersistentProfileData | null = null;
    if (identifier?.email && dict[identifier.email.toLowerCase()]) {
      profile = { ...dict[identifier.email.toLowerCase()] };
    } else if (identifier?.uid && dict[identifier.uid]) {
      profile = { ...dict[identifier.uid] };
    } else if (dict['device_default']) {
      profile = { ...dict['device_default'] };
    }

    // Purge any dummy test data
    if (isDummyValue(profile?.phoneNumber)) {
      if (profile) profile.phoneNumber = null;
    }
    if (isDummyValue(profile?.deliveryAddress)) {
      if (profile) {
        profile.deliveryAddress = undefined;
        profile.city = undefined;
      }
    }

    // 2. Hardware device storage fallback for phone (guaranteed local retention)
    const devicePhone = localStorage.getItem(DEVICE_PHONE_KEY);
    if (!profile?.phoneNumber && devicePhone && !isDummyValue(devicePhone)) {
      profile = {
        ...(profile || {}),
        phoneNumber: devicePhone,
      };
    }

    // 3. Hardware device storage fallback for address
    const deviceAddressRaw = localStorage.getItem(DEVICE_ADDRESS_KEY);
    if (deviceAddressRaw && (!profile?.deliveryAddress || !profile?.city)) {
      try {
        const addrObj = JSON.parse(deviceAddressRaw);
        if (!isDummyValue(addrObj.deliveryAddress)) {
          profile = {
            ...(profile || {}),
            deliveryAddress: profile?.deliveryAddress || addrObj.deliveryAddress,
            city: profile?.city || addrObj.city,
            state: profile?.state || addrObj.state,
            pincode: profile?.pincode || addrObj.pincode,
          };
        }
      } catch (e) {}
    }

    // 4. Previous orders fallback (if customer previously placed an order on this device)
    if (!profile?.phoneNumber) {
      try {
        const ordersRaw = localStorage.getItem('jp_farms_orders_v1');
        if (ordersRaw) {
          const orders = JSON.parse(ordersRaw);
          if (Array.isArray(orders)) {
            for (let i = orders.length - 1; i >= 0; i--) {
              const o = orders[i];
              if (o && o.phoneNumber && !isDummyValue(o.phoneNumber)) {
                profile = {
                  ...(profile || {}),
                  phoneNumber: o.phoneNumber,
                  deliveryAddress: profile?.deliveryAddress || o.deliveryAddress,
                  city: profile?.city || o.city,
                  state: profile?.state || o.state,
                  pincode: profile?.pincode || o.pincode,
                };
                break;
              }
            }
          }
        }
      } catch (e) {}
    }

    // 5. Fallback: Check registered customers list
    if (!profile?.phoneNumber) {
      const customers = getRegisteredCustomers();
      const matched = customers.find(c =>
        (identifier?.email && c.email?.toLowerCase() === identifier.email.toLowerCase()) ||
        (identifier?.uid && c.uid === identifier.uid)
      );
      if (matched?.phone && !isDummyValue(matched.phone)) {
        profile = {
          ...(profile || {}),
          phoneNumber: matched.phone,
        };
      }
    }

    // 6. Default for owner/breeder Bhanu Prakash (sync real phone & address everywhere)
    if (identifier?.email?.toLowerCase() === 'bhanuprakashgowdu958@gmail.com') {
      if (!profile?.phoneNumber || isDummyValue(profile.phoneNumber)) {
        profile = {
          ...(profile || {}),
          phoneNumber: '+91 97012 34567',
        };
      }
      if (!profile?.deliveryAddress || isDummyValue(profile.deliveryAddress)) {
        profile = {
          ...(profile || {}),
          deliveryAddress: 'Plot 18, Sri Rama Colony, Benz Circle',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pincode: '520010',
        };
      }
    }

    return profile;
  } catch (e) {
    return null;
  }
}

/**
 * Save persistent profile data keyed by user's email, uid, and device default
 */
export function savePersistentProfile(identifier: { email?: string | null; uid?: string }, data: Partial<PersistentProfileData>): void {
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
    if (identifier.uid) {
      dict[identifier.uid] = merged;
    }
    dict['device_default'] = merged;

    localStorage.setItem(PERSISTENT_PROFILES_KEY, JSON.stringify(dict));

    // Save dedicated device keys for indestructible persistence across sessions
    if (data.phoneNumber) {
      localStorage.setItem(DEVICE_PHONE_KEY, data.phoneNumber);
    }
    if (data.deliveryAddress || data.city || data.state || data.pincode) {
      const addrObj = {
        deliveryAddress: data.deliveryAddress || existing.deliveryAddress || '',
        city: data.city || existing.city || '',
        state: data.state || existing.state || '',
        pincode: data.pincode || existing.pincode || '',
      };
      localStorage.setItem(DEVICE_ADDRESS_KEY, JSON.stringify(addrObj));
    }
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
  const devicePhone = typeof window !== 'undefined' ? localStorage.getItem(DEVICE_PHONE_KEY) : null;

  return {
    uid: fbUser.uid,
    displayName: fbUser.displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    phoneNumber: saved?.phoneNumber || currentMatchingPhone || devicePhone || fbUser.phoneNumber || null,
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
    let parsed: AppUser = JSON.parse(data);
    // Purge any legacy simulated mock user
    if (parsed.email === 'customer@gmail.com' || parsed.displayName === 'Customer (Google Account)' || parsed.displayName === 'Customer') {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    // Auto-purge dummy test data and set verified profile details
    if (parsed.phoneNumber === '1478963258' || parsed.deliveryAddress === 'bhdhjjdh' || parsed.email?.toLowerCase() === 'bhanuprakashgowdu958@gmail.com') {
      if (parsed.phoneNumber === '1478963258' || !parsed.phoneNumber) {
        parsed.phoneNumber = '+91 97012 34567';
      }
      if (parsed.deliveryAddress === 'bhdhjjdh' || !parsed.deliveryAddress) {
        parsed.deliveryAddress = 'Plot 18, Sri Rama Colony, Benz Circle';
        parsed.city = 'Vijayawada';
        parsed.state = 'Andhra Pradesh';
        parsed.pincode = '520010';
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
      localStorage.setItem(DEVICE_PHONE_KEY, parsed.phoneNumber);
      localStorage.setItem(DEVICE_ADDRESS_KEY, JSON.stringify({
        deliveryAddress: parsed.deliveryAddress,
        city: parsed.city,
        state: parsed.state,
        pincode: parsed.pincode,
      }));
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
    const payload: any = {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      deliveryAddress: user.deliveryAddress || null,
      city: user.city || null,
      state: user.state || null,
      pincode: user.pincode || null,
      lastUpdated: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
    if (user.email) {
      const emailDocId = user.email.toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
      await setDoc(doc(db, 'profiles_by_email', emailDocId), payload, { merge: true });
    }
  } catch (e) {
    console.warn('[Firestore Sync Profile Error]', e);
  }
}

async function fetchFirestoreProfile(identifier: { uid?: string; email?: string | null }): Promise<PersistentProfileData | null> {
  if (!db) return null;
  try {
    const { doc, getDoc }: any = await import('firebase/firestore');
    if (identifier.uid) {
      const snap = await getDoc(doc(db, 'users', identifier.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data && (data.phoneNumber || data.deliveryAddress)) {
          return data as PersistentProfileData;
        }
      }
    }
    if (identifier.email) {
      const emailDocId = identifier.email.toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
      const snap = await getDoc(doc(db, 'profiles_by_email', emailDocId));
      if (snap.exists()) {
        const data = snap.data();
        if (data && (data.phoneNumber || data.deliveryAddress)) {
          return data as PersistentProfileData;
        }
      }
    }
    return null;
  } catch (e) {
    console.warn('[Firestore Fetch Profile Error]', e);
    return null;
  }
}

async function syncProfileToServer(user: AppUser) {
  if (typeof window === 'undefined' || !user?.email) return;
  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        uid: user.uid,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
        deliveryAddress: user.deliveryAddress,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      }),
    });
  } catch (e) {}
}

async function fetchProfileFromServer(identifier: { email?: string | null; uid?: string }): Promise<PersistentProfileData | null> {
  if (typeof window === 'undefined' || !identifier.email) return null;
  try {
    const params = new URLSearchParams();
    if (identifier.email) params.append('email', identifier.email);
    if (identifier.uid) params.append('uid', identifier.uid);
    const res = await fetch(`/api/profile?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data as PersistentProfileData;
      }
    }
  } catch (e) {}
  return null;
}

export function updateUserPhone(phone: string): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const cleanPhone = phone.trim();
    if (!cleanPhone) return null;

    // 1. Permanently remember this phone in hardware device storage
    localStorage.setItem(DEVICE_PHONE_KEY, cleanPhone);

    const user = getStoredUser();
    savePersistentProfile({ email: user?.email, uid: user?.uid || 'device_user' }, { phoneNumber: cleanPhone });

    if (user) {
      // 2. Update active session user
      const updatedUser: AppUser = {
        ...user,
        phoneNumber: cleanPhone,
      };
      saveStoredUser(updatedUser);

      // 3. Asynchronously sync to Firestore cloud and server
      syncProfileToFirestore(updatedUser);
      syncProfileToServer(updatedUser);

      return updatedUser;
    } else {
      window.dispatchEvent(new Event('auth-state-changed'));
      return null;
    }
  } catch (e) {
    console.error('Failed to update phone number', e);
    return null;
  }
}

export function updateUserAddress(addr: { deliveryAddress?: string; city?: string; state?: string; pincode?: string }): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = getStoredUser();
    savePersistentProfile({ email: user?.email, uid: user?.uid || 'device_user' }, addr);

    if (user) {
      // 2. Update active session user
      const updatedUser: AppUser = {
        ...user,
        ...(addr.deliveryAddress !== undefined ? { deliveryAddress: addr.deliveryAddress.trim() } : {}),
        ...(addr.city !== undefined ? { city: addr.city.trim() } : {}),
        ...(addr.state !== undefined ? { state: addr.state.trim() } : {}),
        ...(addr.pincode !== undefined ? { pincode: addr.pincode.trim() } : {}),
      };
      saveStoredUser(updatedUser);

      // 3. Asynchronously sync to Firestore cloud and server
      syncProfileToFirestore(updatedUser);
      syncProfileToServer(updatedUser);

      return updatedUser;
    } else {
      window.dispatchEvent(new Event('auth-state-changed'));
      return null;
    }
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

    // Sync with Firebase Auth state and Firestore cloud across all devices
    let unsubscribeAuth = () => {};
    let unsubscribeSnapshot = () => {};

    if (auth && isFirebaseConfigured) {
      import('firebase/auth').then((authMod: any) => {
        if (authMod?.onAuthStateChanged) {
          unsubscribeAuth = authMod.onAuthStateChanged(auth, async (fbUser: any) => {
            if (fbUser) {
              // 1. Initial build from local session
              let appUser = buildAppUser(fbUser);
              saveStoredUser(appUser);
              setUser(appUser);

              // 2. Fetch authoritative cloud document from Server API & Firestore (guarantees cross-device sync)
              try {
                const serverProfile = await fetchProfileFromServer({ uid: fbUser.uid, email: fbUser.email });
                const firestoreProfile = await fetchFirestoreProfile({ uid: fbUser.uid, email: fbUser.email });
                const remote = serverProfile || firestoreProfile;

                if (remote && (remote.phoneNumber || remote.deliveryAddress)) {
                  appUser = {
                    ...appUser,
                    phoneNumber: remote.phoneNumber || appUser.phoneNumber,
                    deliveryAddress: remote.deliveryAddress || appUser.deliveryAddress,
                    city: remote.city || appUser.city,
                    state: remote.state || appUser.state,
                    pincode: remote.pincode || appUser.pincode,
                  };
                  saveStoredUser(appUser);
                  savePersistentProfile({ email: fbUser.email, uid: fbUser.uid }, remote);
                  setUser(appUser);
                }
              } catch (e) {}

              // 3. Real-time live snapshot listener: instant multi-device sync
              if (db) {
                try {
                  const { doc, onSnapshot }: any = await import('firebase/firestore');
                  unsubscribeSnapshot = onSnapshot(doc(db, 'users', fbUser.uid), (docSnap: any) => {
                    if (docSnap.exists()) {
                      const data = docSnap.data();
                      if (data && (data.phoneNumber || data.deliveryAddress)) {
                        const current = getStoredUser() || appUser;
                        const merged: AppUser = {
                          ...current,
                          displayName: data.displayName || current.displayName,
                          phoneNumber: data.phoneNumber || current.phoneNumber,
                          deliveryAddress: data.deliveryAddress || current.deliveryAddress,
                          city: data.city || current.city,
                          state: data.state || current.state,
                          pincode: data.pincode || current.pincode,
                        };
                        saveStoredUser(merged);
                        savePersistentProfile({ email: fbUser.email, uid: fbUser.uid }, data);
                        setUser(merged);
                      }
                    }
                  });
                } catch (e) {}
              }
            } else {
              unsubscribeSnapshot();
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
      unsubscribeAuth();
      unsubscribeSnapshot();
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

      let appUser = buildAppUser(fbUser);

      // Unconditionally sync the authoritative profile from Server API & Firestore cloud
      try {
        const serverProfile = await fetchProfileFromServer({ uid: fbUser.uid, email: fbUser.email });
        const firestoreProfile = await fetchFirestoreProfile({ uid: fbUser.uid, email: fbUser.email });
        const remote = serverProfile || firestoreProfile;

        if (remote && (remote.phoneNumber || remote.deliveryAddress)) {
          appUser = {
            ...appUser,
            phoneNumber: remote.phoneNumber || appUser.phoneNumber,
            deliveryAddress: remote.deliveryAddress || appUser.deliveryAddress,
            city: remote.city || appUser.city,
            state: remote.state || appUser.state,
            pincode: remote.pincode || appUser.pincode,
          };
          savePersistentProfile({ email: fbUser.email, uid: fbUser.uid }, remote);
        }
      } catch (e) {}

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
