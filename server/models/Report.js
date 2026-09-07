import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Please provide the property being reported'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reporterName: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    reporterContact: {
      type: String,
      required: [true, 'Please provide your phone or email'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: [
        'Wrong price',
        'Wrong location',
        'Incorrect amenities',
        'Misleading photos',
        'Property unavailable',
        'Safety concern',
        'Other',
      ],
    },
    details: {
      type: String,
      required: [true, 'Please describe the issue in detail'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    actionTaken: {
      type: String,
      enum: ['none', 'listing_suspended', 'owner_notified', 'information_corrected', 'dismissed_invalid'],
      default: 'none',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
