/**
 * Kumbh Mela Key Coordinates & Location Intelligence Service
 * 
 * Accurately calculates geodesic Haversine distance from properties
 * to Nashik Kumbh Snan Ghats, Emergency Medical Booths, Sector Parking, and Transport Hubs.
 */

export const KUMBH_LANDMARKS = {
  nashik: [
    {
      id: 'nsk_snan_ramkund',
      name: 'Ramkund Sacred Snan Ghat',
      type: 'ghat',
      latitude: 20.0063,
      longitude: 73.7915,
      description: 'Main Godavari Shahi Snan Kund & Holy Asthi Visarjan Ghat',
    },
    {
      id: 'nsk_temple_kalaram',
      name: 'Shree Kalaram Sansthan Temple',
      type: 'temple',
      latitude: 20.0075,
      longitude: 73.7940,
      description: 'Historic black stone temple built in 1782 in Panchavati',
    },
    {
      id: 'nsk_temple_sita_gumpha',
      name: 'Sita Gumpha (Caves)',
      type: 'temple',
      latitude: 20.0070,
      longitude: 73.7930,
      description: 'Sacred Ramayana caves where Goddess Sita stayed',
    },
    {
      id: 'nsk_snan_kushavarta',
      name: 'Kushavarta Holy Snan Kund (Trimbakeshwar)',
      type: 'ghat',
      latitude: 19.9324,
      longitude: 73.5308,
      description: 'Sacred source Kund of holy Godavari River for Shahi Snan dips',
    },
    {
      id: 'nsk_temple_trimbak',
      name: 'Trimbakeshwar Jyotirlinga Temple',
      type: 'temple',
      latitude: 19.9310,
      longitude: 73.5320,
      description: 'Ancient 12 Jyotirlinga temple at Brahmagiri mountain base',
    },
    {
      id: 'nsk_snan_tapovan',
      name: 'Tapovan Godavari Snan Ghat',
      type: 'ghat',
      latitude: 19.9980,
      longitude: 73.8120,
      description: 'Serene penance grounds of Sage Lakshman and Godavari confluence',
    },
    {
      id: 'nsk_medical_panchavati',
      name: 'Panchavati Ramkund Mela Medical Booth No. 1',
      type: 'medical',
      latitude: 20.0063,
      longitude: 73.7915,
      description: '24/7 emergency ambulance & pilgrim medical first-aid support',
    },
    {
      id: 'nsk_medical_trimbak',
      name: 'Kushavarta Emergency Medical Hospital',
      type: 'medical',
      latitude: 19.9324,
      longitude: 73.5308,
      description: '24/7 ICU trauma and pilgrim hydration center',
    },
    {
      id: 'nsk_parking_tapadia',
      name: 'Tapadia Mela Ground Parking Terminal',
      type: 'parking',
      latitude: 20.0150,
      longitude: 73.7820,
      description: 'Designated tourist bus and private car parking area with shuttle link',
    },
    {
      id: 'nsk_shuttle_cbs',
      name: 'CBS Central Bus Terminal & Mela Shuttle Point',
      type: 'shuttle',
      latitude: 19.9985,
      longitude: 73.7850,
      description: 'MSRTC city and mela connecting express electric bus depot',
    },
    {
      id: 'nsk_station_rly',
      name: 'Nashik Road Railway Station',
      type: 'station',
      latitude: 19.9530,
      longitude: 73.8340,
      description: 'Central Railway main junction connecting Mumbai, Pune, and North India',
    },
  ],
};

/**
 * Calculates geodesic distance between two GPS coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Formats a distance in km to human-readable format
 * @param {number} distanceKm - Distance in km
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    const walkMin = Math.max(1, Math.round(meters / 80)); // avg 80m/min walking pace
    return `${meters} meters (${walkMin} min walk)`;
  } else {
    const km = distanceKm.toFixed(1);
    const driveMin = Math.max(3, Math.round(distanceKm * 3));
    return `${km} km (${driveMin} min via shuttle/vehicle)`;
  }
};

/**
 * Computes nearest landmarks (Ghat, Medical, Parking, Shuttle) for a given coordinate in Nashik
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} city 
 */
export const getNearestLandmarks = (latitude, longitude, city = 'Nashik') => {
  const landmarks = KUMBH_LANDMARKS.nashik;

  const categorized = {
    ghat: null,
    medical: null,
    parking: null,
    shuttle: null,
  };

  const results = landmarks.map((lm) => {
    const distanceKm = calculateDistanceKm(latitude, longitude, lm.latitude, lm.longitude);
    const formatted = formatDistance(distanceKm);
    const item = {
      id: lm.id,
      pointName: lm.name,
      type: lm.type,
      distance: formatted,
      distanceKm: Number(distanceKm.toFixed(2)),
      description: lm.description,
      coordinates: [lm.longitude, lm.latitude],
    };

    if (!categorized[lm.type] || categorized[lm.type].distanceKm > distanceKm) {
      categorized[lm.type] = item;
    }

    return item;
  });

  // Sort overall by closest distance
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    nearestByCategory: categorized,
    allLandmarks: results,
  };
};

export default {
  KUMBH_LANDMARKS,
  calculateDistanceKm,
  formatDistance,
  getNearestLandmarks,
};
