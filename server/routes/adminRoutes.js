import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import {
  getAdminStats,
  getAllAdminProperties,
  getPropertyForAudit,
  verifyProperty,
  rejectProperty,
  requestChangesProperty,
  suspendProperty,
  getAdminReports,
  updateReportStatus,
  getAdminOwners,
  getAdminVerifications,
  verifyOwnerProfile,
  rejectOwnerProfile,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Overview Metrics
router.get('/stats', getAdminStats);

// Property Audit & Verification Operations
router.get('/properties', getAllAdminProperties);
router.get('/properties/:id', getPropertyForAudit);
router.post('/properties/:id/verify', verifyProperty);
router.post('/properties/:id/reject', rejectProperty);
router.post('/properties/:id/request-changes', requestChangesProperty);
router.post('/properties/:id/suspend', suspendProperty);

// Direct Verification Console Endpoints (Aliases)
router.get('/verifications', getAdminVerifications);
router.get('/verifications/:id', getPropertyForAudit);
router.post('/verifications/:id/approve', verifyProperty);
router.post('/verifications/:id/reject', rejectProperty);
router.post('/verifications/:id/request-changes', requestChangesProperty);
router.post('/verifications/:id/suspend', suspendProperty);

// Report Management
router.get('/reports', getAdminReports);
router.put('/reports/:id', updateReportStatus);
router.patch('/reports/:id', updateReportStatus);

// Owner Directory & Verification
router.get('/owners', getAdminOwners);
router.post('/owners/:id/verify', verifyOwnerProfile);
router.post('/owners/:id/reject', rejectOwnerProfile);

export default router;
