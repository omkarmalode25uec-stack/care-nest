import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerVerified: {
      type: Boolean,
      default: false,
    },
    propertyDocumentVerified: {
      type: Boolean,
      default: false,
    },
    locationVerified: {
      type: Boolean,
      default: false,
    },
    photoVerified: {
      type: Boolean,
      default: false,
    },
    pricingVerified: {
      type: Boolean,
      default: false,
    },
    amenitiesVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['verified', 'rejected', 'changes_requested', 'suspended'],
      required: true,
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    trustBreakdown: {
      ownerScore: { type: Number, default: 0 },
      documentScore: { type: Number, default: 0 },
      locationScore: { type: Number, default: 0 },
      photoScore: { type: Number, default: 0 },
      profileScore: { type: Number, default: 0 },
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    changesRequestedNotes: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
