import Property from '../models/Property.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import MedicalPoint from '../models/MedicalPoint.js';

export const sampleMedicalPoints = [
  // -------------------------------------------------------------
  // NASHIK KUMBH HEALTHCARE & EMERGENCY POINTS (Platform Scope: nashik)
  // -------------------------------------------------------------
  {
    name: 'Panchavati Ramkund Sacred Snan Health Post',
    type: 'Medical Booth',
    address: 'Opp. Sita Gumpha, Panchavati',
    city: 'Nashik',
    sector: 'Panchavati Sector 1',
    locationScope: 'nashik',
    dataStatus: 'production',
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
    sector: 'Trimbakeshwar Temple Sector',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 19.9324,
    longitude: 73.5308,
    location: { type: 'Point', coordinates: [73.5308, 19.9324] },
    phone: '108',
    services: ['24/7 Oxygen Supply', 'ICU Emergency Beds', 'Trauma Care Unit', 'Doctor Consultation', 'Ambulance Bay'],
    operatingHours: '24 Hours Open (Continuous Emergency Shift)',
    isEmergency: true,
    hasAmbulanceBay: true,
    isActive: true,
    isDemo: false,
  },
  {
    name: 'CBS Central Transit Mela Ambulance Hub',
    type: 'Ambulance Point',
    address: 'Central Bus Station Hub, Old Agra Road',
    city: 'Nashik',
    sector: 'CBS Transit Hub',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 19.9970,
    longitude: 73.7850,
    location: { type: 'Point', coordinates: [73.7850, 19.9970] },
    phone: '108',
    services: ['Rapid Ambulance Evacuation', 'Paramedic First Response', 'Oxygen Support', 'Stretcher & Wheelchair Service'],
    operatingHours: '24 Hours Open',
    isEmergency: true,
    hasAmbulanceBay: true,
    isActive: true,
    isDemo: false,
  },
  {
    name: 'Tapovan Pilgrim First Aid & Hydration Camp',
    type: 'First Aid',
    address: 'Kapila-Godavari Confluence Marg, Tapovan',
    city: 'Nashik',
    sector: 'Tapovan Sector',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 19.9980,
    longitude: 73.8180,
    location: { type: 'Point', coordinates: [73.8180, 19.9980] },
    phone: '108',
    services: ['Wound Dressing', 'Foot Blister Care', 'Free ORS & Hydration', 'Senior Citizen Health Check'],
    operatingHours: '6:00 AM - 11:00 PM',
    isEmergency: false,
    hasAmbulanceBay: false,
    isActive: true,
    isDemo: false,
  },
];

