import express from 'express';
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
  recordPaymentFailure,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public config route (public key only)
router.get('/config', getPaymentConfig);

// Protected payment lifecycle routes
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/failure', protect, recordPaymentFailure);

export default router;
