import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get owner properties & dashboard stats
// @route   GET /api/owner/properties
// @access  Private (Owner/Admin)
export const getOwnerProperties = async (req, res, next) => {
  try {
    const isMasterAdmin = req.user.role === 'admin';
    const query = isMasterAdmin ? {} : { owner: req.user._id };

    const properties = await Property.find(query).sort({ updatedAt: -1 });

    const total = properties.length;
    const verified = properties.filter((p) => p.verificationStatus === 'verified' || p.verificationStatus === 'approved').length;
    const pending = properties.filter((p) => p.verificationStatus === 'pending').length;
    const rejected = properties.filter((p) => p.verificationStatus === 'rejected').length;
    const changesRequested = properties.filter((p) => p.verificationStatus === 'changes_requested').length;
    const draft = properties.filter((p) => p.verificationStatus === 'draft').length;

    // Owner verification audit summary
    const ownerDocCount = req.user.ownerVerificationDocuments?.length || 0;
    const ownerVerification = {
      identity: req.user.isVerified || req.user.ownerVerificationStatus === 'approved' ? 'verified' : (req.user.ownerVerificationStatus === 'pending' ? 'in_review' : 'pending'),
      propertyDocuments: pending > 0 || verified > 0 ? (verified > 0 ? 'verified' : 'pending') : (ownerDocCount > 0 ? 'in_review' : 'pending'),
      faceLiveness: 'not_implemented',
      adminApproval: verified > 0 || req.user.ownerVerificationStatus === 'approved' ? 'approved' : (pending > 0 || req.user.ownerVerificationStatus === 'pending' ? 'in_review' : 'pending'),
      status: req.user.ownerVerificationStatus || (req.user.isVerified ? 'approved' : 'not_submitted'),
      documents: req.user.ownerVerificationDocuments || [],
    };

    res.status(200).json({
      success: true,
      stats: {
        total,
        verified,
        pending,
        rejected,
        changesRequested,
        draft,
      },
      ownerVerification,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit / Update Owner Verification Documents
// @route   POST /api/owner/verification/documents
// @access  Private (Owner/Admin)
export const submitOwnerDocuments = async (req, res, next) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one verification document (Aadhaar, PAN, Electricity Bill, or Municipal NOC).',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.ownerVerificationDocuments = documents.map((doc) => ({
      docType: doc.docType || 'other',
      title: doc.title || 'Verification Document',
      fileName: doc.fileName || 'document.pdf',
      fileUrl: doc.fileUrl || '',
      status: 'pending',
      uploadedAt: new Date(),
    }));
    user.ownerVerificationStatus = 'pending';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Owner verification documents submitted successfully. Admin review in progress.',
      ownerVerificationStatus: user.ownerVerificationStatus,
      documents: user.ownerVerificationDocuments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resubmit property for verification after changes/revision
// @route   POST /api/owner/properties/:id/resubmit
// @access  Private (Owner/Admin)
export const resubmitProperty = async (req, res, next) => {
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

    const { resubmissionNotes = '' } = req.body;

    property.verificationStatus = 'pending';
    property.lastVerifiedAt = null;
    property.reviewComment = '';
    property.rejectionReason = '';

    property.verificationHistory.push({
      action: 'resubmitted',
      performedBy: req.user._id,
      timestamp: new Date(),
      comment: resubmissionNotes || 'Resubmitted by owner for verification review',
    });

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property successfully resubmitted for verification review!',
      property,
    });
  } catch (error) {
    next(error);
  }
};

