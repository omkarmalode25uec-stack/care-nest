import express from 'express';
import {
  getOwnerProperties,
  submitOwnerDocuments,
  resubmitProperty,
} from '../controllers/ownerController.js';
import { getOwnerBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('owner', 'admin'));

router.get('/properties', getOwnerProperties);
router.post('/properties/:id/resubmit', resubmitProperty);
router.post('/verification/documents', submitOwnerDocuments);
router.get('/bookings', getOwnerBookings);

export default router;
