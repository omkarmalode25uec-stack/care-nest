import Property from '../models/Property.js';

/**
 * Knowledge Base for Website Help & Nashik Kumbh Information
 */
const KNOWLEDGE_BASE = {
  // Category A: Website Help & FAQs
  howToBook: {
    patterns: [/how (do|can) (i|we) book/i, /how (to|does) (request )?booking (work|happen)/i, /booking (process|steps|help)/i, /how booking works/i],
    reply: `To book a stay on Care Nest:
1. **Explore Stays**: Browse verified Nashik & Trimbakeshwar accommodations on the Find Stays page (List or Map view).
2. **Select a Stay**: Click "View Details" on any property you like.
3. **Request Booking**: Choose your check-in / check-out dates, number of pilgrims, and guest contact.
4. **Instant Test Payment**: Complete the secure Razorpay payment to confirm your booking reference and view booking confirmation.`,
  },
  howToContact: {
    patterns: [/how (do|can) (i|we) contact/i, /contact (the )?(property|owner|host)/i, /phone number|whatsapp/i],
    reply: `You can contact the verified host directly:
- Open the property's details page.
- In the right-hand booking/contact card, click the **"Chat on WhatsApp"** or **"Call Host"** button to speak with the verified owner directly about specific arrival needs.`,
  },
  ownerVerified: {
    patterns: [/owner verif/i, /host verif/i, /what (is|does) owner verified/i],
    reply: `**Owner Verified** means our on-ground audit team has physically verified the host's government identity (Aadhaar / Passport / Trade License) and confirmed they are authorized to host pilgrims at that property address in Nashik/Maharashtra.`,
  },
  propertyVerified: {
    patterns: [/property verif/i, /stay verif/i, /what (is|does) property verified/i],
    reply: `**Property Verified** means our team conducted an in-person physical premises inspection in Nashik to verify room cleanliness, potable water, functioning bathrooms, power backup, and authentic tariff pricing.`,
  },
  locationVerified: {
    patterns: [/location verif/i, /gps verif/i, /what (is|does) location verified/i],
    reply: `**Location Verified** means the stay's GPS coordinates have been audited on-ground with exact walking and transit distances to holy Snan Ghats (such as Ramkund Ghat, Kushavarta Kund) and emergency medical posts in Nashik.`,
  },
  trustScore: {
    patterns: [/trust score/i, /trust audit/i, /what (is|does) trust score/i, /how is trust score/i],
    reply: `The **Trust Score (0–100)** is an explainable composite index built on 5 pillars:
1. Owner Identity Verification (25 pts)
2. Physical Property Audit (25 pts)
3. GPS Location Accuracy (20 pts)
4. Tariff Transparency & Zero Hidden Charges (15 pts)
5. Real Pilgrim Reviews & Safety Compliance (15 pts)`,
  },
  paymentSafety: {
    patterns: [/payment safe/i, /payment methods?/i, /razorpay/i, /how (to|do i) pay/i, /is payment/i],
    reply: `Care Nest uses **Razorpay Test Mode** for secure, cryptographic payment verification. We do not store credit/debit card numbers or UPI PINs on our servers. Your booking status updates in real time upon signature verification.`,
  },

  // Category D: Pilgrimage & Cultural Information
  whatIsKumbh: {
    patterns: [/what is (the )?(nashik )?kumbh( mela)?/i, /about kumbh/i, /significance of kumbh/i, /what is kumbh/i],
    reply: `**Nashik Trimbakeshwar Kumbh Mela** (Simhastha Kumbh) is celebrated every 12 years along the sacred banks of the holy **Godavari River** at Ramkund in Nashik and at Kushavarta Kund in Trimbakeshwar, Maharashtra, where millions of sadhus and pilgrims take the holy Shahi Snan.`,
  },
  whatIsRamkund: {
    patterns: [/what is (ramkund|ram kund)/i, /where is ramkund/i, /about ramkund/i],
    reply: `**Ramkund** is the most sacred bathing ghat on the holy Godavari River in Panchavati, Nashik. It is the central venue for the Kumbh Mela Shahi Snan dips and where Lord Rama is believed to have bathed during his exile.`,
  },
  whatIsTrimbakeshwar: {
    patterns: [/what is trimbakeshwar/i, /about trimbakeshwar/i, /kushavarta/i],
    reply: `**Trimbakeshwar** (30 km from Nashik city) is home to one of the 12 sacred Jyotirlingas of Lord Shiva and **Kushavarta Kund**, the revered originating reservoir of the Godavari River where Akhada sadhus take the holy Kumbh Shahi Snan.`,
  },
  importantPlaces: {
    patterns: [/important places( to visit)?/i, /what to visit/i, /sightseeing/i, /places in nashik/i, /explore nashik/i],
    reply: `Key spiritual landmarks in Nashik & Trimbakeshwar:
1. **Ramkund & Godavari Ghats**: Sacred epicenter of Shahi Snan in Panchavati.
2. **Shree Kalaram Mandir**: Majestic 18th-century black-stone temple in Panchavati.
3. **Sita Gumpha (Caves)**: Ancient holy caves from the Ramayana era.
4. **Trimbakeshwar Jyotirlinga & Kushavarta Kund**: Sacred Jyotirlinga and holy water reservoir.
5. **Tapovan**: Serene forested river confluence where Sage Lakshman did penance.
6. **Kapileshwar Temple & Sundarnarayan Temple**: Historic sacred riverside shrines.`,
  },
  mapHelp: {
    patterns: [/how (to|can i) use the map/i, /map help/i, /openstreetmap/i, /how map works/i],
    reply: `You can use the interactive **OpenStreetMap** on Care Nest:
- On the **Find Stays** page, click the **"Map View"** toggle button to see all verified stay price pins across Nashik and Trimbakeshwar.
- On any **Property Details** page, scroll to the interactive map to inspect exact GPS coordinates, nearby Snan Ghats (Ramkund, Kushavarta), 24/7 First-Aid medical posts, and shuttle stops.`,
  },
  medicalEmergency: {
    patterns: [/medical (help|emergency|booth|post)/i, /doctor|hospital|first aid/i, /emergency contact/i],
    reply: `For medical assistance during Nashik Kumbh:
- Visit our **Emergency & Medical** page in the navigation bar for 24/7 helpline numbers (108 Ambulance, 112 Police).
- Every verified property page shows distance to the nearest on-ground Kumbh First-Aid post, hospital, and ambulance station in Panchavati or Trimbakeshwar.`,
  },
};

