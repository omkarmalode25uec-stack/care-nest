import json
import os

# We will construct a clean, modern seedData.js with proper geographic separation
seed_content = '''import Property from '../models/Property.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import MedicalPoint from '../models/MedicalPoint.js';

export const sampleMedicalPoints = [
  // 1. PRAYAGRAJ MEDICAL POINTS (Demo Dataset for KumbhStay Prayagraj)
  {
    name: 'Sangam Sector 2 Red Cross Emergency Hospital',
    type: 'Hospital',
    address: 'Near Pontoon Bridge 2, Sector 2 Mela Enclave',
    city: 'Prayagraj',
    sector: 'Sector 2 (Sangam Enclave)',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4340,
    longitude: 81.8650,
    location: { type: 'Point', coordinates: [81.8650, 25.4340] },
    phone: '108',
    services: ['24/7 Oxygen Supply', 'ICU Emergency Beds', 'Trauma Care Unit', 'Doctor Consultation', 'Free Essential Medicines', 'Ambulance Bay'],
    operatingHours: '24 Hours Open (Continuous Emergency Shift)',
    isEmergency: true,
    hasAmbulanceBay: true,
    isActive: true,
    isDemo: true,
  },
  {
    name: 'Daraganj Ghat Medical Booth No. 3',
    type: 'Medical Booth',
    address: 'Plot 12, Daraganj Ghat Marg, near Sector 2 Entry Gate',
    city: 'Prayagraj',
    sector: 'Sector 2',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4315,
    longitude: 81.8690,
    location: { type: 'Point', coordinates: [81.8690, 25.4315] },
    phone: '108',
    services: ['First Aid & Dressing', 'Doctor on Duty', 'Free ORS & Hydration', 'Blood Pressure & Sugar Check', 'General Medicines'],
    operatingHours: '24 Hours Open',
    isEmergency: true,
    hasAmbulanceBay: false,
    isActive: true,
    isDemo: true,
  },
  {
    name: 'Sector 4 Central Yatri Ambulance Point',
    type: 'Ambulance Point',
    address: 'Sector 4 Parking & Shuttle Terminal Hub',
    city: 'Prayagraj',
    sector: 'Sector 4',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4410,
    longitude: 81.8590,
    location: { type: 'Point', coordinates: [81.8590, 25.4410] },
    phone: '108',
    services: ['Rapid Ambulance Evacuation', 'Paramedic First Response', 'Oxygen Support', 'Stretcher & Wheelchair Service'],
    operatingHours: '24 Hours Open',
    isEmergency: true,
    hasAmbulanceBay: true,
    isActive: true,
    isDemo: true,
  },
  {
    name: 'Alopibagh Pilgrim First Aid Camp',
    type: 'First Aid',
    address: '14/B, Alopi Devi Temple Marg, Alopibagh',
    city: 'Prayagraj',
    sector: 'Alopibagh / Sector 5',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4398,
    longitude: 81.8741,
    location: { type: 'Point', coordinates: [81.8741, 25.4398] },
    phone: '108',
    services: ['Wound Dressing', 'Foot Blister Care', 'Free ORS', 'Senior Citizen Health Check'],
    operatingHours: '6:00 AM - 11:00 PM',
    isEmergency: false,
    hasAmbulanceBay: false,
    isActive: true,
    isDemo: true,
  },

  // 2. NASHIK REFERENCE MEDICAL POINTS (Isolated Reference Dataset)
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

export const sampleProperties = [
  // -------------------------------------------------------------
  // 1. PRAYAGRAJ PROPERTIES (Demo/Production KumbhStay Dataset)
  // -------------------------------------------------------------
  {
    title: 'Shree Ram Residency & Pilgrim Niwas',
    description: 'A dedicated pilgrim guest house located within walking distance of the Sangam Triveni Ghat. Features spacious family rooms, clean Western and Indian attached washrooms, and 24/7 solar-geyser hot water. Sattvic pure vegetarian breakfast and herbal tea provided every morning for yatris.',
    propertyType: 'hotel',
    address: 'Plot 14, Daraganj Ghat Marg, Sector 2',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4312,
    longitude: 81.8682,
    location: {
      type: 'Point',
      coordinates: [81.8682, 25.4312],
    },
    distanceFromKumbh: '800 m from Sangam Triveni Ghat',
    distancePoints: [
      { pointName: 'Sangam Triveni Snan Ghat', distance: '800 meters (10 min walk)', type: 'ghat' },
      { pointName: 'Pontoon Bridge No. 3', distance: '400 meters', type: 'ghat' },
      { pointName: 'Sector 2 Electric Shuttle Stand', distance: '150 meters', type: 'shuttle' },
      { pointName: 'Temporary Mela First Aid Post', distance: '200 meters', type: 'medical' },
      { pointName: 'Prayagraj Rambag Railway Station', distance: '2.5 km', type: 'station' },
    ],
    pricePerNight: 850,
    priceRange: 'budget',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood', 'powerBackup'],
    occupantPreferences: ['family', 'female', 'children', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_prayagraj_ram_residency_01',
    googleRating: 4.4,
    googleReviewCount: 184,
    googleReviews: [
      {
        author: 'Rameshwar Dayal',
        rating: 5,
        text: 'Clean bedding and genuinely 24/7 hot water even at 4 AM before the holy snan. The walking path to Sangam Ghat was very safe and well lit.',
        date: 'February 2026',
      },
      {
        author: 'Sunita Mehra',
        rating: 4,
        text: 'Very comfortable stay for our family with elderly parents. Ground floor rooms available with zero stairs. Staff is polite and helpful.',
        date: 'January 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 95,
    lastVerifiedAt: new Date('2026-08-15'),
    rules: ['Sattvic pure vegetarian food only', '24h Hot water available for snan', 'Quiet hours after 10 PM'],
    contactPhone: '+91 98200 11223',
    source: { file: 'prayagraj_verified_directory.json', originalId: 'PRY_001' },
    isDemo: true,
    isActive: true,
  },
  {
    title: 'Ananda Ganga Homestay & Satsang Niwas',
    description: 'A warm and peaceful family homestay hosted by a local teacher family in Alopibagh. Offers clean rooms, authentic sattvic home meals, luggage safekeeping, and personalized assistance for Kalpvasi pilgrims.',
    propertyType: 'homestay',
    address: '12/A, Alopibagh Road, near Alopi Devi Temple',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4398,
    longitude: 81.8741,
    location: {
      type: 'Point',
      coordinates: [81.8741, 25.4398],
    },
    distanceFromKumbh: '1.2 km from Sangam Area',
    distancePoints: [
      { pointName: 'Alopi Devi Mandir', distance: '150 meters', type: 'temple' },
      { pointName: 'Sangam Snan Ghat', distance: '1.2 km (E-rickshaw available)', type: 'ghat' },
      { pointName: 'Mela Sector 4 Entry Gate', distance: '600 meters', type: 'shuttle' },
    ],
    pricePerNight: 1200,
    priceRange: 'budget',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
    occupantPreferences: ['family', 'female', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_prayagraj_ananda_ganga_02',
    googleRating: 4.8,
    googleReviewCount: 92,
    googleReviews: [
      {
        author: 'Pooja Agarwal',
        rating: 5,
        text: 'The host family treated us like divine guests. The food was strictly satvik and very fresh. Highly recommend for female travelers.',
        date: 'January 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 97,
    lastVerifiedAt: new Date('2026-08-20'),
    rules: ['No non-veg or alcohol allowed', 'Shoes off at entrance', 'Check-in 12 PM'],
    contactPhone: '+91 94150 55667',
    source: { file: 'prayagraj_verified_directory.json', originalId: 'PRY_002' },
    isDemo: true,
    isActive: true,
  },
  {
    title: 'Sangam View Luxury Tented Colony',
    description: 'Premium Swiss cottage tents situated right inside the authorized Kumbh Mela luxury sector. Includes air conditioning, attached tiled washrooms with geysers, complimentary sattvic buffet meals, and VIP Snan escort pass assistance.',
    propertyType: 'tent',
    address: 'Sector 1 VIP Enclave, Sangam Marg',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4285,
    longitude: 81.8763,
    location: {
      type: 'Point',
      coordinates: [81.8763, 25.4285],
    },
    distanceFromKumbh: '200 m from VIP Snan Ghat',
    distancePoints: [
      { pointName: 'Sangam VIP Ghat', distance: '200 meters', type: 'ghat' },
      { pointName: 'Akshayavat Temple', distance: '500 meters', type: 'temple' },
      { pointName: 'Helipad / VIP Shuttle Drop', distance: '300 meters', type: 'shuttle' },
    ],
    pricePerNight: 3500,
    priceRange: 'luxury',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'ac', 'water', 'hotWater24h', 'parking', 'attachedBathroom', 'pureVegFood', 'powerBackup'],
    occupantPreferences: ['family', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_prayagraj_sangam_tents_07',
    googleRating: 4.9,
    googleReviewCount: 110,
    googleReviews: [
      {
        author: 'Vikram Singhal',
        rating: 5,
        text: 'Unbelievable comfort right in the mela grounds. The hot water and room heater were life savers during January cold waves.',
        date: 'January 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 98,
    lastVerifiedAt: new Date('2026-08-25'),
    rules: ['24/7 security check at sector gate', 'Buffet dining included'],
    contactPhone: '+91 99350 88776',
    source: { file: 'prayagraj_verified_directory.json', originalId: 'PRY_003' },
    isDemo: true,
    isActive: true,
  },
  {
    title: 'Kashi Vishwanath Yatri Hostel',
    description: 'Clean backpacker and budget yatri hostel in Civil Lines, Prayagraj. Bunk beds, individual charging points, personal storage lockers, and filtered RO drinking water.',
    propertyType: 'hostel',
    address: 'Near Subhash Chauraha, Civil Lines',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    locationScope: 'prayagraj',
    dataStatus: 'demo',
    latitude: 25.4523,
    longitude: 81.8345,
    location: {
      type: 'Point',
      coordinates: [81.8345, 25.4523],
    },
    distanceFromKumbh: '3.0 km (Direct Mela Shuttle Route)',
    distancePoints: [
      { pointName: 'Civil Lines Shuttle Hub', distance: '100 meters', type: 'shuttle' },
      { pointName: 'Prayagraj Junction Railway Station', distance: '800 meters', type: 'station' },
      { pointName: 'Sangam Ghat via Shuttle', distance: '15 min on direct route', type: 'ghat' },
    ],
    pricePerNight: 500,
    priceRange: 'budget',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom'],
    occupantPreferences: ['bachelor', 'female'],
    googlePlaceId: 'ChIJ_prayagraj_yatri_hostel_09',
    googleRating: 4.3,
    googleReviewCount: 118,
    googleReviews: [
      {
        author: 'Kunal Sen',
        rating: 4,
        text: 'Super convenient location near the railway station. Direct electric buses go straight to Sector 1.',
        date: 'January 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 89,
    lastVerifiedAt: new Date('2026-08-01'),
    rules: ['Valid student / Govt ID required', 'Alcohol strictly prohibited'],
    contactPhone: '+91 93350 22110',
    source: { file: 'prayagraj_verified_directory.json', originalId: 'PRY_004' },
    isDemo: true,
    isActive: true,
  },

  // -------------------------------------------------------------
  // 2. NASHIK REFERENCE PROPERTIES (Isolated Reference Dataset)
  // -------------------------------------------------------------
  {
    title: 'Panchavati Heritage Pilgrim Hotel',
    description: 'A trusted heritage hotel located right in the sacred heart of Nashik Panchavati, just steps from Ramkund Ghat. AC and non-AC rooms with lift access, secure vehicle parking, and dedicated room service.',
    propertyType: 'hotel',
    address: 'Opp. Sita Gumpha, Panchavati',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'reference',
    latitude: 20.0063,
    longitude: 73.7915,
    location: {
      type: 'Point',
      coordinates: [73.7915, 20.0063],
    },
    distanceFromKumbh: '350 m from Ramkund Ghat',
    distancePoints: [
      { pointName: 'Ramkund Sacred Snan Ghat', distance: '350 meters (4 min walk)', type: 'ghat' },
      { pointName: 'Kalaram Temple', distance: '200 meters', type: 'temple' },
      { pointName: 'Godavari Ghat Bridge', distance: '400 meters', type: 'ghat' },
      { pointName: 'Nashik Road Railway Station', distance: '8.5 km', type: 'station' },
    ],
    pricePerNight: 2400,
    priceRange: 'mid_range',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'ac', 'water', 'hotWater24h', 'parking', 'attachedBathroom', 'powerBackup'],
    occupantPreferences: ['family', 'bachelor', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_nashik_panchavati_heritage_03',
    googleRating: 4.6,
    googleReviewCount: 230,
    googleReviews: [
      {
        author: 'Sanjay Kulkarni',
        rating: 5,
        text: 'You cannot get a closer hotel to Ramkund and Kalaram temple. Perfect location for Shahi Snan participation.',
        date: 'March 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 94,
    lastVerifiedAt: new Date('2026-08-10'),
    rules: ['Valid ID card required for all guests', 'Strictly pure vegetarian restaurant on premise'],
    contactPhone: '+91 98220 99881',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_001' },
    isDemo: false,
    isActive: true,
  },
  {
    title: 'Trimbakeshwar Seva Ashram Dormitory',
    description: 'A large, community-oriented seva ashram near the holy Jyotirlinga and Kushavarta Kund. Offers clean budget dorm beds, locker facilities, and community Mahaprasad twice daily.',
    propertyType: 'hostel',
    address: 'Near Kushavarta Snan Kund, Temple Road',
    city: 'Trimbakeshwar',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'reference',
    latitude: 19.9324,
    longitude: 73.5308,
    location: {
      type: 'Point',
      coordinates: [73.5308, 19.9324],
    },
    distanceFromKumbh: '250 m from Kushavarta Kund',
    distancePoints: [
      { pointName: 'Kushavarta Snan Kund', distance: '250 meters', type: 'ghat' },
      { pointName: 'Trimbakeshwar Jyotirlinga Temple', distance: '400 meters', type: 'temple' },
      { pointName: 'Trimbak Bus Stand', distance: '600 meters', type: 'shuttle' },
    ],
    pricePerNight: 450,
    priceRange: 'budget',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['water', 'hotWater24h', 'pureVegFood'],
    occupantPreferences: ['bachelor', 'sadhus_pilgrims'],
    googlePlaceId: 'ChIJ_trimbak_seva_ashram_04',
    googleRating: 4.5,
    googleReviewCount: 156,
    googleReviews: [
      {
        author: 'Govind Swaroop',
        rating: 5,
        text: 'Extremely peaceful spiritual environment. Free hot drinking water and simple, nourishing satvik mahaprasad.',
        date: 'February 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 92,
    lastVerifiedAt: new Date('2026-08-18'),
    rules: ['Dorm silence after 9:30 PM', 'No smoking or tobacco allowed'],
    contactPhone: '+91 94222 33445',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_002' },
    isDemo: false,
    isActive: true,
  },
  {
    title: 'Godavari Comforts Homestay',
    description: 'A clean 2-bedroom homestay apartment in Gangapur Road, Nashik. Excellent for family groups traveling with cars, with secure private parking and full kitchen access for preparing personal baby/elderly food.',
    propertyType: 'homestay',
    address: 'Near Old Gangapur Naka, Gangapur Road',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'reference',
    latitude: 20.0125,
    longitude: 73.7742,
    location: {
      type: 'Point',
      coordinates: [73.7742, 20.0125],
    },
    distanceFromKumbh: '1.8 km from Ramkund Ghat',
    distancePoints: [
      { pointName: 'Ramkund Ghat', distance: '1.8 km (7 min drive / direct bus)', type: 'ghat' },
      { pointName: 'CBS Bus Terminal', distance: '1.5 km', type: 'shuttle' },
    ],
    pricePerNight: 1600,
    priceRange: 'mid_range',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'ac', 'water', 'hotWater24h', 'parking', 'attachedBathroom', 'pureVegFood'],
    occupantPreferences: ['family', 'children', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_nashik_godavari_comforts_08',
    googleRating: 4.7,
    googleReviewCount: 64,
    googleReviews: [
      {
        author: 'Meenakshi Deshmukh',
        rating: 5,
        text: 'The host was extremely supportive. We were able to cook khichdi for our small toddler.',
        date: 'February 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 96,
    lastVerifiedAt: new Date('2026-08-12'),
    rules: ['Family guests preferred', 'No loud music'],
    contactPhone: '+91 98230 44556',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_003' },
    isDemo: false,
    isActive: true,
  },
];

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin & Owner Users if not existing
    let adminUser = await User.findOne({ email: 'admin@kumbhstay.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'KumbhStay Trust Officer',
        email: 'admin@kumbhstay.com',
        phone: '+91 99999 00001',
        password: 'Admin@123456',
        role: 'admin',
        isVerified: true,
      });
      console.log('[Seeder] Default admin user created: admin@kumbhstay.com / Admin@123456');
    }

    // Explicit Demo Admin Account
    let demoAdmin = await User.findOne({ email: 'admin.demo@kumbhstay.com' });
    if (!demoAdmin) {
      demoAdmin = await User.create({
        name: 'Demo Admin Officer',
        email: 'admin.demo@kumbhstay.com',
        phone: '+91 99999 11111',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true,
      });
    }

    let ownerUser = await User.findOne({ email: 'owner@kumbhstay.com' });
    if (!ownerUser) {
      ownerUser = await User.create({
        name: 'Pandit Rajesh Trivedi',
        email: 'owner@kumbhstay.com',
        phone: '+91 98390 12345',
        password: 'Owner@123456',
        role: 'owner',
        isVerified: true,
      });
      console.log('[Seeder] Default owner user created: owner@kumbhstay.com / Owner@123456');
    }

    // Explicit Demo Owner Account
    let demoOwner = await User.findOne({ email: 'owner.demo@kumbhstay.com' });
    if (!demoOwner) {
      demoOwner = await User.create({
        name: 'Demo Ashram Host',
        email: 'owner.demo@kumbhstay.com',
        phone: '+91 98765 00002',
        password: 'Owner@123',
        role: 'owner',
        isVerified: true,
      });
    }

    // Explicit Demo Pilgrim Account
    let demoPilgrim = await User.findOne({ email: 'pilgrim.demo@kumbhstay.com' });
    if (!demoPilgrim) {
      demoPilgrim = await User.create({
        name: 'Demo Pilgrim Yatri',
        email: 'pilgrim.demo@kumbhstay.com',
        phone: '+91 98111 00003',
        password: 'Pilgrim@123',
        role: 'pilgrim',
        isVerified: true,
      });
    }

    // 2. Clean and reseed Properties with explicit locationScope & dataStatus
    await Property.deleteMany({});
    const props = sampleProperties.map((p) => ({
      ...p,
      owner: ownerUser._id,
    }));
    await Property.insertMany(props);
    console.log(`[Seeder] Successfully seeded ${props.length} properties with explicit geographic scopes (Prayagraj: 4, Nashik: 3)!`);

    // 3. Ensure a Pending Verification property exists in Prayagraj for immediate Admin inspection
    const pendingStay = await Property.create({
      owner: ownerUser._id,
      title: 'Mata Anandamayi Pilgrim Bhavan',
      description: 'Spacious accommodation near Sangam Sector 3. Clean family rooms with solar hot water geysers and pure vegetarian satvik bhojan kitchen.',
      propertyType: 'ashram',
      address: 'Plot 28, Sangam Marg, Sector 3, Daraganj',
      city: 'Prayagraj',
      state: 'Uttar Pradesh',
      country: 'India',
      locationScope: 'prayagraj',
      dataStatus: 'demo',
      googleMapsUrl: 'https://maps.google.com/?q=25.4320,81.8710',
      latitude: 25.4320,
      longitude: 81.8710,
      location: {
        type: 'Point',
        coordinates: [81.8710, 25.4320],
      },
      distanceFromKumbh: '450 m from Sangam Sector 3',
      distancePoints: [
        { pointName: 'Sangam Snan Ghat Sector 3', distance: '450 meters (6 min walk)', type: 'ghat' },
        { pointName: 'Shuttle Stop No 4', distance: '100 meters', type: 'shuttle' },
      ],
      pricePerNight: 950,
      priceRange: 'budget',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
      occupantPreferences: ['family', 'female', 'seniorCitizen', 'sadhus_pilgrims'],
      documents: [
        {
          docType: 'ownership_proof',
          title: 'Municipal Registry Deed',
          fileName: 'sangam_deed_plot28.pdf',
          fileUrl: 'https://kumbhstay.org/docs/demo_deed.pdf',
          status: 'pending',
        },
        {
          docType: 'electricity_bill',
          title: 'UPPCL Commercial Power Bill',
          fileName: 'uppcl_bill_nov2026.pdf',
          fileUrl: 'https://kumbhstay.org/docs/demo_bill.pdf',
          status: 'pending',
        },
      ],
      verificationStatus: 'pending',
      ownerVerified: false,
      propertyVerified: false,
      locationVerified: false,
      photoVerified: false,
      trustScore: 0,
      contactPhone: '+91 98390 12345',
      isActive: false,
    });
    console.log('[Seeder] Created pending audit property:', pendingStay.title);

    // 4. Ensure sample report exists for admin review queue
    await Report.deleteMany({});
    const sampleStay = await Property.findOne({ verificationStatus: 'verified', locationScope: 'prayagraj' });
    if (sampleStay) {
      await Report.create({
        property: sampleStay._id,
        reporterName: 'Aarav Sharma',
        reporterContact: '+91 98111 22334',
        reason: 'Incorrect amenities',
        details: 'Wi-Fi connection was intermittently down during morning peak hours.',
        status: 'pending',
      });
      console.log('[Seeder] Created sample listing report for admin inspection.');
    }

    // 5. Seed Medical & Health Assistance Facilities
    await MedicalPoint.deleteMany({});
    await MedicalPoint.insertMany(sampleMedicalPoints);
    console.log(`[Seeder] Successfully seeded ${sampleMedicalPoints.length} verified emergency & medical points!`);
  } catch (error) {
    console.error('[Seeder Error]', error.message);
  }
};
'''

with open(r'c:\Users\HP\Desktop\KHUMBCARE STAY AND HEALTH\server\utils\seedData.js', 'w', encoding='utf-8') as f:
    f.write(seed_content)

print("Successfully wrote updated seedData.js")
