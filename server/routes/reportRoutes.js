import express from 'express';
import { createReport } from '../controllers/reportController.js';

const router = express.Router();

// Public submission of reports
router.post('/', createReport);

export default router;
