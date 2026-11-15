'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Navigation, 
  Maximize2, 
  Minimize2,
  Compass,
  Loader2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  RotateCcw
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

/**
 * Generate polygon coordinates approximating a circle of a given radius (km)
 * used for creating Leaflet polygon masks / holes.
 */
function generateCirclePoints(
  centerLat: number, 
  centerLng: number, 
  radiusKm: number, 
  numPoints = 64
): [number, number][] {
  const points: [number, number][] = [];
  const earthRadiusKm = 6371;
  const latRad = (centerLat * Math.PI) / 180;
  const lngRad = (centerLng * Math.PI) / 180;
  const dByR = radiusKm / earthRadiusKm;

  for (let i = 0; i < numPoints; i++) {
    const bearing = (i * 2 * Math.PI) / numPoints;
    const pointLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(dByR) +
      Math.cos(latRad) * Math.sin(dByR) * Math.cos(bearing)
    );
    const pointLngRad = lngRad + Math.atan2(
      Math.sin(bearing) * Math.sin(dByR) * Math.cos(latRad),
      Math.cos(dByR) - Math.sin(latRad) * Math.sin(pointLatRad)
    );
    points.push([(pointLatRad * 180) / Math.PI, (pointLngRad * 180) / Math.PI]);
  }
  points.push(points[0]); // close polygon loop
  return points;
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
  const lineRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Pin coordinates (default to initial or 6km east from farm)
  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || FARM_LOCATION.lat + 0.04,
    lng: initialLng || FARM_LOCATION.lng + 0.04,
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

  // Update connecting line between JP Farms Hub and User Marker
  const updateConnectorLine = useCallback((userLat: number, userLng: number, dist: number) => {
    if (!mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;

    if (lineRef.current) {
      lineRef.current.remove();
      lineRef.current = null;
    }

    // Only draw dashed route line if outside or far away
    if (dist > FARM_LOCATION.maxDeliveryRadiusKm) {
      lineRef.current = L.polyline(
        [
          [FARM_LOCATION.lat, FARM_LOCATION.lng],
          [userLat, userLng],
        ],
        {
          color: '#ef4444',
          weight: 2.5,
          dashArray: '6, 8',
          opacity: 0.8,
        }
      ).addTo(mapInstanceRef.current);
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    let isCancelled = false;

    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;
      LRef.current = L;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default icons fix
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // User Pin Icon
      const createPinIcon = (deliverable: boolean) => {
        const bg = deliverable ? '#10b981' : '#ef4444';
        const label = deliverable ? '🟢 Inside 20 km' : '🔴 Outside 20 km';
        return L.divIcon({
          className: 'custom-user-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
              <div style="background: ${deliverable ? '#064e3b' : '#7f1d1d'}; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 1.5px solid #fff; margin-bottom: 2px;">
                ${label}
              </div>
              <div style="width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: ${bg}; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); border: 2.5px solid #ffffff;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff; transform: rotate(45deg);"></div>
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      };

      // JP Farms Hub Icon
      const farmIcon = L.divIcon({
        className: 'custom-farm-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #f59e0b; color: #1c1917; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,0.35); border: 1.5px solid #fff; margin-bottom: 3px;">
              🐓 JP Farms Hub
            </div>
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.6); display: flex; align-items: center; justify-content: center; font-size: 16px;">
              🏡
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [FARM_LOCATION.lat, FARM_LOCATION.lng],
        zoom: 10,
        zoomControl: false,
      });

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      /* =======================================================================
         1. UNDELIVERABLE RED ZONE (LIGHT RED MASK OUTSIDE 20 KM RADIUS)
         Creates a donut mask over the entire world with a hole for 20km zone
         ======================================================================= */
      const outerWorldBounds: [number, number][] = [
        [-85, -180],
        [-85, 180],
        [85, 180],
        [85, -180],
        [-85, -180],
      ];
      const circlePoints = generateCirclePoints(
        FARM_LOCATION.lat, 
        FARM_LOCATION.lng, 
        FARM_LOCATION.maxDeliveryRadiusKm, 
        72
      );

      // Add light red mask covering all undeliverable area
      L.polygon([outerWorldBounds, circlePoints], {
        fillColor: '#ef4444',
        fillOpacity: 0.22, // Light red colour as requested by the user
        color: '#dc2626',
        weight: 2,
        dashArray: '5, 5',
        interactive: false,
      }).addTo(map);

      /* =======================================================================
         2. DELIVERABLE GREEN ZONE (20 KM RADIUS)
         Bright green circle clearly circumscribing the deliverable radius
         ======================================================================= */
      const circle = L.circle([FARM_LOCATION.lat, FARM_LOCATION.lng], {
        radius: FARM_LOCATION.maxDeliveryRadiusKm * 1000, // 20,000 meters
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.22,
        weight: 3,
        interactive: false,
      }).addTo(map);

      circleRef.current = circle;

      // 3. Add JP Farms Hub Center Marker
      L.marker([FARM_LOCATION.lat, FARM_LOCATION.lng], {
        icon: farmIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 11px; padding: 2px;">
            <strong style="color: #d97706; display: block; font-size: 12px;">🐓 JP Farms Breeding Estate</strong>
            <span>Safe Live Animal Transit Center • 20 km Green Delivery Zone</span>
          </div>
        `);

      // 4. Add User Pin
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

      // Handle dragging
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
        updateConnectorLine(lat, lng, currentDist);
      });

      userMarker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        const finalDist = calculateDistanceKm(
          FARM_LOCATION.lat,
          FARM_LOCATION.lng,
          lat,
          lng
        );
        userMarker.setIcon(createPinIcon(finalDist <= FARM_LOCATION.maxDeliveryRadiusKm));
        updateConnectorLine(lat, lng, finalDist);
        triggerReverseGeocode(lat, lng, finalDist);
      });

      // Jump pin on map click
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
        updateConnectorLine(lat, lng, clickDist);
        triggerReverseGeocode(lat, lng, clickDist);
      });

      userMarkerRef.current = userMarker;
      mapInstanceRef.current = map;

      // 5. Initial Camera Setup: Always ensure the 20km Deliverable Circle is 100% VISIBLE!
      setTimeout(() => {
        if (!mapInstanceRef.current) return;
        map.invalidateSize();
        // Fit the 20 km deliverable circle in full view with healthy padding
        map.fitBounds(circle.getBounds(), { padding: [22, 22] });
        updateConnectorLine(pinCoords.lat, pinCoords.lng, initialDist);
      }, 150);

      setIsMapReady(true);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync external coordinates changes
  useEffect(() => {
    if (!initialLat || !initialLng || !userMarkerRef.current || !mapInstanceRef.current || !LRef.current) return;
    const dist = calculateDistanceKm(
      FARM_LOCATION.lat,
      FARM_LOCATION.lng,
      initialLat,
      initialLng
    );
    setPinCoords({ lat: initialLat, lng: initialLng });
    userMarkerRef.current.setLatLng([initialLat, initialLng]);
    updateConnectorLine(initialLat, initialLng, dist);
  }, [initialLat, initialLng, updateConnectorLine]);

  // Recenter to show the complete 20 km deliverable zone
  const handleShowDeliverableRadius = () => {
    if (!mapInstanceRef.current || !circleRef.current) return;
    mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), { 
      padding: [20, 20],
      duration: 0.8
    });
  };

  // Focus user pin
  const handleFocusMyPin = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([pinCoords.lat, pinCoords.lng], 13, { duration: 1 });
  };

  // Fit both Farm + 20km Zone and User Pin
  const handleFitRouteBoth = () => {
    if (!mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const bounds = L.latLngBounds(
      [FARM_LOCATION.lat, FARM_LOCATION.lng],
      [pinCoords.lat, pinCoords.lng]
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35], duration: 1 });
  };

  // Locate user device GPS
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
          const dist = calculateDistanceKm(
            FARM_LOCATION.lat,
            FARM_LOCATION.lng,
            latitude,
            longitude
          );
          updateConnectorLine(latitude, longitude, dist);
          triggerReverseGeocode(latitude, longitude, dist);
          
          // If within 20km, fit zone; if outside, show both
          if (dist <= FARM_LOCATION.maxDeliveryRadiusKm && circleRef.current) {
            mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), { padding: [20, 20] });
          } else if (LRef.current) {
            const bounds = LRef.current.latLngBounds(
              [FARM_LOCATION.lat, FARM_LOCATION.lng],
              [latitude, longitude]
            );
            mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
          }
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Could not detect device GPS. You can manually drag the pin to your delivery spot.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="mt-2.5 rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-900 shadow-md transition-all duration-300">
      
      {/* Zone Status Banner Header */}
      <div className={`px-3 py-2 flex items-center justify-between text-xs transition-colors duration-200 ${
        isDeliverable ? 'bg-emerald-950 text-emerald-100' : 'bg-rose-950 text-rose-100'
      }`}>
        <div className="flex items-center space-x-2">
          {isDeliverable ? (
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
          )}
          <span className="font-extrabold tracking-tight">
            {isDeliverable 
              ? '✅ Deliverable (Inside 20 km Green Zone)' 
              : '🔴 Undeliverable by Doorstep (Light Red Area)'}
          </span>
          <span className="text-[10px] opacity-80 font-mono font-bold bg-black/30 px-1.5 py-0.5 rounded">
            ~{distanceKm} km
          </span>
        </div>

        {/* Live reverse geocoding & expand controls */}
        <div className="flex items-center space-x-2">
          {isReverseGeocoding && (
            <span className="flex items-center space-x-1 text-[10px] text-amber-300 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Resolving address...</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 300);
            }}
            className="p-1 rounded-md hover:bg-white/10 text-slate-300 transition"
            title={isExpanded ? 'Compact map' : 'Expand map'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Canvas with Optimal Height so 20km circle is fully visible */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className={`w-full transition-all duration-300 ${
            isExpanded ? 'h-80 sm:h-96' : 'h-64 sm:h-72'
          }`}
        />

        {/* Camera Quick Action Controls (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 z-[1000] flex flex-col space-y-1.5">
          {/* 1. Show Complete 20 km Deliverable Green Radius */}
          <button
            type="button"
            onClick={handleShowDeliverableRadius}
            className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-emerald-950 px-2.5 py-1.5 rounded-xl shadow-md border border-emerald-300 text-[11px] font-extrabold transition active:scale-95 cursor-pointer"
            title="Focus and view the complete 20 km deliverable green zone"
          >
            <ZoomIn className="w-3.5 h-3.5 text-emerald-600" />
            <span>Show 20 km Green Zone</span>
          </button>

          {/* 2. Show User Pin or Full Route */}
          {distanceKm > FARM_LOCATION.maxDeliveryRadiusKm ? (
            <button
              type="button"
              onClick={handleFitRouteBoth}
              className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-rose-950 px-2.5 py-1.5 rounded-xl shadow-md border border-rose-300 text-[11px] font-extrabold transition active:scale-95 cursor-pointer"
              title="View route from Farm to your pin (~147 km)"
            >
              <Eye className="w-3.5 h-3.5 text-rose-600" />
              <span>View Route (~{distanceKm} km)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFocusMyPin}
              className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-bold transition active:scale-95 cursor-pointer"
              title="Focus on my pinned address"
            >
              <span>📍 Focus My Pin</span>
            </button>
          )}

          {/* 3. Auto GPS locate button */}
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

        {/* Clear Color Zone Legend Overlay at Bottom Left */}
        <div className="absolute bottom-2 left-2 z-[1000] bg-stone-950/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl text-[10px] pointer-events-none shadow-lg border border-white/10 flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white inline-block shadow-xs"></span>
            <span className="font-bold text-emerald-300">20 km Green Zone (Deliverable)</span>
          </div>
          <span className="text-white/30">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-300 inline-block shadow-xs"></span>
            <span className="font-bold text-rose-300">Light Red Area (Undeliverable)</span>
          </div>
        </div>
      </div>

      {/* Subtext info bar with clear next steps */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-700 gap-1.5">
        <div className="flex items-center space-x-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {isDeliverable ? (
              <strong className="text-emerald-700 font-extrabold">
                Eligible for Live Climate Crate Doorstep Dispatch (~{distanceKm} km from Farm)
              </strong>
            ) : (
              <span className="text-rose-700 font-bold">
                Exceeds 20 km Doorstep Limit (~{distanceKm} km) • <strong className="underline">Farm Pickup</strong> or <strong className="underline">WhatsApp Cargo</strong> available!
              </span>
            )}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium self-end sm:self-auto">
          💡 Drag pin to test any location
        </span>
      </div>

    </div>
  );
};
