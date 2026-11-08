import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

// Verified JP Farms Firebase credentials (directly sourced from Firebase Console)
const VERIFIED_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDpluHJpRCBW01oV6u98ZWO931ky_2GubQ',
  authDomain: 'jp-farms.firebaseapp.com',
  projectId: 'jp-farms',
  storageBucket: 'jp-farms.firebasestorage.app',
  messagingSenderId: '896848176576',
  appId: '1:896848176576:web:e5f7dd488098de5ad29425',
};

const firebaseConfig = {
  // Enforce the verified key directly so stale Vercel dashboard env vars cannot corrupt it
  apiKey: VERIFIED_FIREBASE_CONFIG.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || VERIFIED_FIREBASE_CONFIG.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || VERIFIED_FIREBASE_CONFIG.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || VERIFIED_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || VERIFIED_FIREBASE_CONFIG.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || VERIFIED_FIREBASE_CONFIG.appId,
};

// Check if valid Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket
);

let app: any = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined' || isFirebaseConfigured) {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
  }
}

export { app, db, storage, auth };

