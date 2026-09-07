import mongoose from 'mongoose';

const medicalPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medical post / clinic name'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Medical Booth', 'Hospital', 'Ambulance Point', 'First Aid'],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Prayagraj',
    },
    sector: {
      type: String,
      default: 'Sector 1',
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
      default: '108', // Default official ambulance helpline
    },
    services: {
      type: [String],
      default: ['First Aid', 'Doctor Consultation', 'Free Essential Medicines', '24/7 Oxygen'],
    },
    operatingHours: {
      type: String,
      default: '24 Hours Open',
    },
    isEmergency: {
      type: Boolean,
      default: true,
    },
    hasAmbulanceBay: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

medicalPointSchema.index({ location: '2dsphere' });
medicalPointSchema.index({ locationScope: 1, dataStatus: 1, isEmergency: 1, type: 1 });
medicalPointSchema.index({ city: 1, type: 1, isEmergency: 1 });

const MedicalPoint = mongoose.model('MedicalPoint', medicalPointSchema);

export default MedicalPoint;
