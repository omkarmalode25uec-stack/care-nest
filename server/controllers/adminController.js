import Property from '../models/Property.js';
import User from '../models/User.js';
import Verification from '../models/Verification.js';
import Report from '../models/Report.js';

/**
 * Calculate deterministic trust score based on audit parameters
 */
export const calculateTrustScore = ({
  ownerVerified = false,
  propertyDocumentVerified = false,
  locationVerified = false,
  photoVerified = false,
  pricingVerified = false,
  amenitiesVerified = false,
  hasGoogleReviews = false,
}) => {
  const ownerScore = ownerVerified ? 25 : 0;
  const documentScore = propertyDocumentVerified ? 25 : 0;
  const locationScore = locationVerified ? 20 : 0;
  const photoScore = photoVerified ? 15 : 0;
  
  // Review signals & completeness (max 15)
  let profileScore = 0;
  if (pricingVerified) profileScore += 5;
  if (amenitiesVerified) profileScore += 5;
  if (hasGoogleReviews) profileScore += 5;
  else if (pricingVerified && amenitiesVerified) profileScore += 5; // fallback for newly onboarded stays

  const totalScore = Math.min(100, ownerScore + documentScore + locationScore + photoScore + profileScore);

  return {
    totalScore,
    breakdown: {
      ownerScore,
      documentScore,
      locationScore,
      photoScore,
      profileScore,
    },
  };
};

/**
 * @desc    Get Admin Metrics & Stats Overview
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    const scopeQuery = { locationScope: 'nashik' };

    const [
      totalProperties,
      pendingProperties,
      verifiedProperties,
      changesRequestedProperties,
      rejectedProperties,
      suspendedProperties,
      draftProperties,
      totalReports,
      pendingReports,
      resolvedReports,
      totalOwners,
      totalPilgrims,
    ] = await Promise.all([
      Property.countDocuments(scopeQuery),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['pending', 'PENDING', 'Pending'] } }),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['verified', 'approved', 'VERIFIED', 'APPROVED'] } }),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['changes_requested', 'CHANGES_REQUESTED'] } }),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['rejected', 'REJECTED'] } }),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['suspended', 'SUSPENDED'] } }),
      Property.countDocuments({ ...scopeQuery, verificationStatus: { $in: ['draft', 'DRAFT'] } }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'resolved' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'pilgrim' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          pending: pendingProperties,
          verified: verifiedProperties,
          approved: verifiedProperties,
          changesRequested: changesRequestedProperties,
          rejected: rejectedProperties,
          suspended: suspendedProperties,
          draft: draftProperties,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
        },
        users: {
          owners: totalOwners,
          pilgrims: totalPilgrims,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all properties for admin with filters
 * @route   GET /api/admin/properties
 * @access  Private/Admin
 */
export const getAllAdminProperties = async (req, res) => {
  try {
    const { status, type, city, search, sort = 'newest', page = 1, limit = 100 } = req.query;

    const query = { locationScope: 'nashik' };

    if (status && status !== 'all') {
      const normalizedStatus = status.toLowerCase().trim();
      if (normalizedStatus === 'pending') {
        query.verificationStatus = { $in: ['pending', 'PENDING', 'Pending'] };
      } else if (normalizedStatus === 'approved' || normalizedStatus === 'verified') {
        query.verificationStatus = { $in: ['verified', 'approved', 'VERIFIED', 'APPROVED'] };
      } else if (normalizedStatus === 'changes_requested' || normalizedStatus === 'changesrequested') {
        query.verificationStatus = { $in: ['changes_requested', 'CHANGES_REQUESTED'] };
      } else if (normalizedStatus === 'rejected') {
        query.verificationStatus = { $in: ['rejected', 'REJECTED'] };
      } else if (normalizedStatus === 'suspended') {
        query.verificationStatus = { $in: ['suspended', 'SUSPENDED'] };
      } else if (normalizedStatus === 'draft') {
        query.verificationStatus = { $in: ['draft', 'DRAFT'] };
      } else {
        query.verificationStatus = normalizedStatus;
      }
    }

    if (type && type !== 'all') {
      query.propertyType = type.toLowerCase().trim();
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { address: { $regex: sanitized, $options: 'i' } },
        { city: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'updated') {
      sortOption = { updatedAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email phone role isVerified createdAt')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties for admin',
      error: error.message,
    });
  }
};

/**
 * @desc    Get deep property audit details by ID
 * @route   GET /api/admin/properties/:id
 * @access  Private/Admin
 */
export const getPropertyForAudit = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone role isVerified createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Fetch verification audit history
    const verifications = await Verification.find({ property: property._id })
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    // Fetch reports associated with this property
    const reports = await Report.find({ property: property._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        property,
        verifications,
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property audit information',
      error: error.message,
    });
  }
};

