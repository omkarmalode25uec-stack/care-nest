/**
 * Nashik Healthcare Assistance Points (Isolated Reference Dataset)
 * Geographic Scope: nashik
 * Data Status: reference
 */

export const nashikReferenceMedicalPoints = [
  {
    name: 'Panchavati Ramkund Sacred Snan Health Post',
    type: 'Medical Booth',
    address: 'Opp. Sita Gumpha, Panchavati',
    city: 'Nashik',
    sector: 'Panchavati Sector',
    locationScope: 'nashik',
    dataStatus: 'reference',
    latitude: 20.0063,
    longitude: 73.7915,
    location: { type: 'Point', coordinates: [73.7915, 20.0063] },
    phone: '108',
    services: ['Emergency Snan First Aid', 'Doctor on Duty', 'Free Medication', 'Oxygen Cylinder Assistance'],
    operatingHours: '24 Hours Open',
    isEmergency: true,
    hasAmbulanceBay: false,
    isActive: true,
    isDemo: false,
  },
  {
    name: 'Kushavarta Kund Mela Emergency Hospital',
    type: 'Hospital',
    address: 'Near Kushavarta Kund, Temple Road',
    city: 'Trimbakeshwar',
    sector: 'Temple Sector',
    locationScope: 'nashik',
    dataStatus: 'reference',
    latitude: 19.9324,
    longitude: 73.5308,
    location: { type: 'Point', coordinates: [73.5308, 19.9324] },
    phone: '108',
    services: ['ICU Ward', 'Cardiac Care', 'Doctor Consultation', 'Ambulance Stand'],
    operatingHours: '24 Hours Open',
    isEmergency: true,
    hasAmbulanceBay: true,
    isActive: true,
    isDemo: false,
  },
];
