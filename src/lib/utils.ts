import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppLink(params: {
  phone: string;
  tagId?: string;
  roosterName?: string;
  breed?: string;
  customMessage?: string;
}): string {
  const cleanPhone = params.phone.replace(/[^0-9]/g, '');
  let text = '';
  
  if (params.customMessage) {
    text = params.customMessage;
  } else if (params.tagId) {
    text = `Hello JP Farms! 🐓\n\nI was admiring this rooster on your website:\n- Tag ID: ${params.tagId}\n- Name: ${params.roosterName || 'Desi Rooster'}\n- Breed: ${params.breed || 'Pure Breed'}\n\nI would love to learn more about this bloodline and schedule a visit to the farm!`;
  } else {
    text = `Hello JP Farms! 🐓\n\nI visited your website showcase and would like to learn more about your heritage rooster breeding lines and farm visit timings.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Calculate straight-line distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
