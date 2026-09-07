import express from 'express';
import {
  getMedicalPoints,
  getMedicalPointById,
} from '../controllers/medicalController.js';

const router = express.Router();

// Public routes for health & emergency assistance
router.get('/', getMedicalPoints);
router.get('/:id', getMedicalPointById);

export default router;
