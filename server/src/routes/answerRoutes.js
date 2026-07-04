import express from 'express';
import { saveAnswer, getAnswers } from '../controllers/answerController.js';
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Save answer (works per user)
router.post('/', protect, saveAnswer);

// Get ONLY current user's answers (THIS WAS MISSING)
router.get('/', protect, getAnswers);

export default router;