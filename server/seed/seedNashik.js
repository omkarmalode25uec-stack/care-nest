import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from '../utils/seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/CareNest';
    await mongoose.connect(mongoUri);
    console.log('[Nashik Seeder] Connected to MongoDB...');
    await seedDatabase();
    console.log('[Nashik Seeder] Database seeded successfully for Nashik Kumbh platform!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Nashik Seeder Error]', error);
    process.exit(1);
  }
};

runSeed();
