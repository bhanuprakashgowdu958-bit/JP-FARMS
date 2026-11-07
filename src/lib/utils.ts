import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppLink(params: {
  phone: string;
  tagId?: string;
  roosterName?: string;
  breed?: string;
  price?: number;
  customMessage?: string;
}): string {
  const cleanPhone = params.phone.replace(/[^0-9]/g, '');
  let text = '';
  
  if (params.customMessage) {
    text = params.customMessage;
  } else if (params.tagId) {
    text = `Hello JP Farms! 🐓\n\nI am interested in buying this rooster:\n- Tag ID: ${params.tagId}\n- Name: ${params.roosterName || 'Desi Rooster'}\n- Breed: ${params.breed || 'Pure Breed'}\n- Price: ₹${params.price?.toLocaleString('en-IN') || 'Discuss'}\n\nPlease share latest live video, delivery options, and booking details. Thank you!`;
  } else {
    text = `Hello JP Farms! 🐓\n\nI visited your website and would like to inquire about available desi roosters, pricing, and live transit details.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

