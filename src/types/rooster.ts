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
