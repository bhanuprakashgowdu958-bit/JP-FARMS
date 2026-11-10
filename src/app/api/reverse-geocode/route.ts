import { NextRequest, NextResponse } from 'next/server';
import { FARM_LOCATION } from '@/lib/data';
import { calculateDistanceKm } from '@/lib/utils';

function formatIndianAddress(addr: any, displayName?: string) {
  const parts: string[] = [];

  // 1. Street / Road / Landmark / House
  const streetParts: string[] = [];
  if (addr.house_number) streetParts.push(addr.house_number);
  if (addr.building) streetParts.push(addr.building);
  if (addr.road) streetParts.push(addr.road);
  if (addr.residential && !streetParts.includes(addr.residential)) streetParts.push(addr.residential);

  const streetStr = streetParts.join(', ');
  if (streetStr) parts.push(streetStr);

  // 2. Village / Hamlet / Colony / Suburb
  const villageRaw = addr.village || addr.hamlet || addr.neighbourhood || addr.suburb || '';
  if (villageRaw) {
    const isAlreadyVillage = /\b(village|grama|colony|nagar|puram|palli|palem)\b/i.test(villageRaw);
    const villageFormatted = isAlreadyVillage ? villageRaw : `${villageRaw} Village`;
    if (!parts.some(p => p.toLowerCase().includes(villageRaw.toLowerCase()))) {
      parts.push(villageFormatted);
    }
  }

  // 3. Mandal / Taluk / Tehsil
  const mandalRaw = addr.county || addr.subdistrict || addr.town || addr.city_district || '';
  if (mandalRaw) {
    const isAlreadyMandal = /\b(mandal|taluk|taluka|tehsil|block)\b/i.test(mandalRaw);
    const mandalFormatted = isAlreadyMandal ? mandalRaw : `${mandalRaw} Mandal`;
    if (!parts.some(p => p.toLowerCase().includes(mandalRaw.toLowerCase()))) {
      parts.push(mandalFormatted);
    }
  }

  // 4. District
  const districtRaw = addr.state_district || addr.district || '';
  if (districtRaw) {
    const isAlreadyDistrict = /\b(district|dist)\b/i.test(districtRaw);
    const districtFormatted = isAlreadyDistrict ? districtRaw : `${districtRaw} District`;
    if (!parts.some(p => p.toLowerCase().includes(districtRaw.toLowerCase()))) {
      parts.push(districtFormatted);
    }
  }

  // 5. State
  const stateRaw = addr.state || 'Andhra Pradesh';
  if (!parts.some(p => p.toLowerCase().includes(stateRaw.toLowerCase()))) {
    parts.push(stateRaw);
  }

  // 6. Pincode
  const pincodeRaw = addr.postcode || '';

  // Combine into final full address
  let fullAddress = parts.join(', ');
  if (pincodeRaw && !fullAddress.includes(pincodeRaw)) {
    fullAddress += ` - ${pincodeRaw}`;
  }

  // If parts were too few and displayName is available, extract from display_name
  if (parts.length < 3 && displayName) {
    const cleanDisplay = displayName.replace(/, India$/, '').trim();
    if (cleanDisplay.length > fullAddress.length) {
      fullAddress = cleanDisplay;
    }
  }

  return {
    fullAddress,
    village: villageRaw,
    mandal: mandalRaw,
    district: districtRaw,
    state: stateRaw,
    pincode: pincodeRaw,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
  }

  const userLat = Number(lat);
  const userLng = Number(lng);

  if (isNaN(userLat) || isNaN(userLng) || userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
    return NextResponse.json({ error: 'Valid numerical coordinates are required (lat: -90..90, lng: -180..180)' }, { status: 400 });
  }
  const distanceKm = !isNaN(userLat) && !isNaN(userLng)
    ? calculateDistanceKm(FARM_LOCATION.lat, FARM_LOCATION.lng, userLat, userLng)
    : null;
  const isDeliverable = distanceKm !== null ? distanceKm <= FARM_LOCATION.maxDeliveryRadiusKm : true;
  const maxRadiusKm = FARM_LOCATION.maxDeliveryRadiusKm;

  // 1. Try OpenStreetMap Nominatim
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'JPFarms-BreederApp/1.0 (contact@jpfarms.in)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const formatted = formatIndianAddress(addr, data.display_name);

      const city = formatted.mandal 
        ? (formatted.mandal.toLowerCase().includes('mandal') ? formatted.mandal : `${formatted.mandal} Mandal`)
        : (addr.city || addr.town || addr.village || 'Palamaner');

      return NextResponse.json({
        success: true,
        address: formatted.fullAddress,
        village: formatted.village,
        mandal: formatted.mandal,
        district: formatted.district,
        city: city,
        state: formatted.state,
        pincode: formatted.pincode,
        fullDisplayName: data.display_name,
        source: 'nominatim',
        distanceKm,
        isDeliverable,
        maxRadiusKm,
      });
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode error:', err);
  }

  // 2. Fallback to BigDataCloud
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&localityLanguage=en`;
    const res = await fetch(bdcUrl);
    if (res.ok) {
      const bdcData = await res.json();
      const locality = bdcData.locality || bdcData.city || '';
      const state = bdcData.principalSubdivision || 'Andhra Pradesh';
      const pincode = bdcData.postcode || '';
      
      const adminLevels = bdcData.localityInfo?.administrative || [];
      const districtObj = adminLevels.find((a: any) => a.adminLevel === 5 || a.description?.toLowerCase().includes('district'));
      const mandalObj = adminLevels.find((a: any) => a.adminLevel === 6 || a.adminLevel === 8 || a.description?.toLowerCase().includes('taluk') || a.description?.toLowerCase().includes('mandal'));

      const village = locality ? `${locality} Village` : '';
      const mandal = mandalObj?.name ? `${mandalObj.name} Mandal` : '';
      const district = districtObj?.name ? `${districtObj.name} District` : '';

      const parts = [village, mandal, district, state].filter(Boolean);
      let address = parts.join(', ');
      if (pincode) address += ` - ${pincode}`;

      return NextResponse.json({
        success: true,
        address: address || 'Current Location',
        village: locality,
        mandal: mandalObj?.name || '',
        district: districtObj?.name || '',
        city: mandalObj?.name ? `${mandalObj.name} Mandal` : (locality || 'Palamaner'),
        state: state,
        pincode: pincode,
        source: 'bigdatacloud',
        distanceKm,
        isDeliverable,
        maxRadiusKm,
      });
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode error:', err);
  }

  // 3. Fallback generic coordinates
  return NextResponse.json({
    success: true,
    address: `GPS Location (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}), Andhra Pradesh`,
    city: 'Palamaner',
    state: 'Andhra Pradesh',
    pincode: '',
    source: 'coordinates',
    distanceKm,
    isDeliverable,
    maxRadiusKm,
  });
}

