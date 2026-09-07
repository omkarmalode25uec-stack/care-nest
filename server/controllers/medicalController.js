import MedicalPoint from '../models/MedicalPoint.js';
import { calculateDistanceKm, formatDistance } from '../services/locationService.js';

/**
 * @desc    Get all medical assistance points with optional GPS distance calculation (Nashik Scope)
 * @route   GET /api/medical-points
 * @access  Public
 */
export const getMedicalPoints = async (req, res) => {
  try {
    const { city, type, isEmergency, lat, lng, search, dataStatus } = req.query;

    const query = { 
      isActive: true,
      locationScope: 'nashik', // Enforce Nashik platform scope
    };

    if (dataStatus) {
      query.dataStatus = dataStatus.toLowerCase().trim();
    } else {
      query.dataStatus = { $in: ['production', 'demo', 'reference'] };
    }

    if (city && city !== 'all') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (isEmergency === 'true') {
      query.isEmergency = true;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
        { sector: { $regex: search.trim(), $options: 'i' } },
        { services: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    let medicalPoints = await MedicalPoint.find(query);

    // If user provided GPS coordinates, sort by closest distance
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      const enriched = medicalPoints.map((mp) => {
        const distKm = calculateDistanceKm(
          userLat,
          userLng,
          mp.latitude || mp.location?.coordinates?.[1] || 20.0063,
          mp.longitude || mp.location?.coordinates?.[0] || 73.7915
        );
        return {
          ...mp.toObject(),
          distanceKm: Number(distKm.toFixed(2)),
          formattedDistance: formatDistance(distKm),
        };
      });

      enriched.sort((a, b) => a.distanceKm - b.distanceKm);

      return res.status(200).json({
        success: true,
        count: enriched.length,
        userLocation: { latitude: userLat, longitude: userLng },
        medicalPoints: enriched,
      });
    }

    res.status(200).json({
      success: true,
      count: medicalPoints.length,
      medicalPoints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Nashik medical assistance points',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single medical assistance post by ID
 * @route   GET /api/medical-points/:id
 * @access  Public
 */
export const getMedicalPointById = async (req, res) => {
  try {
    const medicalPoint = await MedicalPoint.findOne({
      _id: req.params.id,
      locationScope: 'nashik',
    });

    if (!medicalPoint) {
      return res.status(404).json({
        success: false,
        message: 'Nashik medical facility not found',
      });
    }

    res.status(200).json({
      success: true,
      medicalPoint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve medical facility',
      error: error.message,
    });
  }
};

export default {
  getMedicalPoints,
  getMedicalPointById,
};
