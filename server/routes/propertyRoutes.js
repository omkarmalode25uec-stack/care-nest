import express from 'express';
import {
  getProperties,
  getNearbyProperties,
  getRecommendedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  submitPropertyForVerification,
  seedProperties,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/nearby', getNearbyProperties);
router.get('/recommended', getRecommendedProperties);
router.post('/seed', seedProperties);
router.get('/:id', getPropertyById);


// Protected Owner/Admin routes
router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);
router.post('/:id/submit', protect, authorize('owner', 'admin'), submitPropertyForVerification);

export default router;
