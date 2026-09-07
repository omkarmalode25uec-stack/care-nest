import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: {
        values: ['hotel', 'hostel', 'pg', 'homestay', 'ashram', 'dharamshala', 'tent'],
        message: '{VALUE} is not a valid property type',
      },
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide property address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      default: 'Prayagraj',
    },
    state: {
      type: String,
      trim: true,
      default: 'Uttar Pradesh',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    googleMapsUrl: {
      type: String,
      trim: true,
      default: '',
    },
    latitude: {
      type: Number,
      default: 25.4358,
    },
    longitude: {
      type: Number,
      default: 81.8463,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [81.8463, 25.4358],
      },
    },
    distanceFromKumbh: {
      type: String,
      default: '500 m from Mela Area',
    },
    distancePoints: [
      {
        pointName: { type: String, required: true },
        distance: { type: String, required: true },
        type: { type: String, default: 'ghat' }, // 'ghat', 'temple', 'shuttle', 'station', 'medical'
      },
    ],
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide nightly tariff'],
      min: [0, 'Price must be non-negative'],
    },
    additionalCharges: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    priceRange: {
      type: String,
      enum: ['budget', 'mid_range', 'premium', 'luxury'],
      default: 'budget',
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String], // 'wifi', 'ac', 'water', 'hotWater24h', 'parking', 'attachedBathroom', 'pureVegFood', etc.
      default: [],
    },
    occupantPreferences: {
      type: [String], // 'family', 'female', 'bachelor', 'children', 'seniorCitizen', 'sadhus_pilgrims'
      default: [],
    },
    documents: [
      {
        docType: {
          type: String,
          enum: ['ownership_proof', 'authorization_noc', 'electricity_bill', 'tax_receipt', 'other'],
          required: true,
        },
        title: { type: String, default: 'Supporting Document' },
        fileName: { type: String, required: true },
        fileUrl: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
      },
    ],
    googlePlaceId: {
      type: String,
      default: null,
    },
    googleRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    googleReviewCount: {
      type: Number,
      default: 0,
    },
    googleReviews: [
      {
        author: { type: String, required: true },
        rating: { type: Number, required: true },
        text: { type: String, required: true },
        date: { type: String, default: 'Recent Kumbh stay' },
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['draft', 'pending', 'verified', 'approved', 'rejected', 'changes_requested', 'suspended'],
      default: 'draft',
    },
    ownerVerified: {
      type: Boolean,
      default: false,
    },
    propertyVerified: {
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
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    lastVerifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reviewComment: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    verificationHistory: [
      {
        action: {
          type: String,
          enum: ['submitted', 'approved', 'verified', 'rejected', 'changes_requested', 'suspended', 'resubmitted'],
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        comment: {
          type: String,
          default: '',
        },
        trustScore: {
          type: Number,
          default: 0,
        },
        checklist: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],
    rules: {
      type: [String],
      default: [
        'Sattvic pure vegetarian premises only',
        '24-hour hot water available for snan',
        'Quiet hours after 10:00 PM',
      ],
    },
    locationScope: {
      type: String,
      enum: {
        values: ['prayagraj', 'nashik', 'generic', 'unknown'],
        message: '{VALUE} is not a valid locationScope',
      },
      required: [true, 'Please specify geographic locationScope (prayagraj, nashik, generic, unknown)'],
    },
    dataStatus: {
      type: String,
      enum: {
        values: ['production', 'reference', 'demo', 'unknown'],
        message: '{VALUE} is not a valid dataStatus',
      },
      required: [true, 'Please specify dataStatus (production, reference, demo, unknown)'],
    },
    source: {
      file: { type: String, default: '' },
      originalId: { type: String, default: '' },
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
propertySchema.index({ location: '2dsphere' });
propertySchema.index({ locationScope: 1, dataStatus: 1, verificationStatus: 1, propertyType: 1, pricePerNight: 1 });
propertySchema.index({ city: 1, propertyType: 1, pricePerNight: 1, verificationStatus: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ title: 'text', description: 'text', address: 'text' });

const Property = mongoose.model('Property', propertySchema);

export default Property;
