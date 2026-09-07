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

// Connect to MongoDB & Seed Sample Data
connectDB()
  .then(async () => {
    await seedDatabase();
  })
  .catch((err) => {
    console.error('[Server DB Error]', err.message);
  });

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KumbhStay API is running',
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

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[KumbhStay Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Health Endpoint] http://localhost:${PORT}/api/health`);
  console.log(`[Properties Endpoint] http://localhost:${PORT}/api/properties`);
  console.log(`[Owner Endpoint] http://localhost:${PORT}/api/owner/properties`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

export default app;
