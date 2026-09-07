import Property from '../models/Property.js';
import { sampleProperties } from '../utils/seedData.js';
import googlePlacesService from '../services/googlePlacesService.js';
import locationService, { getNearestLandmarks, calculateDistanceKm, formatDistance } from '../services/locationService.js';

export const escapeRegex = (value = '') => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to parse latitude/longitude from google maps URL if provided
const parseGoogleMapsUrl = (url) => {
  if (!url) return null;
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
    };
  }
  const qMatch = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return {
      latitude: parseFloat(qMatch[1]),
      longitude: parseFloat(qMatch[2]),
    };
  }
  return null;
};

// @desc    Get all properties with filtering, searching, and sorting
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      propertyType,
      minPrice,
      maxPrice,
      amenities,
      occupantPreference,
      occupantPreferences,
      sort,
      city,
      location,
      search,
      status,
      verified,
      ownerVerified,
      locationVerified,
      dataStatus,
    } = req.query;

    const query = { 
      isActive: true,
      locationScope: 'nashik', // Mandatory Nashik platform scope
    };

    if (dataStatus) {
      query.dataStatus = dataStatus.toLowerCase().trim();
    } else {
      query.dataStatus = { $in: ['production', 'demo', 'reference'] };
    }

    // Status filter: by default for pilgrims, only show verified stays
    if (status) {
      query.verificationStatus = status;
    } else if (verified === 'true' || verified === true) {
      query.verificationStatus = 'verified';
    } else {
      query.verificationStatus = 'verified';
    }

    // Property Type filter (can be comma-separated)
    if (propertyType && propertyType !== 'all') {
      const types = propertyType.split(',').map((t) => t.trim().toLowerCase());
      query.propertyType = { $in: types };
    }

    // Price Range filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.pricePerNight.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.pricePerNight.$lte = Number(maxPrice);
      }
    }

    // City filter (e.g. Nashik, Trimbakeshwar)
    if (city && city !== 'all') {
      query.city = { $regex: escapeRegex(city.trim()), $options: 'i' };
    }

    // Keyword Search across title, address, description, and city
    const searchTerm = search || location;
    if (searchTerm && searchTerm.trim() !== '') {
      const rawTrimmed = searchTerm.trim();
      const escapedFull = escapeRegex(rawTrimmed);
      const cleanWords = rawTrimmed
        .replace(/[()\/,]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .map((w) => escapeRegex(w));

      const orConditions = [
        { title: { $regex: escapedFull, $options: 'i' } },
        { address: { $regex: escapedFull, $options: 'i' } },
        { city: { $regex: escapedFull, $options: 'i' } },
        { distanceFromKumbh: { $regex: escapedFull, $options: 'i' } },
        { description: { $regex: escapedFull, $options: 'i' } },
        { 'distancePoints.pointName': { $regex: escapedFull, $options: 'i' } },
      ];

      cleanWords.forEach((word) => {
        orConditions.push(
          { title: { $regex: word, $options: 'i' } },
          { address: { $regex: word, $options: 'i' } },
          { city: { $regex: word, $options: 'i' } },
          { 'distancePoints.pointName': { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } }
        );
      });

      query.$or = orConditions;
    }

    // Amenities filter (all requested amenities must match)
    if (amenities) {
      const amenityList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenityList.length > 0) {
        query.amenities = { $all: amenityList };
      }
    }

    // Occupant Preferences, Gender, and Stay Type / Occupancy Filters
    const andFilters = [];

    // 1. Direct Occupant Preferences (e.g. 'family', 'female', 'seniorCitizen')
    const occPref = req.query.occupantPreference || req.query.occupantPreferences;
    if (occPref && occPref !== 'all') {
      const prefList = Array.isArray(occPref)
        ? occPref
        : occPref.split(',').map((p) => p.trim().toLowerCase());
      if (prefList.length > 0) {
        andFilters.push({ occupantPreferences: { $in: prefList } });
      }
    }

    // 2. Dedicated Gender Filter ('all', 'male', 'female')
    const gender = req.query.gender ? req.query.gender.toLowerCase().trim() : null;
    if (gender && gender !== 'all') {
      if (gender === 'female') {
        andFilters.push({ occupantPreferences: { $in: ['female', 'family'] } });
      } else if (gender === 'male') {
        andFilters.push({ occupantPreferences: { $in: ['bachelor', 'single', 'male', 'family', 'sadhus_pilgrims'] } });
      }
    }

    // 3. Dedicated Stay Type / Occupancy Filter ('all', 'family', 'single')
    const occupancy = req.query.occupancy || req.query.stayType || req.query.occupancyType;
    if (occupancy && occupancy.toLowerCase().trim() !== 'all') {
      const occType = occupancy.toLowerCase().trim();
      if (occType === 'family') {
        andFilters.push({ occupantPreferences: 'family' });
      } else if (occType === 'single') {
        andFilters.push({
          $or: [
            { occupantPreferences: { $in: ['single', 'bachelor', 'sadhus_pilgrims'] } },
            { propertyType: { $in: ['hostel', 'pg', 'ashram', 'dharamshala'] } },
          ],
        });
      }
    }

    if (andFilters.length > 0) {
      if (!query.$and) query.$and = [];
      query.$and.push(...andFilters);
    }

    // Verification filters
    if (ownerVerified === 'true') {
      query.ownerVerified = true;
    }
    if (locationVerified === 'true') {
      query.locationVerified = true;
    }

    // Build Sort options
    let sortOptions = { trustScore: -1, googleRating: -1 }; // default recommended
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { pricePerNight: 1 };
          break;
        case 'price_desc':
          sortOptions = { pricePerNight: -1 };
          break;
        case 'rating_desc':
          sortOptions = { googleRating: -1, googleReviewCount: -1 };
          break;
        case 'trust_desc':
          sortOptions = { trustScore: -1, lastVerifiedAt: -1 };
          break;
        case 'distance_asc':
          sortOptions = { locationVerified: -1, trustScore: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'recommended':
        default:
          sortOptions = { trustScore: -1, googleRating: -1 };
          break;
      }
    }

    const properties = await Property.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Geospatial nearby properties search using MongoDB 2dsphere index in Nashik
 * @route   GET /api/properties/nearby
 * @access  Public
 */
