export type RoosterCategory = 
  | 'all'
  | 'aseel-peela'
  | 'aseel-kagar'
  | 'aseel-sindhi'
  | 'kadaknath'
  | 'country-desi'
  | 'breeding-pairs';

export type RoosterStatus = 'available' | 'reserved' | 'sold';

export interface Rooster {
  id: string;
  tagId: string; // e.g. "JP-AS-101"
  name: string;
  breed: string;
  category: RoosterCategory;
  age: string; // e.g. "14 Months"
  weight: string; // e.g. "3.8 Kg"
  height: string; // e.g. "26 Inches"
  combType: string; // e.g. "Pea Comb", "Small Rose Comb"
  colorPattern: string; // e.g. "Golden Yellow & Red with Green Sheen Tail"
  temperament: string; // e.g. "Dominant, Highly Alert, Alpha Fighter Stance"
  diet: string; // e.g. "Sprouted Bajra, Almond paste, Boiled pulses & Greens"
  vaccinationStatus: 'Fully Vaccinated' | 'Core Vaccines Completed' | 'Dewormed & Certified';
  vaccines: string[];
  price: number;
  originalPrice?: number;
  status: RoosterStatus;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  lineage: string; // e.g. "Direct Son of Raja Aseel (Champion 2024)"
  healthWarranty: string;
  description: string;
  createdAt: string;
  views?: number;
}

export interface RoosterFilter {
  category: string;
  status: string;
  search: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'weight';
}

export interface CustomerInquiry {
  id: string;
  roosterId: string;
  roosterTag: string;
  roosterName: string;
  customerName: string;
  phoneNumber: string;
  cityState: string;
  message: string;
  inquiryType: 'whatsapp' | 'call_request' | 'booking_token' | 'farm_visit';
  createdAt: string;
  status: 'new' | 'contacted' | 'deal_closed' | 'archived';
}

export interface FarmStats {
  totalRoostersSold: number;
  happyBreeders: number;
  pureBreedsCount: number;
  statesDelivered: number;
}

