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

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kumbhstay';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice] Native MongoDB at '${uri}' is unavailable (${error.message}).`);
    
    // In development mode, spin up MongoMemoryServer for instant plug-and-play functionality
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Initializing MongoMemoryServer development database...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'kumbhstay',
          },
        });
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