export const getNearbyProperties = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, type, maxPrice } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lng) query parameters are required for nearby stay discovery.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxRadiusMeters = parseInt(radius, 10) || 10000;

    const query = {
      locationScope: 'nashik',
      verificationStatus: 'verified',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxRadiusMeters,
        },
      },
    };

    if (type && type !== 'all') {
      query.propertyType = type.toLowerCase().trim();
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      query.pricePerNight = { $lte: Number(maxPrice) };
    }

    const properties = await Property.find(query);

    // Compute dynamic straight-line distance to search origin
    const enriched = properties.map((p) => {
      const distanceKm = calculateDistanceKm(
        latitude,
        longitude,
        p.latitude || p.location?.coordinates?.[1] || 20.0063,
        p.longitude || p.location?.coordinates?.[0] || 73.7915
      );
      return {
        ...p.toObject(),
        distanceToOrigin: formatDistance(distanceKm),
        distanceToOriginKm: Number(distanceKm.toFixed(2)),
      };
    });

    res.status(200).json({
      success: true,
      origin: { latitude, longitude },
      radiusMeters: maxRadiusMeters,
      count: enriched.length,
      properties: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID with Location Intelligence & Google Review metadata (Nashik Only)
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      locationScope: 'nashik',
    }).populate('owner', 'name phone isVerified');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Nashik property not found with id: ${req.params.id}`,
      });
    }

    const propObj = property.toObject();

    // 1. Dynamic Location Intelligence: Calculate nearest Nashik Kumbh landmarks (Ramkund, Kalaram Mandir, Kushavarta, etc.)
    const lat = property.latitude || property.location?.coordinates?.[1] || 20.0063;
    const lng = property.longitude || property.location?.coordinates?.[0] || 73.7915;
    const locationIntelligence = getNearestLandmarks(lat, lng, property.city || 'Nashik');

    // 2. Fetch Google Places Reviews abstraction
    const reviewsData = await googlePlacesService.getPlaceReviews(
      property.googlePlaceId,
      property.googleReviews || [],
      property.googleRating || 4.5,
      property.googleReviewCount || 100
    );

    // 3. Price Transparency calculation
    const basePrice = property.pricePerNight || 0;
    const additionalCharges = property.additionalCharges || [];
    const additionalTotal = additionalCharges.reduce((acc, c) => acc + (c.amount || 0), 0);
    const totalEstimatedPrice = basePrice + additionalTotal;

    const pricingBreakdown = {
      basePrice,
      additionalCharges,
      totalEstimatedPrice,
      priceLastUpdated: property.updatedAt || property.createdAt || new Date(),
      currency: 'INR',
      currencySymbol: '₹',
    };

    res.status(200).json({
      success: true,
      property: {
        ...propObj,
        locationIntelligence,
        googleReviewsData: reviewsData,
        pricingBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property (Owner/Admin)
// @route   POST /api/properties
// @access  Private (Owner/Admin)
export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      address,
      city,
      state,
      country,
      googleMapsUrl,
      latitude,
      longitude,
      distanceFromKumbh,
      distancePoints,
      pricePerNight,
      additionalCharges,
      amenities,
      occupantPreferences,
      images,
      documents,
      rules,
      contactPhone,
      submitNow,
    } = req.body;

    // Validation
    if (!title || !propertyType || !address || !city || pricePerNight === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, propertyType, address, city, and pricePerNight.',
      });
    }

    let lat = latitude ? Number(latitude) : 20.0063;
    let lng = longitude ? Number(longitude) : 73.7915;

    // Check if coordinates can be parsed from Google Maps URL
    if (googleMapsUrl && (!latitude || !longitude)) {
      const parsed = parseGoogleMapsUrl(googleMapsUrl);
      if (parsed) {
        lat = parsed.latitude;
        lng = parsed.longitude;
      }
    }

    const property = await Property.create({
      owner: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : `Verified ${propertyType} accommodation in ${city} for Nashik Kumbh Mela yatris.`,
      propertyType: propertyType.toLowerCase().trim(),
      address: address.trim(),
      city: city.trim(),
      state: state ? state.trim() : 'Maharashtra',
      country: country ? country.trim() : 'India',
      locationScope: 'nashik',
      dataStatus: 'production',
      googleMapsUrl: googleMapsUrl ? googleMapsUrl.trim() : '',
      latitude: lat,
      longitude: lng,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      distanceFromKumbh: distanceFromKumbh || '500 m from Ramkund Ghat',
      distancePoints: distancePoints || [
        { pointName: 'Ramkund Snan Ghat', distance: '500 meters', type: 'ghat' },
        { pointName: 'CBS Shuttle Stand', distance: '1.5 km', type: 'shuttle' },
      ],
      pricePerNight: Number(pricePerNight),
      additionalCharges: additionalCharges || [],
      amenities: amenities || ['water', 'hotWater24h'],
      occupantPreferences: occupantPreferences || ['family'],
      images: images && images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          ],
      documents: documents || [],
      rules: rules || ['Sattvic pure vegetarian premises only', '24-hour hot water available for snan'],
      contactPhone: contactPhone || req.user.phone || '+91 1800 200 2027',
      verificationStatus: submitNow ? 'pending' : 'draft',
      ownerVerified: false,
      propertyVerified: false,
      locationVerified: false,
      photoVerified: false,
      trustScore: 85,
      isDemo: false,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: submitNow
        ? 'Property created and submitted for verification successfully!'
        : 'Property saved as draft.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property (Owner/Admin)
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (
      property.owner &&
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this property.',
      });
    }

    const updates = { ...req.body, locationScope: 'nashik' };

    // Update coordinates if lat/lng changed
    if (updates.latitude || updates.longitude) {
      const lat = updates.latitude ? Number(updates.latitude) : property.latitude;
      const lng = updates.longitude ? Number(updates.longitude) : property.longitude;
      updates.location = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    }

    property = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property (Owner/Admin)
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (
      property.owner &&
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property.',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit property for verification
// @route   POST /api/properties/:id/submit
// @access  Private (Owner/Admin)
export const submitPropertyForVerification = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (
      property.owner &&
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this property.',
      });
    }

    // Validation for submission
    const errors = [];
    if (!property.title || property.title.trim() === '') errors.push('Property name is required.');
    if (!property.propertyType) errors.push('Property type is required.');
    if (!property.address || !property.city) errors.push('Address and City location are required.');
    if (!property.pricePerNight || property.pricePerNight <= 0) errors.push('A valid nightly tariff is required.');
    if (!property.amenities || property.amenities.length === 0) errors.push('At least one amenity must be selected.');
    if (!property.occupantPreferences || property.occupantPreferences.length === 0) errors.push('At least one occupant preference must be selected.');
    if (!property.images || property.images.length === 0) errors.push('At least one property exterior/interior photo is required.');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed before submission.',
        errors,
      });
    }

    property.verificationStatus = 'pending';
    property.lastVerifiedAt = null;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property successfully submitted for KumbhStay on-ground verification in Nashik.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart recommended properties (Nashik Only)
// @route   GET /api/properties/recommended
// @access  Public
export const getRecommendedProperties = async (req, res, next) => {
  try {
    const { city, propertyType, preference, maxPrice } = req.query;

    const query = {
      isActive: true,
      verificationStatus: 'verified',
      locationScope: 'nashik', // Enforced Nashik scope
      dataStatus: { $in: ['production', 'demo', 'reference'] },
    };

    if (city && city !== 'all') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (maxPrice && !isNaN(parseInt(maxPrice, 10))) {
      query.pricePerNight = { $lte: parseInt(maxPrice, 10) };
    }

    if (preference) {
      query[`occupantPreferences.${preference}`] = true;
    }

    // Sort by Trust Score desc, Google rating desc, and price fair value
    const properties = await Property.find(query)
      .populate('owner', 'name phone')
      .sort({ trustScore: -1, googleRating: -1, pricePerNight: 1 })
      .limit(6);

    const recommended = properties.map((p) => {
      const obj = p.toObject();
      let recommendationReason = 'Verified Nashik Kumbh Stay';
      if (obj.trustScore >= 95) {
        recommendationReason = 'Highest Trust & Physical Audit Score';
      } else if (obj.pricingBreakdown?.totalEstimatedPrice <= 1200) {
        recommendationReason = 'Best Value & Direct Tariff';
      } else if (obj.googleRating >= 4.5) {
        recommendationReason = 'Top Rated by Pilgrims';
      } else if (obj.locationVerified) {
        recommendationReason = 'Ramkund / Ghat Proximity Verified';
      }
      return {
        ...obj,
        recommendationReason,
      };
    });

    res.status(200).json({
      success: true,
      count: recommended.length,
      properties: recommended,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample data manually
// @route   POST /api/properties/seed
// @access  Public
export const seedProperties = async (req, res, next) => {
  try {
    await Property.deleteMany({});
    const created = await Property.insertMany(sampleProperties);
    res.status(201).json({
      success: true,
      message: `Successfully seeded ${created.length} sample Nashik properties.`,
      count: created.length,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProperties,
  getNearbyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  submitPropertyForVerification,
  getRecommendedProperties,
  seedProperties,
};
