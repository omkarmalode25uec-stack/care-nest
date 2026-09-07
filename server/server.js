import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import medicalRoutes from './routes/medicalRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { seedDatabase } from './utils/seedData.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB in standalone mode (only auto-seed in development when using ephemeral in-memory database)
if (!process.env.VERCEL) {
  connectDB()
    .then(async () => {
      if (process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI) {
        await seedDatabase();
      }
    })
    .catch((err) => {
      console.error('[Server DB Error]', err.message);
    });
}

// Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection guarantee middleware for API routes
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Database Middleware Error]', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection unavailable',
    });
  }
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Care Nest API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/medical-points', medicalRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes);


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server (only when running directly, not inside Vercel serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Care Nest Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Health Endpoint] http://localhost:${PORT}/api/health`);
    console.log(`[Properties Endpoint] http://localhost:${PORT}/api/properties`);
    console.log(`[Owner Endpoint] http://localhost:${PORT}/api/owner/properties`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

export default app;
