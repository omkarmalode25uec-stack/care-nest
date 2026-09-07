import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

// All booking routes require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);

export default router;
