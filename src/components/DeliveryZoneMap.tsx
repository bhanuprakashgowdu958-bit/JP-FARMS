'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Minimize2,
  Compass,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { FARM_LOCATION } from '@/lib/data';
import { calculateDistanceKm } from '@/lib/utils';

// Import leaflet styles
import 'leaflet/dist/leaflet.css';

export interface LocationSelectResult {
  lat: number;
  lng: number;
  distanceKm: number;
  isDeliverable: boolean;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface DeliveryZoneMapProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (result: LocationSelectResult) => void;
}

export const DeliveryZoneMap: React.FC<DeliveryZoneMapProps> = ({
  initialLat,
  initialLng,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Default pin to either initial or 6km from farm
  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || FARM_LOCATION.lat + 0.05,
    lng: initialLng || FARM_LOCATION.lng + 0.05,
  });

  const distanceKm = calculateDistanceKm(
    FARM_LOCATION.lat,
    FARM_LOCATION.lng,
    pinCoords.lat,
    pinCoords.lng
  );
  const isDeliverable = distanceKm <= FARM_LOCATION.maxDeliveryRadiusKm;

  // Debounced reverse geocoding lookup
  const triggerReverseGeocode = useCallback(async (lat: number, lng: number, dist: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        onLocationSelect({
          lat,
          lng,
          distanceKm: dist,
          isDeliverable: dist <= FARM_LOCATION.maxDeliveryRadiusKm,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        });
      } else {
        onLocationSelect({
          lat,
          lng,
          distanceKm: dist,
          isDeliverable: dist <= FARM_LOCATION.maxDeliveryRadiusKm,
        });
      }
    } catch (e) {
      onLocationSelect({
        lat,
        lng,
        distanceKm: dist,
        isDeliverable: dist <= FARM_LOCATION.maxDeliveryRadiusKm,
      });
    } finally {
      setIsReverseGeocoding(false);
    }
  }, [onLocationSelect]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    let isCancelled = false;

    // Dynamically import Leaflet to prevent any SSR window issues
    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Fix Leaflet's default icon URL paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create custom div icons
      const createPinIcon = (deliverable: boolean) => {
        const bg = deliverable ? '#10b981' : '#ef4444';
        const label = deliverable ? '🟢 Deliverable' : '🔴 Outside Zone';
        return L.divIcon({
          className: 'custom-user-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
              <div style="background: ${deliverable ? '#064e3b' : '#7f1d1d'}; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 1.5px solid #fff; margin-bottom: 2px;">
                ${label}
              </div>
              <div style="width: 28px; height: 28px; border-radius: 50% 50% 50% 0; background: ${bg}; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); border: 2.5px solid #ffffff;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff; transform: rotate(45deg);"></div>
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      };

      const farmIcon = L.divIcon({
        className: 'custom-farm-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #f59e0b; color: #1c1917; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 1.5px solid #fff; margin-bottom: 3px;">
              🐓 JP Farms Hub
            </div>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5); display: flex; align-items: center; justify-content: center; font-size: 16px;">
              🏡
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      // Initialize map centered at JP Farms
      const map = L.map(mapContainerRef.current, {
        center: [FARM_LOCATION.lat, FARM_LOCATION.lng],
        zoom: 11,
        zoomControl: false,
      });

      // Add clean zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // 1. Draw 20 km Green Delivery Circle
      const circle = L.circle([FARM_LOCATION.lat, FARM_LOCATION.lng], {
        radius: FARM_LOCATION.maxDeliveryRadiusKm * 1000, // 20,000 meters
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.16,
        weight: 2.5,
        dashArray: '6, 6',
      }).addTo(map);

      circleRef.current = circle;

      // 2. Add JP Farms Hub Marker
      L.marker([FARM_LOCATION.lat, FARM_LOCATION.lng], {
        icon: farmIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 11px; padding: 2px;">
            <strong style="color: #d97706; display: block; font-size: 12px;">🐓 JP Farms Breeding Estate</strong>
            <span>Dispatch Center • Max 20 km Live Animal Delivery Radius</span>
          </div>
        `);

      // 3. Add Draggable User Pin
      const initialDist = calculateDistanceKm(
        FARM_LOCATION.lat,
        FARM_LOCATION.lng,
        pinCoords.lat,
        pinCoords.lng
      );
      const userMarker = L.marker([pinCoords.lat, pinCoords.lng], {
        draggable: true,
        icon: createPinIcon(initialDist <= FARM_LOCATION.maxDeliveryRadiusKm),
        zIndexOffset: 2000,
      }).addTo(map);

      // Handle marker drag
      userMarker.on('drag', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setPinCoords({ lat, lng });
        const currentDist = calculateDistanceKm(
          FARM_LOCATION.lat,
          FARM_LOCATION.lng,
          lat,
          lng
        );
        userMarker.setIcon(createPinIcon(currentDist <= FARM_LOCATION.maxDeliveryRadiusKm));
      });

      // Handle marker dragend (auto-reverse geocode)
      userMarker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        const finalDist = calculateDistanceKm(
          FARM_LOCATION.lat,
          FARM_LOCATION.lng,
          lat,
          lng
        );
        userMarker.setIcon(createPinIcon(finalDist <= FARM_LOCATION.maxDeliveryRadiusKm));
        triggerReverseGeocode(lat, lng, finalDist);
      });

      // Click anywhere on the map to jump the pin
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setPinCoords({ lat, lng });
        userMarker.setLatLng([lat, lng]);
        const clickDist = calculateDistanceKm(
          FARM_LOCATION.lat,
          FARM_LOCATION.lng,
          lat,
          lng
        );
        userMarker.setIcon(createPinIcon(clickDist <= FARM_LOCATION.maxDeliveryRadiusKm));
        triggerReverseGeocode(lat, lng, clickDist);
      });

      userMarkerRef.current = userMarker;
      mapInstanceRef.current = map;
      setIsMapReady(true);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update marker position if initialLat/Lng change from parent
  useEffect(() => {
    if (!initialLat || !initialLng || !userMarkerRef.current || !mapInstanceRef.current) return;
    userMarkerRef.current.setLatLng([initialLat, initialLng]);
    setPinCoords({ lat: initialLat, lng: initialLng });
    mapInstanceRef.current.panTo([initialLat, initialLng]);
  }, [initialLat, initialLng]);

  // Recenter on JP Farms Hub
  const handleCenterOnFarm = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([FARM_LOCATION.lat, FARM_LOCATION.lng], 11, {
      duration: 1,
    });
  };

  // Locate user device via GPS
  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setPinCoords({ lat: latitude, lng: longitude });

        if (userMarkerRef.current && mapInstanceRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.2 });
        }

        const dist = calculateDistanceKm(
          FARM_LOCATION.lat,
          FARM_LOCATION.lng,
          latitude,
          longitude
        );
        triggerReverseGeocode(latitude, longitude, dist);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not detect device GPS. You can manually drag the pin to your delivery spot.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="mt-2.5 rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-900 shadow-sm transition-all duration-300">
      
      {/* Map Header / Zone Status Bar */}
      <div className={`px-3 py-2 flex items-center justify-between text-xs transition-colors duration-200 ${
        isDeliverable ? 'bg-emerald-950 text-emerald-100' : 'bg-rose-950 text-rose-100'
      }`}>
        <div className="flex items-center space-x-2">
          {isDeliverable ? (
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
          )}
          <span className="font-bold">
            {isDeliverable ? 'Deliverable (Green Zone)' : 'Undeliverable (Red Zone)'}
          </span>
          <span className="text-[10px] opacity-75 hidden sm:inline">
            (~{distanceKm} km from Farm)
          </span>
        </div>

        {/* Live Geocoding indicator */}
        <div className="flex items-center space-x-2">
          {isReverseGeocoding && (
            <span className="flex items-center space-x-1 text-[10px] text-amber-300 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Resolving address...</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-white/10 text-slate-300 transition"
            title={isExpanded ? 'Compact map' : 'Expand map'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className={`w-full transition-all duration-300 ${
            isExpanded ? 'h-72 sm:h-80' : 'h-48 sm:h-52'
          }`}
        />

        {/* Floating Quick Action Controls on Map */}
        <div className="absolute top-2.5 left-2.5 z-[1000] flex flex-col space-y-1.5">
          <button
            type="button"
            onClick={handleCenterOnFarm}
            className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-bold transition active:scale-95 cursor-pointer"
            title="Recenter map on JP Farms 20 km green zone"
          >
            <span>🐓 Center Farm</span>
          </button>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
            title="Locate my phone GPS"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
            ) : (
              <Navigation className="w-3 h-3 text-amber-600 fill-amber-600" />
            )}
            <span>{isLocating ? 'Locating...' : 'My Device'}</span>
          </button>
        </div>

        {/* Legend Hint at Bottom Left */}
        <div className="absolute bottom-2 left-2 z-[1000] bg-black/75 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[10px] pointer-events-none flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>20 km Green Zone</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="text-amber-300">💡 Drag pin to move</span>
        </div>
      </div>

      {/* Subtext info */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-1">
          <Compass className="w-3 h-3 text-slate-400 shrink-0" />
          <span>
            {isDeliverable ? (
              <strong className="text-emerald-700">Eligible for Live AC Crate Delivery</strong>
            ) : (
              <strong className="text-rose-600">Outside 20 km (Please select Farm Pickup)</strong>
            )}
          </span>
        </div>
        <span className="font-mono font-bold text-slate-800">
          ~{distanceKm} km
        </span>
      </div>

    </div>
  );
};