/**
 * @desc    Audit & Approve Property with Trust Score Calculation
 * @route   POST /api/admin/properties/:id/verify
 * @access  Private/Admin
 */
export const verifyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const {
      ownerVerified = true,
      propertyDocumentVerified = true,
      locationVerified = true,
      photoVerified = true,
      pricingVerified = true,
      amenitiesVerified = true,
      adminNotes = '',
    } = req.body;

    // Calculate explainable trust score
    const hasGoogleReviews = (property.googleReviews && property.googleReviews.length > 0) || property.googleReviewCount > 0;
    const { totalScore, breakdown } = calculateTrustScore({
      ownerVerified,
      propertyDocumentVerified,
      locationVerified,
      photoVerified,
      pricingVerified,
      amenitiesVerified,
      hasGoogleReviews,
    });

    // Update Property model
    property.verificationStatus = 'verified';
    property.ownerVerified = Boolean(ownerVerified);
    property.propertyVerified = Boolean(propertyDocumentVerified);
    property.locationVerified = Boolean(locationVerified);
    property.photoVerified = Boolean(photoVerified);
    property.trustScore = totalScore;
    property.lastVerifiedAt = new Date();
    property.reviewedAt = new Date();
    property.reviewedBy = req.user._id;
    property.reviewComment = adminNotes || 'Approved by Trust Officer';
    property.isActive = true;

    // Update document status if any
    if (property.documents && property.documents.length > 0) {
      property.documents.forEach((doc) => {
        if (propertyDocumentVerified) {
          doc.status = 'verified';
        }
      });
    }

    // Append to verification history
    property.verificationHistory.push({
      action: 'approved',
      performedBy: req.user._id,
      timestamp: new Date(),
      comment: adminNotes || 'Approved with Kumbh Verified Badge',
      trustScore: totalScore,
      checklist: {
        ownerVerified: Boolean(ownerVerified),
        propertyDocumentVerified: Boolean(propertyDocumentVerified),
        locationVerified: Boolean(locationVerified),
        photoVerified: Boolean(photoVerified),
        pricingVerified: Boolean(pricingVerified),
        amenitiesVerified: Boolean(amenitiesVerified),
      },
    });

    await property.save();

    // Also mark owner as verified if applicable
    if (property.owner && ownerVerified) {
      await User.findByIdAndUpdate(property.owner, {
        isVerified: true,
        ownerVerificationStatus: 'approved',
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
      });
    }

    // Create Verification audit log
    const verificationRecord = await Verification.create({
      property: property._id,
      admin: req.user._id,
      ownerVerified: Boolean(ownerVerified),
      propertyDocumentVerified: Boolean(propertyDocumentVerified),
      locationVerified: Boolean(locationVerified),
      photoVerified: Boolean(photoVerified),
      pricingVerified: Boolean(pricingVerified),
      amenitiesVerified: Boolean(amenitiesVerified),
      status: 'verified',
      trustScore: totalScore,
      trustBreakdown: breakdown,
      adminNotes,
      reviewedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Property successfully verified and Kumbh Verified badge issued!',
      data: {
        property,
        verification: verificationRecord,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify property',
      error: error.message,
    });
  }
};

/**
 * @desc    Reject Property Listing with Reason
 * @route   POST /api/admin/properties/:id/reject
 * @access  Private/Admin
 */
export const rejectProperty = async (req, res) => {
  try {
    const { reason, adminNotes = '' } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A rejection reason is mandatory to reject a property listing',
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.verificationStatus = 'rejected';
    property.rejectionReason = reason.trim();
    property.reviewedAt = new Date();
    property.reviewedBy = req.user._id;
    property.isActive = false;

    // Append to verification history
    property.verificationHistory.push({
      action: 'rejected',
      performedBy: req.user._id,
      timestamp: new Date(),
      comment: reason.trim(),
    });

    await property.save();

    // Create Verification Audit Log
    const verificationRecord = await Verification.create({
      property: property._id,
      admin: req.user._id,
      status: 'rejected',
      rejectionReason: reason.trim(),
      adminNotes,
      reviewedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Property listing rejected.',
      data: {
        property,
        verification: verificationRecord,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject property',
      error: error.message,
    });
  }
};

/**
 * @desc    Request Changes from Owner
 * @route   POST /api/admin/properties/:id/request-changes
 * @access  Private/Admin
 */
export const requestChangesProperty = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide detailed revision notes for the owner',
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.verificationStatus = 'changes_requested';
    property.reviewComment = notes.trim();
    property.reviewedAt = new Date();
    property.reviewedBy = req.user._id;
    property.isActive = false;

    // Append to verification history
    property.verificationHistory.push({
      action: 'changes_requested',
      performedBy: req.user._id,
      timestamp: new Date(),
      comment: notes.trim(),
    });

    await property.save();

    const verificationRecord = await Verification.create({
      property: property._id,
      admin: req.user._id,
      status: 'changes_requested',
      changesRequestedNotes: notes.trim(),
      adminNotes: notes.trim(),
      reviewedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Changes requested. Property reverted to changes_requested state for owner revision.',
      data: {
        property,
        verification: verificationRecord,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to request changes',
      error: error.message,
    });
  }
};

