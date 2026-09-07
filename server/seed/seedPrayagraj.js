import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import MedicalPoint from '../models/MedicalPoint.js';
import { prayagrajProperties } from './prayagraj/properties.js';
import { prayagrajMedicalPoints } from './prayagraj/medicalPoints.js';

dotenv.config();

const seedPrayagraj = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kumbhstay';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Prayagraj Seeding...');

    // Delete existing prayagraj records only
    await Property.deleteMany({ locationScope: 'prayagraj' });
    await MedicalPoint.deleteMany({ locationScope: 'prayagraj' });

    const insertedProps = await Property.insertMany(prayagrajProperties);
    const insertedMed = await MedicalPoint.insertMany(prayagrajMedicalPoints);

    console.log(`✓ Seeded ${insertedProps.length} Prayagraj accommodation listings (locationScope: prayagraj, dataStatus: demo).`);
    console.log(`✓ Seeded ${insertedMed.length} Prayagraj medical points (locationScope: prayagraj, dataStatus: demo).`);

    await mongoose.disconnect();
    console.log('Prayagraj Seeding Complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Prayagraj dataset:', error);
    process.exit(1);
  }
};

seedPrayagraj();
