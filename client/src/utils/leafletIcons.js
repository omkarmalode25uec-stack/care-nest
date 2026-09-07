import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Utility for converting MongoDB GeoJSON [longitude, latitude] to Leaflet [latitude, longitude]
 * @param {Object} property - Property entity
 * @returns {[number, number]|null} - [latitude, longitude] or null if invalid
 */
export const getLeafletLatLng = (property) => {
  if (!property) return null;

  // 1. Check top-level numeric latitude & longitude
  if (
    typeof property.latitude === 'number' &&
    typeof property.longitude === 'number' &&
    !isNaN(property.latitude) &&
    !isNaN(property.longitude)
  ) {
    if (property.latitude >= -90 && property.latitude <= 90 && property.longitude >= -180 && property.longitude <= 180) {
      return [property.latitude, property.longitude];
    }
  }

  // 2. Check GeoJSON coordinates [longitude, latitude]
  if (
    property.location &&
    Array.isArray(property.location.coordinates) &&
    property.location.coordinates.length >= 2
  ) {
    const [lng, lat] = property.location.coordinates;
    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      return [lat, lng];
    }
  }

  return null;
};

/**
 * Creates custom HTML/SVG DivIcon for property price badge markers on OpenStreetMap
 * @param {number|string} price - Price per night in INR
 * @param {boolean} isSelected - Whether this marker is currently selected/active
 */
export const createStayPriceIcon = (price = 0, isSelected = false) => {
  const formattedPrice = typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : `₹${price}`;
  
  const bgClass = isSelected
    ? 'bg-slate-900 text-amber-300 ring-4 ring-orange-500 scale-110 shadow-2xl'
    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg';

  const html = `
    <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 group">
      <div class="px-2.5 py-1 rounded-xl text-xs font-black tracking-tight flex items-center gap-1 border border-white/40 ${bgClass}">
        <span>🏠</span>
        <span>${formattedPrice}</span>
      </div>
      <div class="w-2 h-2 rotate-45 -mt-1 ${isSelected ? 'bg-slate-900 ring-1 ring-orange-500' : 'bg-orange-600'}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-stay-price-marker',
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -36],
  });
};

/**
 * Primary Large Stay Pin Icon for single property details map
 */
export const createPrimaryStayIcon = () => {
  const html = `
    <div class="relative flex flex-col items-center cursor-pointer animate-bounce-short">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-white">
        <span class="text-lg">🛏️</span>
      </div>
      <div class="w-2.5 h-2.5 rotate-45 -mt-1.5 bg-orange-600 border-r-2 border-b-2 border-white"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-primary-stay-marker',
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
};

/**
 * Creates custom icon for Kumbh landmarks (Ghats, Medical, Shuttle, Parking)
 * @param {string} type - 'ghat' | 'medical' | 'shuttle' | 'parking' | 'station'
 */
export const createLandmarkIcon = (type = 'ghat') => {
  let iconEmoji = '📍';
  let bgColor = 'bg-slate-700';

  switch (type) {
    case 'ghat':
      iconEmoji = '🌊';
      bgColor = 'bg-cyan-600';
      break;
    case 'medical':
      iconEmoji = '🏥';
      bgColor = 'bg-red-600';
      break;
    case 'parking':
      iconEmoji = '🅿️';
      bgColor = 'bg-emerald-600';
      break;
    case 'shuttle':
      iconEmoji = '🚌';
      bgColor = 'bg-amber-600';
      break;
    case 'station':
      iconEmoji = '🚆';
      bgColor = 'bg-indigo-600';
      break;
    default:
      iconEmoji = '📍';
      bgColor = 'bg-orange-600';
  }

  const html = `
    <div class="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
      <div class="w-7 h-7 rounded-xl ${bgColor} text-white flex items-center justify-center shadow-md border border-white text-xs">
        <span>${iconEmoji}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-landmark-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};