/**
 * Helper to properly pluralize occupant preferences
 */
const formatOccupantPreference = (pref) => {
  switch (pref) {
    case 'family':
      return 'families';
    case 'seniorCitizen':
      return 'senior citizens';
    case 'bachelor':
      return 'bachelors / solo yatris';
    case 'female':
      return 'female yatris';
    case 'sadhus_pilgrims':
      return 'sadhus & pilgrims';
    default:
      return `${pref}s`;
  }
};

/**
 * Natural Language Query Parser for Nashik Stays
 */
export const parseStaySearchFilters = (text = '') => {
  const query = text.toLowerCase().trim();

  const mongoFilter = {
    locationScope: 'nashik',
    dataStatus: { $in: ['production', 'demo', 'reference'] },
    isActive: true,
  };

  const extracted = {
    isStaySearch: false,
    propertyType: null,
    maxPrice: null,
    isAffordable: false,
    occupantPreference: null,
    amenities: [],
    landmark: null,
  };

  // 1. Check budget / price constraints
  const budgetMatch = query.match(/(?:under|below|less than|max|budget|within|upto|up to|₹|rs\.?)\s*(\d{3,5})/i) 
    || query.match(/(\d{3,5})\s*(?:rs|rupees|inr|\/-)/i);

  if (budgetMatch && budgetMatch[1]) {
    const budget = parseInt(budgetMatch[1], 10);
    if (!isNaN(budget) && budget > 0) {
      mongoFilter.pricePerNight = { $lte: budget };
      extracted.maxPrice = budget;
      extracted.isStaySearch = true;
    }
  }

  if (query.includes('affordable') || query.includes('budget') || query.includes('cheap') || query.includes('low cost') || query.includes('economical')) {
    extracted.isAffordable = true;
    extracted.isStaySearch = true;
    if (!extracted.maxPrice) {
      mongoFilter.pricePerNight = { $lte: 2000 };
    }
  }

  // 2. Check property type
  if (query.includes('hotel')) {
    mongoFilter.propertyType = 'hotel';
    extracted.propertyType = 'hotel';
    extracted.isStaySearch = true;
  } else if (query.includes('hostel') || query.includes('dorm')) {
    mongoFilter.propertyType = 'hostel';
    extracted.propertyType = 'hostel';
    extracted.isStaySearch = true;
  } else if (query.includes('homestay') || query.includes('home stay')) {
    mongoFilter.propertyType = 'homestay';
    extracted.propertyType = 'homestay';
    extracted.isStaySearch = true;
  } else if (query.includes('pg') || query.includes('paying guest')) {
    mongoFilter.propertyType = 'pg';
    extracted.propertyType = 'pg';
    extracted.isStaySearch = true;
  } else if (query.includes('ashram') || query.includes('dharamshala') || query.includes('math')) {
    mongoFilter.propertyType = 'ashram';
    extracted.propertyType = 'ashram';
    extracted.isStaySearch = true;
  } else if (query.includes('tent') || query.includes('camp') || query.includes('cottage')) {
    mongoFilter.propertyType = 'tent';
    extracted.propertyType = 'tent';
    extracted.isStaySearch = true;
  }

  // 3. Check occupant preferences
  if (query.includes('family') || query.includes('families') || query.includes('parivar') || query.includes('family-friendly')) {
    mongoFilter.occupantPreferences = 'family';
    extracted.occupantPreference = 'family';
    extracted.isStaySearch = true;
  } else if (query.includes('female') || query.includes('women') || query.includes('ladies') || query.includes('mahila')) {
    mongoFilter.occupantPreferences = 'female';
    extracted.occupantPreference = 'female';
    extracted.isStaySearch = true;
  } else if (query.includes('senior') || query.includes('elderly') || query.includes('vridh') || query.includes('parents')) {
    mongoFilter.occupantPreferences = 'seniorCitizen';
    extracted.occupantPreference = 'seniorCitizen';
    extracted.isStaySearch = true;
  } else if (query.includes('bachelor') || query.includes('solo') || query.includes('single')) {
    mongoFilter.occupantPreferences = 'bachelor';
    extracted.occupantPreference = 'bachelor';
    extracted.isStaySearch = true;
  } else if (query.includes('sadhu') || query.includes('kalpvasi') || query.includes('pilgrim')) {
    mongoFilter.occupantPreferences = 'sadhus_pilgrims';
    extracted.occupantPreference = 'sadhus_pilgrims';
    extracted.isStaySearch = true;
  }

  // 4. Check amenities
  const requestedAmenities = [];
  if (query.includes('wifi') || query.includes('wi-fi') || query.includes('internet')) {
    requestedAmenities.push('wifi');
    extracted.isStaySearch = true;
  }
  if (query.includes('ac') || query.includes('air condition') || query.includes('air-condition')) {
    requestedAmenities.push('ac');
    extracted.isStaySearch = true;
  }
  if (query.includes('hot water') || query.includes('geyser') || query.includes('garm pani') || query.includes('24-hour hot water')) {
    requestedAmenities.push('hotWater24h');
    extracted.isStaySearch = true;
  }
  if (query.includes('pure veg') || query.includes('sattvic') || query.includes('shuddh') || query.includes('veg food')) {
    requestedAmenities.push('pureVegFood');
    extracted.isStaySearch = true;
  }
  if (query.includes('parking') || query.includes('car park') || query.includes('vehicle')) {
    requestedAmenities.push('parking');
    extracted.isStaySearch = true;
  }
  if (query.includes('attached') || query.includes('private bath') || query.includes('bathroom')) {
    requestedAmenities.push('attachedBathroom');
    extracted.isStaySearch = true;
  }

  if (requestedAmenities.length > 0) {
    mongoFilter.amenities = { $all: requestedAmenities };
    extracted.amenities = requestedAmenities;
  }

  // 5. Check area / landmark keywords in Nashik
  if (query.includes('ramkund') || query.includes('ram kund') || query.includes('godavari')) {
    extracted.landmark = 'Ramkund Ghat';
    extracted.isStaySearch = true;
  } else if (query.includes('panchavati') || query.includes('sita gumpha') || query.includes('kalaram')) {
    extracted.landmark = 'Panchavati';
    extracted.isStaySearch = true;
  } else if (query.includes('trimbak') || query.includes('kushavarta')) {
    extracted.landmark = 'Trimbakeshwar';
    extracted.isStaySearch = true;
  } else if (query.includes('tapovan')) {
    extracted.landmark = 'Tapovan';
    extracted.isStaySearch = true;
  } else if (query.includes('gangapur')) {
    extracted.landmark = 'Gangapur Road';
    extracted.isStaySearch = true;
  } else if (query.includes('cbs')) {
    extracted.landmark = 'CBS Bus Stand';
    extracted.isStaySearch = true;
  }

  // Direct stay request intent check
  if (
    query.includes('stay') ||
    query.includes('room') ||
    query.includes('hotel') ||
    query.includes('hostel') ||
    query.includes('tent') ||
    query.includes('accommodation') ||
    query.includes('place to stay') ||
    query.includes('where to stay') ||
    query.includes('find stay') ||
    query.includes('show me') ||
    query.includes('list of stays') ||
    query.includes('nashik')
  ) {
    extracted.isStaySearch = true;
  }

  return { mongoFilter, extracted };
};

