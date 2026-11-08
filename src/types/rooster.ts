export type RoosterCategory = 
  | 'all'
  | 'aseel-peela'
  | 'aseel-kagar'
  | 'aseel-sindhi'
  | 'kadaknath'
  | 'country-desi'
  | 'breeding-pairs';

export type RoosterBadge = 'Champion Line' | 'Farm Stud' | 'Heritage Pure' | 'Breeding Flock' | 'Young Star';

export interface Rooster {
  id: string;
  tagId: string; // e.g. "JP-AS-101"
  name: string;
  breed: string;
  category: RoosterCategory;
  price: number; // e.g. 14500
  originalPrice?: number; // e.g. 18000
  inStock?: boolean; // default true
  rating?: number; // e.g. 4.9
  reviewsCount?: number; // e.g. 42
  age: string; // e.g. "14 Months"
  weight: string; // e.g. "3.8 Kg"
  height: string; // e.g. "26 Inches"
  combType: string; // e.g. "Pea Comb", "Small Rose Comb"
  colorPattern: string; // e.g. "Golden Yellow & Red with Green Sheen Tail"
  temperament: string; // e.g. "Dominant, Highly Alert, Alpha Fighter Stance"
  diet: string; // e.g. "Sprouted Bajra, Almond paste, Boiled pulses & Greens"
  vaccinationStatus: 'Fully Vaccinated' | 'Core Vaccines Completed' | 'Dewormed & Certified';
  vaccines: string[];
  badge: RoosterBadge;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  lineage: string; // e.g. "Direct Son of Raja Aseel (Champion 2024)"
  healthWarranty: string;
  description: string;
  createdAt: string;
  views?: number;
}

export interface RoosterOrderItem {
  roosterId: string;
  roosterTag: string;
  roosterName: string;
  roosterBreed: string;
  roosterImage: string;
  price: number;
  quantity: number;
}

export interface RoosterOrder {
  id: string; // e.g. "JP-ORD-94821"
  roosterId: string;
  roosterTag: string;
  roosterName: string;
  roosterBreed: string;
  roosterImage: string;
  price: number;
  items?: RoosterOrderItem[];
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  deliveryType: 'doorstep_live_crate' | 'farm_pickup';
  paymentMethod: 'cod' | 'upi' | 'advance_token';
  notes?: string;
  orderDate: string;
  status: 'confirmed' | 'dispatched' | 'delivered';
}

export interface CustomerInquiry {
  id: string;
  roosterId?: string;
  roosterTag?: string;
  roosterName?: string;
  customerName: string;
  phoneNumber: string;
  cityState: string;
  message: string;
  inquiryType: 'general' | 'farm_visit' | 'breed_info' | 'whatsapp';
  createdAt: string;
  status: 'new' | 'contacted' | 'archived';
}
