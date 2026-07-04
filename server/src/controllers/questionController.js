import Question from '../models/Question.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionsByRole = async (req, res) => {
  try {
    const roleRegex = new RegExp(`^${decodeURIComponent(req.params.role)}$`, 'i');
    const questions = await Question.find({ role: roleRegex });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionsByRoleAndDifficulty = async (req, res) => {
  try {
    const roleRegex = new RegExp(`^${decodeURIComponent(req.params.role)}$`, 'i');
    const difficultyRegex = new RegExp(`^${decodeURIComponent(req.params.difficulty)}$`, 'i');

    const questions = await Question.find({
      role: roleRegex,
      difficulty: difficultyRegex
    });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRandomQuestion = async (req, res) => {
  try {
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(random);
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