/**
 * @desc    Suspend Property Listing
 * @route   POST /api/admin/properties/:id/suspend
 * @access  Private/Admin
 */
export const suspendProperty = async (req, res) => {
  try {
    const { reason = 'Suspended due to safety/verification review', adminNotes = '' } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.verificationStatus = 'suspended';
    property.rejectionReason = reason;
    property.reviewedAt = new Date();
    property.reviewedBy = req.user._id;
    property.isActive = false;

    // Append to verification history
    property.verificationHistory.push({
      action: 'suspended',
      performedBy: req.user._id,
      timestamp: new Date(),
      comment: reason,
    });

    await property.save();

    const verificationRecord = await Verification.create({
      property: property._id,
      admin: req.user._id,
      status: 'suspended',
      rejectionReason: reason,
      adminNotes,
      reviewedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Property listing suspended and hidden from public search.',
      data: {
        property,
        verification: verificationRecord,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to suspend property',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all pilgrim stay reports
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
export const getAdminReports = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('property', 'title propertyType address city pricePerNight verificationStatus images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message,
    });
  }
};

/**
 * @desc    Update report status & record action taken
 * @route   PUT /api/admin/reports/:id
 * @access  Private/Admin
 */
export const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes = '', actionTaken = 'none' } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (status) report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    if (actionTaken) report.actionTaken = actionTaken;

    if (status === 'resolved' || status === 'dismissed') {
      report.resolvedAt = new Date();
      report.resolvedBy = req.user._id;
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to '${report.status}'`,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all registered owners
 * @route   GET /api/admin/owners
 * @access  Private/Admin
 */
export const getAdminOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Attach property counts to owners
    const ownersWithCounts = await Promise.all(
      owners.map(async (owner) => {
        const propCount = await Property.countDocuments({ owner: owner._id });
        const verifiedCount = await Property.countDocuments({
          owner: owner._id,
          verificationStatus: 'verified',
        });
        return {
          ...owner.toObject(),
          totalProperties: propCount,
          verifiedProperties: verifiedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: ownersWithCounts.length,
      data: ownersWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owners',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Admin Verification Queue
 * @route   GET /api/admin/verifications
 * @access  Private/Admin
 */
export const getAdminVerifications = async (req, res) => {
  return getAllAdminProperties(req, res);
};

/**
 * @desc    Approve/Verify Owner Identity & Profile
 * @route   POST /api/admin/owners/:id/verify
 * @access  Private/Admin
 */
export const verifyOwnerProfile = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.isVerified = true;
    owner.ownerVerificationStatus = 'approved';
    owner.reviewedAt = new Date();
    owner.reviewedBy = req.user._id;
    owner.reviewComment = req.body.adminNotes || 'Owner profile & credentials verified by Admin';
    await owner.save();

    res.status(200).json({
      success: true,
      message: 'Owner profile successfully verified!',
      data: owner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify owner',
      error: error.message,
    });
  }
};

/**
 * @desc    Reject Owner Profile with Reason
 * @route   POST /api/admin/owners/:id/reject
 * @access  Private/Admin
 */
export const rejectOwnerProfile = async (req, res) => {
  try {
    const { reason = 'Owner credentials failed verification' } = req.body;
    const owner = await User.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.isVerified = false;
    owner.ownerVerificationStatus = 'rejected';
    owner.rejectionReason = reason;
    owner.reviewedAt = new Date();
    owner.reviewedBy = req.user._id;
    await owner.save();

    res.status(200).json({
      success: true,
      message: 'Owner profile rejected.',
      data: owner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject owner',
      error: error.message,
    });
  }
};

