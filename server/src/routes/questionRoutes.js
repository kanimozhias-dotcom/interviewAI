import express from 'express';
import { 
  getQuestions, 
  getQuestionsByRole, 
  getQuestionsByRoleAndDifficulty, 
  getRandomQuestion 
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/random', getRandomQuestion);
router.get('/:role/:difficulty', getQuestionsByRoleAndDifficulty);
router.get('/:role', getQuestionsByRole);
router.get('/', getQuestions);

export default router;
