import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { Rooster, CustomerInquiry } from '@/types/rooster';
import { INITIAL_ROOSTERS } from './data';

// Upload rooster photos or walking videos to Firebase Storage
export async function uploadRoosterMediaToFirebase(
  file: File, 
  folder: 'rooster-photos' | 'rooster-videos' = 'rooster-photos',
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage is not configured. Please set up your Firebase credentials.');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}_${cleanFileName}`;
  const storageRef = ref(storage, path);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error: any) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// Fetch all roosters from Firestore
export async function getRoostersFromFirestore(): Promise<Rooster[]> {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_ROOSTERS;
  }

  try {
    const roostersCol = collection(db, 'roosters');
    const q = query(roostersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_ROOSTERS;
    }

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Rooster[];
  } catch (err) {
    console.error('Firestore fetch error:', err);
    return INITIAL_ROOSTERS;
  }
}

// Add a new rooster to Firestore
export async function addRoosterToFirestore(roosterData: Omit<Rooster, 'id' | 'createdAt'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured yet.');
  }

  const roostersCol = collection(db, 'roosters');
  const docRef = await addDoc(roostersCol, {
    ...roosterData,
    createdAt: new Date().toISOString().split('T')[0],
  });

  return docRef.id;
}

// Update rooster in Firestore (e.g. status 'available' -> 'sold', price, etc.)
export async function updateRoosterInFirestore(id: string, updates: Partial<Rooster>): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const docRef = doc(db, 'roosters', id);
  await updateDoc(docRef, updates);
}

// Delete rooster from Firestore
export async function deleteRoosterFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const docRef = doc(db, 'roosters', id);
  await deleteDoc(docRef);
}

// Add customer booking inquiry to Firestore
export async function addInquiryToFirestore(inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    return `inq-${Date.now()}`;
  }

  const inquiriesCol = collection(db, 'inquiries');
  const docRef = await addDoc(inquiriesCol, {
    ...inquiryData,
    createdAt: new Date().toLocaleString(),
    status: 'new',
  });

  return docRef.id;
}

// Subscribe to real-time changes in roosters
export function subscribeToRoostersRealtime(onData: (roosters: Rooster[]) => void) {
  if (!isFirebaseConfigured || !db) return () => {};

  const roostersCol = collection(db, 'roosters');
  const q = query(roostersCol, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot: any) => {
    if (!snapshot.empty) {
      const items = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Rooster[];
      onData(items);
    }
  });
}
