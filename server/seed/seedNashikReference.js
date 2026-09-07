import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import MedicalPoint from '../models/MedicalPoint.js';
import { nashikReferenceProperties } from './nashik-reference/properties.js';
import { nashikReferenceMedicalPoints } from './nashik-reference/medicalPoints.js';

dotenv.config();

const seedNashikReference = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kumbhstay';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Nashik Reference Seeding...');

    // Delete existing nashik reference records only
    await Property.deleteMany({ locationScope: 'nashik' });
    await MedicalPoint.deleteMany({ locationScope: 'nashik' });

    const insertedProps = await Property.insertMany(nashikReferenceProperties);
    const insertedMed = await MedicalPoint.insertMany(nashikReferenceMedicalPoints);

    console.log(`✓ Seeded ${insertedProps.length} Nashik reference listings (locationScope: nashik, dataStatus: reference).`);
    console.log(`✓ Seeded ${insertedMed.length} Nashik reference medical points (locationScope: nashik, dataStatus: reference).`);

    await mongoose.disconnect();
    console.log('Nashik Reference Seeding Complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Nashik reference dataset:', error);
    process.exit(1);
  }
};

seedNashikReference();
