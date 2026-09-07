import Report from '../models/Report.js';
import Property from '../models/Property.js';

/**
 * @desc    Submit a Pilgrim Stay Report
 * @route   POST /api/reports
 * @access  Public (Optional auth)
 */
export const createReport = async (req, res) => {
  try {
    const {
      propertyId,
      reporterName,
      reporterContact,
      reason,
      details,
    } = req.body;

    if (!propertyId || !reporterName || !reporterContact || !reason || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required reporting fields (propertyId, name, contact, reason, details)',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const report = await Report.create({
      property: propertyId,
      user: req.user ? req.user._id : null,
      reporterName: reporterName.trim(),
      reporterContact: reporterContact.trim(),
      reason,
      details: details.trim(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our Care Nest Trust & Safety team will inspect this listing immediately.',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message,
    });
  }
};
