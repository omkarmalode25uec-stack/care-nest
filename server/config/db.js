import mongoose from 'mongoose';

let memoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (mongoose.connection.readyState === 2) {
    // Already connecting, wait until connected
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    return mongoose.connection;
  }

  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const uri = process.env.MONGODB_URI;

  if (isProduction && !uri) {
    throw new Error('MONGODB_URI environment variable is missing in production configuration.');
  }

  const connectionUri = uri || 'mongodb://127.0.0.1:27017/kumbhstay';

  try {
    const conn = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log(`[MongoDB] Connected successfully to ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice] Connection attempt failed (${error.message}).`);
    
    // In development mode only, spin up MongoMemoryServer for instant plug-and-play functionality
    if (!isProduction) {
      try {
        console.log('[MongoDB] Initializing MongoMemoryServer development database...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!memoryServer) {
          memoryServer = await MongoMemoryServer.create({
            instance: {
              dbName: 'kumbhstay',
            },
          });
        }
        const memUri = memoryServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB Memory Server] Connected to in-memory instance: ${memUri} (Database: kumbhstay)`);
        return conn;
      } catch (memError) {
        console.error(`[MongoDB Error] Failed to initialize MongoMemoryServer: ${memError.message}`);
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export default connectDB;
