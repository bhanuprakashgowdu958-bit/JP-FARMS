import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
  }

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

      const addressParts: string[] = [];
      if (addr.house_number) addressParts.push(addr.house_number);
      if (addr.building) addressParts.push(addr.building);
      if (addr.road) addressParts.push(addr.road);
      if (addr.residential) addressParts.push(addr.residential);
      if (addr.suburb) addressParts.push(addr.suburb);
      if (addr.neighbourhood && !addressParts.includes(addr.neighbourhood)) addressParts.push(addr.neighbourhood);
      if (addr.city_district && !addressParts.includes(addr.city_district)) addressParts.push(addr.city_district);

      const streetAddress = addressParts.length > 0 
        ? addressParts.join(', ')
        : (data.display_name?.split(',').slice(0, 3).join(', ') || 'Current GPS Location');

      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Vijayawada';
      const state = addr.state || 'Andhra Pradesh';
      const pincode = addr.postcode || '';

      return NextResponse.json({
        success: true,
        address: streetAddress,
        city,
        state,
        pincode,
        fullDisplayName: data.display_name,
        source: 'nominatim',
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
      const parts = [bdcData.locality, bdcData.principalSubdivision].filter(Boolean);

      return NextResponse.json({
        success: true,
        address: parts.length > 0 ? parts.join(', ') : 'Current GPS Location',
        city: locality || 'Vijayawada',
        state: bdcData.principalSubdivision || 'Andhra Pradesh',
        pincode: bdcData.postcode || '',
        source: 'bigdatacloud',
      });
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode error:', err);
  }

  // 3. Fallback generic coordinates
  return NextResponse.json({
    success: true,
    address: `GPS Location (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})`,
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '',
    source: 'coordinates',
  });
}
