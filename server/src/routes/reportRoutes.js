import express from 'express';
import {
  generateReport,
  getReportBySession,
  getAllReports,
} from '../controllers/reportController.js';
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post('/generate', protect, generateReport);
router.get('/', protect, getAllReports);
router.get('/:sessionId', protect, getReportBySession);

export default router;