/**
 * Handle Property-Specific Questions (Category C - Nashik)
 */
const handlePropertySpecificContext = async (propertyId, queryText) => {
  try {
    const prop = await Property.findOne({
      _id: propertyId,
      locationScope: 'nashik',
      isActive: true,
    }).populate('owner', 'name phone');

    if (!prop) return null;

    const q = queryText.toLowerCase();

    // 1. Wi-Fi
    if (q.includes('wifi') || q.includes('wi-fi') || q.includes('internet')) {
      const hasWifi = prop.amenities?.includes('wifi');
      return hasWifi
        ? `Yes, **${prop.title}** provides complimentary Wi-Fi for pilgrims.`
        : `No, Wi-Fi is not listed among the facilities for **${prop.title}**.`;
    }

    // 2. AC
    if (q.includes('ac') || q.includes('air condition')) {
      const hasAc = prop.amenities?.includes('ac');
      return hasAc
        ? `Yes, **${prop.title}** provides Air Conditioning (AC).`
        : `No, AC is not available at **${prop.title}**.`;
    }

    // 3. Hot water
    if (q.includes('hot water') || q.includes('geyser')) {
      const hasHotWater = prop.amenities?.includes('hotWater24h') || prop.amenities?.includes('hotWater');
      return hasHotWater
        ? `Yes, **${prop.title}** provides 24-hour hot water / geyser facilities.`
        : `Hot water is not explicitly listed for this property.`;
    }

    // 4. Pure Veg / Sattvic Food
    if (q.includes('food') || q.includes('veg') || q.includes('sattvic') || q.includes('meal')) {
      const hasFood = prop.amenities?.includes('pureVegFood');
      return hasFood
        ? `Yes, **${prop.title}** offers Sattvic / Pure Vegetarian food options for pilgrims.`
        : `Pure veg food service is not listed as an included amenity for this property.`;
    }

    // 5. Price / Tariff
    if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('tariff') || q.includes('rate')) {
      return `The verified tariff for **${prop.title}** is **₹${prop.pricePerNight?.toLocaleString('en-IN')} per night** (taxes included, zero hidden charges).`;
    }

    // 6. Suitability / Family
    if (q.includes('family') || q.includes('suitable') || q.includes('who can stay') || q.includes('senior')) {
      const prefs = prop.occupantPreferences || [];
      if (prefs.length > 0) {
        const formatted = prefs.map((p) => (p === 'sadhus_pilgrims' ? 'Sadhus/Pilgrims' : p === 'seniorCitizen' ? 'Senior Citizens' : p)).join(', ');
        return `**${prop.title}** is marked suitable for: **${formatted}**.`;
      }
      return `Suitability details are not specified for this stay.`;
    }

    // 7. Distance / Location / Ramkund / Ghat
    if (q.includes('distance') || q.includes('far') || q.includes('location') || q.includes('ghat') || q.includes('ramkund') || q.includes('address')) {
      const distInfo = prop.distanceFromKumbh || 'Short distance to Ramkund Snan Ghat';
      return `**${prop.title}** is located at **${prop.address}, ${prop.city}** (${distInfo}).`;
    }

    // 8. Contact / Phone
    if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('owner') || q.includes('host') || q.includes('whatsapp')) {
      const ownerName = prop.owner?.name || 'Verified Property Host';
      const ownerPhone = prop.owner?.phone || prop.contactPhone || 'Available upon booking';
      return `You can contact the verified host **${ownerName}** at **${ownerPhone}** or use the "Chat on WhatsApp" button on the property page.`;
    }

    return null;
  } catch (error) {
    console.error('[Property Context Error]', error);
    return null;
  }
};