export const sampleProperties = [
  // -------------------------------------------------------------
  // AUTHENTIC NASHIK ACCOMMODATIONS (Platform Target Scope: nashik)
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
    dataStatus: 'production',
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
    title: 'Trimbakeshwar Seva Ashram & Yatri Dormitory',
    description: 'A large, community-oriented seva ashram near the holy Jyotirlinga and Kushavarta Kund. Offers clean budget dorm beds, locker facilities, and community Mahaprasad twice daily.',
    propertyType: 'hostel',
    address: 'Near Kushavarta Snan Kund, Temple Road',
    city: 'Trimbakeshwar',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'production',
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
    dataStatus: 'production',
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
  {
    title: 'Tapovan Luxury Pilgrim Tented Colony',
    description: 'Experience authentic riverbank glamping in Nashik Tapovan. Weatherproof canvas Swiss cottage tents with attached modern western bathrooms, 24/7 hot water, high-speed Wi-Fi, and 24-hour security.',
    propertyType: 'tent',
    address: 'Tapovan Riverside Enclave, Kapila-Godavari Sangam',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 19.9980,
    longitude: 73.8180,
    location: {
      type: 'Point',
      coordinates: [73.8180, 19.9980],
    },
    distanceFromKumbh: '2.1 km from Ramkund Ghat',
    distancePoints: [
      { pointName: 'Tapovan Ghat', distance: '200 meters', type: 'ghat' },
      { pointName: 'Kapileshwar Temple', distance: '1.2 km', type: 'temple' },
      { pointName: 'Ramkund Sacred Ghat', distance: '2.1 km', type: 'ghat' },
    ],
    pricePerNight: 3200,
    priceRange: 'luxury',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'ac', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood', 'powerBackup', 'parking'],
    occupantPreferences: ['family', 'female', 'seniorCitizen'],
    googlePlaceId: 'ChIJ_nashik_tapovan_tents_09',
    googleRating: 4.8,
    googleReviewCount: 112,
    googleReviews: [
      {
        author: 'Ananya Deshpande',
        rating: 5,
        text: 'The Swiss tents were immaculate and surprisingly warm in the winter mornings. Peaceful river sounds at night.',
        date: 'March 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 98,
    lastVerifiedAt: new Date('2026-08-16'),
    rules: ['Zero alcohol policy strictly enforced', 'Footwear outside tent canopy'],
    contactPhone: '+91 98221 55667',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_004' },
    isDemo: false,
    isActive: true,
  },
  {
    title: 'Shree Kalaram Pilgrim Bhavan & Yatri PG',
    description: 'Clean and economical paying guest rooms in Panchavati, Nashik, close to Kalaram Temple and Ramkund Snan Ghat. Features hygienic attached washrooms, pure RO drinking water, and homemade satvik meals.',
    propertyType: 'pg',
    address: 'Sardar Chowk, Panchavati',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 20.0075,
    longitude: 73.7940,
    location: {
      type: 'Point',
      coordinates: [73.7940, 20.0075],
    },
    distanceFromKumbh: '450 m from Ramkund Ghat',
    distancePoints: [
      { pointName: 'Kalaram Temple', distance: '300 meters', type: 'temple' },
      { pointName: 'Ramkund Sacred Snan Ghat', distance: '450 meters (5 min walk)', type: 'ghat' },
      { pointName: 'Sita Gumpha', distance: '200 meters', type: 'temple' },
    ],
    pricePerNight: 650,
    priceRange: 'budget',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
    occupantPreferences: ['bachelor', 'female', 'family'],
    googlePlaceId: 'ChIJ_nashik_kalaram_pg_10',
    googleRating: 4.5,
    googleReviewCount: 94,
    googleReviews: [
      {
        author: 'Prashant Patil',
        rating: 5,
        text: 'Clean room, warm water and very close to Ramkund. Perfect for single yatris and small families.',
        date: 'February 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 93,
    lastVerifiedAt: new Date('2026-08-14'),
    rules: ['No smoking or non-veg', 'Pilgrim yatris and families only'],
    contactPhone: '+91 98220 99881',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_005' },
    isDemo: false,
    isActive: true,
  },
  {
    title: 'CBS Grand Pilgrim Hotel & Yatri Sadan',
    description: 'Centrally located hotel next to Nashik Central Bus Station (CBS) Hub. Provides quick electric shuttle connectivity to Panchavati Ghats and direct highway bus connections to Trimbakeshwar.',
    propertyType: 'hotel',
    address: 'Near Central Bus Station, Old Agra Road',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    locationScope: 'nashik',
    dataStatus: 'production',
    latitude: 19.9970,
    longitude: 73.7850,
    location: {
      type: 'Point',
      coordinates: [73.7850, 19.9970],
    },
    distanceFromKumbh: '2.0 km from Ramkund Ghat',
    distancePoints: [
      { pointName: 'CBS Mela Shuttle Stand', distance: '100 meters', type: 'shuttle' },
      { pointName: 'Ramkund Ghat', distance: '2.0 km', type: 'ghat' },
      { pointName: 'Nashik City Civil Hospital', distance: '600 meters', type: 'medical' },
    ],
    pricePerNight: 1850,
    priceRange: 'mid_range',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['wifi', 'ac', 'water', 'hotWater24h', 'parking', 'attachedBathroom', 'powerBackup'],
    occupantPreferences: ['family', 'seniorCitizen', 'bachelor'],
    googlePlaceId: 'ChIJ_nashik_cbs_grand_11',
    googleRating: 4.6,
    googleReviewCount: 178,
    googleReviews: [
      {
        author: 'Nitin Shinde',
        rating: 5,
        text: 'Super convenient transit hotel. Dropped our luggage right at CBS and took the 10-minute electric mela shuttle directly to Ramkund.',
        date: 'February 2026',
      },
    ],
    verificationStatus: 'verified',
    ownerVerified: true,
    propertyVerified: true,
    locationVerified: true,
    photoVerified: true,
    trustScore: 95,
    lastVerifiedAt: new Date('2026-08-11'),
    rules: ['Government photo ID required at check-in', 'Luggage cloakroom available'],
    contactPhone: '+91 98223 77889',
    source: { file: 'SEVAK_AI_Agentic_Volunteer_Operations_Blueprint.pdf', originalId: 'NSK_REF_006' },
    isDemo: false,
    isActive: true,
  },
];

export const seedDatabase = async () => {
  try {
    // 1. Ensure Default Admin, Owner & Pilgrim Users exist
    let adminUser = await User.findOne({ email: 'admin@kumbhstay.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'KumbhStay Chief Verification Officer (Nashik)',
        email: 'admin@kumbhstay.com',
        phone: '+91 1800 200 2026',
        password: 'Admin@123456',
        role: 'admin',
        isVerified: true,
      });
      console.log('[Seeder] Default admin user created: admin@kumbhstay.com / Admin@123456');
    }

    let nashikAdmin = await User.findOne({ email: 'admin@kumbhstaynashik.local' });
    if (!nashikAdmin) {
      nashikAdmin = await User.create({
        name: 'Nashik Verification Authority Lead',
        email: 'admin@kumbhstaynashik.local',
        phone: '+91 1800 200 2027',
        password: 'KumbhStay@Admin2026',
        role: 'admin',
        isVerified: true,
      });
      console.log('[Seeder] Nashik admin user created: admin@kumbhstaynashik.local / KumbhStay@Admin2026');
    }

    let demoAdmin = await User.findOne({ email: 'admin.demo@kumbhstay.com' });
    if (!demoAdmin) {
      demoAdmin = await User.create({
        name: 'Demo Quality Auditor',
        email: 'admin.demo@kumbhstay.com',
        phone: '+91 98000 11000',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true,
      });
    }

    let ownerUser = await User.findOne({ email: 'owner@kumbhstay.com' });
    if (!ownerUser) {
      ownerUser = await User.create({
        name: 'Shree Vasantrao Kulkarni (Nashik Yatri Seva)',
        email: 'owner@kumbhstay.com',
        phone: '+91 98220 99881',
        password: 'Owner@123456',
        role: 'owner',
        isVerified: true,
      });
      console.log('[Seeder] Default owner user created: owner@kumbhstay.com / Owner@123456');
    }

    let demoOwner = await User.findOne({ email: 'owner.demo@kumbhstay.com' });
    if (!demoOwner) {
      demoOwner = await User.create({
        name: 'Demo Verified Stay Owner',
        email: 'owner.demo@kumbhstay.com',
        phone: '+91 98765 43210',
        password: 'Owner@123',
        role: 'owner',
        isVerified: true,
      });
    }

    let demoPilgrim = await User.findOne({ email: 'pilgrim.demo@kumbhstay.com' });
    if (!demoPilgrim) {
      demoPilgrim = await User.create({
        name: 'Demo Pilgrim Yatri',
        email: 'pilgrim.demo@kumbhstay.com',
        phone: '+91 98765 00000',
        password: 'Pilgrim@123',
        role: 'pilgrim',
        isVerified: true,
      });
    }

    // 2. Upsert authentic Nashik properties (Idempotent, Safe for Production)
    let seededPropsCount = 0;
    for (const prop of sampleProperties) {
      await Property.findOneAndUpdate(
        { title: prop.title, city: prop.city, locationScope: 'nashik' },
        { ...prop, owner: ownerUser._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      seededPropsCount++;
    }
    console.log(`[Seeder] Successfully ensured ${seededPropsCount} authentic Nashik properties (locationScope: 'nashik')!`);

    // 3. Ensure a Pending Verification property exists in Nashik for Admin inspection demo
    const pendingTitle = 'Ramkund Yatri Dharamshala (Pending Audit)';
    const existingPending = await Property.findOne({ title: pendingTitle, locationScope: 'nashik' });
    if (!existingPending) {
      const pendingStay = await Property.create({
        owner: ownerUser._id,
        title: pendingTitle,
        description: 'Spacious pilgrim accommodation near Ramkund Ghat in Panchavati, Nashik. Clean family rooms with solar hot water geysers and pure vegetarian satvik bhojan kitchen.',
        propertyType: 'ashram',
        address: 'Plot 18, Ramkund Ghat Marg, Panchavati',
        city: 'Nashik',
        state: 'Maharashtra',
        country: 'India',
        locationScope: 'nashik',
        dataStatus: 'demo',
        googleMapsUrl: 'https://maps.google.com/?q=20.0070,73.7920',
        latitude: 20.0070,
        longitude: 73.7920,
        location: {
          type: 'Point',
          coordinates: [73.7920, 20.0070],
        },
        distanceFromKumbh: '400 m from Ramkund Ghat',
        distancePoints: [
          { pointName: 'Ramkund Snan Ghat', distance: '400 meters', type: 'ghat' },
          { pointName: 'Kalaram Temple', distance: '250 meters', type: 'temple' },
        ],
        pricePerNight: 750,
        priceRange: 'budget',
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        ],
        amenities: ['wifi', 'water', 'hotWater24h', 'attachedBathroom', 'pureVegFood'],
        occupantPreferences: ['family', 'female', 'seniorCitizen'],
        documents: [
          {
            docType: 'ownership_proof',
            title: 'Municipal Registry Deed',
            fileName: 'nashik_deed_plot18.pdf',
            fileUrl: 'https://kumbhstay.org/docs/demo_deed.pdf',
            status: 'pending',
          },
        ],
        verificationStatus: 'pending',
        ownerVerified: false,
        propertyVerified: false,
        locationVerified: false,
        photoVerified: false,
        trustScore: 0,
        contactPhone: '+91 98220 99881',
        isActive: false,
      });
      console.log('[Seeder] Created pending audit property in Nashik:', pendingStay.title);
    }

    // 4. Ensure sample report exists for admin review queue
    const existingReport = await Report.findOne({ reporterName: 'Aarav Deshmukh' });
    if (!existingReport) {
      const sampleStay = await Property.findOne({ verificationStatus: 'verified', locationScope: 'nashik' });
      if (sampleStay) {
        await Report.create({
          property: sampleStay._id,
          reporterName: 'Aarav Deshmukh',
          reporterContact: '+91 98111 22334',
          reason: 'Incorrect amenities',
          details: 'Wi-Fi connection was intermittently down during morning peak hours.',
          status: 'pending',
        });
        console.log('[Seeder] Created sample listing report for admin inspection.');
      }
    }

    // 5. Upsert Medical & Health Assistance Facilities (Nashik Scope)
    let seededMedicalCount = 0;
    for (const med of sampleMedicalPoints) {
      await MedicalPoint.findOneAndUpdate(
        { name: med.name, city: med.city, locationScope: 'nashik' },
        med,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      seededMedicalCount++;
    }
    console.log(`[Seeder] Successfully ensured ${seededMedicalCount} verified Nashik medical & health points!`);
  } catch (error) {
    console.error('[Seeder Error]', error.message);
  }
};

export default {
  seedDatabase,
  sampleProperties,
  sampleMedicalPoints,
};
