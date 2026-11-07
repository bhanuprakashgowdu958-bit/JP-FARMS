declare module 'firebase/app' {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
  export function getApp(): any;
}

declare module 'firebase/firestore' {
  export type Firestore = any;
  export function getFirestore(app?: any): any;
  export function collection(db: any, path: string, ...pathSegments: string[]): any;
  export function getDocs(query: any): Promise<any>;
  export function addDoc(reference: any, data: any): Promise<any>;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function updateDoc(reference: any, data: any): Promise<void>;
  export function deleteDoc(reference: any): Promise<void>;
  export function query(collection: any, ...queryConstraints: any[]): any;
  export function orderBy(fieldPath: string, directionStr?: string): any;
  export function onSnapshot(reference: any, onNext: (snapshot: any) => void): () => void;
}

declare module 'firebase/storage' {
  export type FirebaseStorage = any;
  export function getStorage(app?: any): any;
  export function ref(storage: any, url?: string): any;
  export function uploadBytesResumable(ref: any, data: any, metadata?: any): any;
  export function getDownloadURL(ref: any): Promise<string>;
}

declare module 'firebase/auth' {
  export type Auth = any;
  export function getAuth(app?: any): any;
}

