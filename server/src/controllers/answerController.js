import Answer from '../models/Answer.js';

// SAVE ANSWER
export const saveAnswer = async (req, res, next) => {
  try {
    const {
      question,
      answer,
      role,
      difficulty,
      sessionId,
      timestamp,
      interviewId
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer required"
      });
    }

    const newAnswer = await Answer.create({
      questionText: question,
      userAnswer: answer,
      role: role || '',
      difficulty: difficulty || '',
      sessionId: sessionId || '',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      interview: interviewId || null,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newAnswer
    });

  } catch (error) {
    next(error);
  }
};

// GET ANSWERS
export const getAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });

  } catch (error) {
    next(error);
  }
};