/**
 * @desc    Chat endpoint for AI Assistant (Nashik Only)
 * @route   POST /api/assistant/chat
 * @access  Public
 */
export const chatAssistant = async (req, res) => {
  try {
    const { message = '', currentPropertyId = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please send a question or search request for Nashik stays.",
      });
    }

    const cleanMsg = message.trim();

    // ----------------------------------------------------
    // 1. EXPLICIT PRAYAGRAJ / NON-NASHIK REQUEST CHECK
    // ----------------------------------------------------
    const prayagrajPatterns = [/prayagraj/i, /allahabad/i, /triveni/i, /sangam/i, /uttar pradesh/i];
    if (prayagrajPatterns.some((pattern) => pattern.test(cleanMsg)) && !cleanMsg.match(/what is kumbh/i)) {
      return res.status(200).json({
        success: true,
        reply: `Please note that **Care Nest currently supports Nashik stays only** (Nashik & Trimbakeshwar, Maharashtra). We do not list or book accommodations in Prayagraj. You can search verified stays across Panchavati, Ramkund, Gangapur Road, and Trimbakeshwar!`,
        properties: [],
        type: 'scope_notice',
      });
    }

    // ----------------------------------------------------
    // 2. PROPERTY-SPECIFIC CONTEXT (If on /stays/:id)
    // ----------------------------------------------------
    if (currentPropertyId) {
      const propertyAnswer = await handlePropertySpecificContext(currentPropertyId, cleanMsg);
      if (propertyAnswer) {
        return res.status(200).json({
          success: true,
          reply: propertyAnswer,
          properties: [],
          type: 'property_context',
        });
      }
    }

    // ----------------------------------------------------
    // 3. WEBSITE HELP & KNOWLEDGE BASE FAQS
    // ----------------------------------------------------
    for (const [key, item] of Object.entries(KNOWLEDGE_BASE)) {
      if (item && item.patterns && item.patterns.some((pattern) => pattern.test(cleanMsg))) {
        return res.status(200).json({
          success: true,
          reply: item.reply,
          properties: [],
          type: 'knowledge_base',
        });
      }
    }

    // ----------------------------------------------------
    // 4. STAY SEARCH & DATABASE QUERY (NASHIK ONLY)
    // ----------------------------------------------------
    const { mongoFilter, extracted } = parseStaySearchFilters(cleanMsg);

    if (extracted.isStaySearch) {
      let properties = await Property.find(mongoFilter)
        .populate('owner', 'name phone')
        .sort(extracted.isAffordable ? { pricePerNight: 1, trustScore: -1 } : { trustScore: -1, pricePerNight: 1 })
        .limit(4);

      // Relax amenity/strict filters if 0 results found while strictly preserving locationScope: 'nashik'
      if (properties.length === 0 && mongoFilter.amenities) {
        delete mongoFilter.amenities;
        properties = await Property.find(mongoFilter)
          .populate('owner', 'name phone')
          .sort({ trustScore: -1, pricePerNight: 1 })
          .limit(4);
      }

      if (properties.length === 0 && mongoFilter.occupantPreferences) {
        delete mongoFilter.occupantPreferences;
        properties = await Property.find(mongoFilter)
          .populate('owner', 'name phone')
          .sort({ trustScore: -1, pricePerNight: 1 })
          .limit(4);
      }

      let reply = '';
      if (properties.length > 0) {
        const criteriaParts = [];
        if (extracted.propertyType) criteriaParts.push(`${extracted.propertyType}s`);
        if (extracted.maxPrice) criteriaParts.push(`under ₹${extracted.maxPrice}`);
        else if (extracted.isAffordable) criteriaParts.push(`affordable pricing`);
        if (extracted.occupantPreference) criteriaParts.push(`for ${formatOccupantPreference(extracted.occupantPreference)}`);
        if (extracted.landmark) criteriaParts.push(`near ${extracted.landmark}`);
        if (extracted.amenities.length > 0) criteriaParts.push(`with ${extracted.amenities.join(', ')}`);

        const criteriaStr = criteriaParts.length > 0 ? criteriaParts.join(', ') : 'your preferences';
        reply = `I found **${properties.length} verified Nashik accommodation${properties.length > 1 ? 's' : ''}** matching ${criteriaStr}. You can click "View Details" on any card below to see verified photos and book directly:`;
      } else {
        reply = `No matching verified stays were found for "${cleanMsg}" in Nashik right now. You can explore all available listings directly on the **Find Stays** page or try adjusting your filters.`;
      }

      return res.status(200).json({
        success: true,
        reply,
        properties,
        extracted,
        type: 'stay_search',
      });
    }

    // ----------------------------------------------------
    // 5. GENERAL / OPEN QUESTION FALLBACK
    // ----------------------------------------------------
    const fallbackReply = `I am **KumbhVaani — Care Nest's multilingual pilgrim assistant (Nashik)**. I can help you with:
- 🔍 **Finding Stays in Nashik**: e.g., *"Affordable family stay near Ramkund with hot water"*
- 🏨 **Property Inquiries**: Ask about Wi-Fi, pricing, food, or distance to Kushavarta / Ramkund Ghat
- 📋 **Website Help**: e.g., *"How do I book a stay?"* or *"What does Owner Verified mean?"*
- 🕉️ **Nashik Kumbh Info**: e.g., *"What is Ramkund?"* or *"Important places to visit in Nashik"*

How can I assist your sacred pilgrimage to Nashik today?`;

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      properties: [],
      type: 'general',
    });

  } catch (error) {
    console.error('[Assistant Controller Error]', error);
    res.status(500).json({
      success: false,
      reply: "I'm sorry, I couldn't process that right now. You can explore verified Nashik stays directly from the Find Stays page.",
      properties: [],
      error: error.message,
    });
  }
};

/**
 * @desc    Legacy Search endpoint for backwards compatibility
 * @route   POST /api/assistant/search
 * @access  Public
 */
export const searchAssistant = async (req, res) => {
  try {
    const { query = '' } = req.body;
    req.body.message = query;
    return chatAssistant(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search Nashik stays.',
      error: error.message,
    });
  }
};

export default {
  chatAssistant,
  searchAssistant,
  parseStaySearchFilters,
};
