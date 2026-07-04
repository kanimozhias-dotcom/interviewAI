import Report from '../models/Report.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';

export const generateReport = async (req, res, next) => {
  try {
    const { sessionId, chatHistory } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    // Fetch all answers for this session.
    // IMPORTANT: The Answer model stores the owner as 'userId', NOT 'user'.
    const answers = await Answer.find({
      sessionId,
      userId: req.user._id,
    }).sort({ timestamp: 1 });
    
    if (answers.length === 0) {
      // No answers found — still save a zero-score report to DB so that
      // GET /api/reports/:sessionId can find it and Results page doesn't 404.
      const emptyReport = await Report.create({
        user: req.user._id,
        sessionId,
        role: 'Unknown',
        difficulty: 'Unknown',
        overallScore: 0,
        communicationScore: 0,
        technicalScore: 0,
        confidenceScore: 0,
        questionsAttempted: 0,
        questionsAnswered: 0,
        completionPct: 0,
        strengths: ['No answers were saved'],
        weaknesses: ['Interview data unavailable'],
        recommendations: ['Ensure answers are saved before generating the report'],
        breakdown: [],
        chatHistory: chatHistory || [],
      });
      // Update streak on the User document
      const userDoc = await User.findById(req.user._id);
      if (userDoc) {
        userDoc.updateStreak();
        await userDoc.save();
      }
      return res.status(201).json({
        success: true,
        message: 'Report generated (no answers found)',
        data: emptyReport,
      });
    }

    const role = answers[0].role;
    const difficulty = answers[0].difficulty;

    // Dynamic heuristic grading
    let totalScore = 0;
    let totalTechScore = 0;
    let totalCommScore = 0;
    let totalConfScore = 0;
    
    let shortAnswersCount = 0;
    let highTechCount = 0;
    let goodCommCount = 0;

    const technicalKeywords = ['react', 'api', 'database', 'state', 'component', 'server', 'client', 'function', 'object', 'array', 'data', 'user', 'interface', 'architecture', 'node', 'express', 'sql', 'nosql', 'html', 'css', 'javascript', 'performance', 'security', 'scalability', 'microservices', 'jwt', 'hook', 'dom', 'rendering', 'async', 'promise'];
    const fillerWords = ['um', 'uh', 'like', 'i guess', 'maybe', 'not sure', 'i don\'t know', 'idk'];

    const breakdown = answers.map((ans) => {
      const qText = ans.questionText.toLowerCase();
      const aText = ans.userAnswer.toLowerCase();
      const words = aText.split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;

      let score = 0;
      let techScore = 0;
      let commScore = 0;
      let confScore = 100;
      let feedback = '';

      // Check for "I don't know" or very short answers
      // Unanswered / skipped / don't know
if (
  wordCount === 0 ||
  aText === "(no answer recorded)" ||
  aText.includes("i don't know") ||
  aText.includes("not sure") ||
  aText.includes("idk")
) {
  score = 0;
  techScore = 0;
  commScore = 0;
  confScore = 0;

  feedback =
    "Question was skipped or not answered. Try attempting every question even if you are unsure.";

  shortAnswersCount++;
}
else if (wordCount < 5) {
  score = 10;
  techScore = 10;
  commScore = 20;
  confScore = 30;

  feedback =
    "Answer is too short. Add more explanation and technical details.";

  shortAnswersCount++;

      } else {
        // Base score on length (up to 40 points)
        score += Math.min(40, wordCount);
        commScore += Math.min(80, wordCount * 2);

        // Technical keyword match (up to 30 points)
        let matches = 0;
        technicalKeywords.forEach(kw => {
          if (aText.includes(kw)) matches++;
        });
        const techPoints = Math.min(30, matches * 10);
        score += techPoints;
        techScore = 40 + Math.min(60, matches * 15);
        if (techScore > 80) highTechCount++;

        // Relevance (words from question in answer) (up to 30 points)
        let relMatches = 0;
        const qWords = qText.split(/\s+/).filter(w => w.length > 3); // Ignore small words
        qWords.forEach(qw => {
          if (aText.includes(qw)) relMatches++;
        });
        score += Math.min(30, relMatches * 10);
        commScore += Math.min(20, relMatches * 10);

        // Confidence deductions
        fillerWords.forEach(fw => {
          if (aText.includes(fw)) confScore -= 10;
        });
        confScore = Math.max(30, confScore);

        if (score > 85) {
          feedback = 'Excellent answer! You provided a detailed and highly relevant explanation with good technical depth.';
          goodCommCount++;
        } else if (score > 60) {
          feedback = 'Good answer, but could use more specific technical details or examples to be stronger.';
        } else {
          feedback = 'Your answer covers some basics but lacks depth and relevance to the specific question.';
        }
      }

      totalScore += score;
      totalTechScore += techScore;
      totalCommScore += commScore;
      totalConfScore += confScore;

      return {
        question: ans.questionText,
        answer: ans.userAnswer,
        score: Math.min(100, score),
        feedback
      };
    });

    const numAns = breakdown.length;
    const overallScore = Math.floor(totalScore / numAns);
    const communicationScore = Math.min(100, Math.floor(totalCommScore / numAns));
    const technicalScore = Math.min(100, Math.floor(totalTechScore / numAns));
    const confidenceScore = Math.min(100, Math.floor(totalConfScore / numAns));

    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // Dynamic Strengths
    if (highTechCount >= numAns / 2) {
      strengths.push(`Strong technical vocabulary and ${role} fundamentals`);
    }
    if (goodCommCount >= numAns / 2) {
      strengths.push('Clear and detailed communication');
    }
    if (confidenceScore > 80) {
      strengths.push('Confident delivery with minimal filler words');
    }
    if (strengths.length === 0) strengths.push('Attempted all questions and completed the interview');

    // Dynamic Weaknesses & Recommendations
    if (shortAnswersCount >= 3) {
      weaknesses.push('Answers are frequently too short or incomplete');
      recommendations.push('Practice elaborating on your answers with real-world examples');
    }
    if (technicalScore < 60) {
      weaknesses.push('Missing deep technical details in explanations');
      recommendations.push(`Review advanced concepts related to ${role}`);
    }
    if (confidenceScore < 60) {
      weaknesses.push('Frequent use of filler words (um, uh, maybe)');
      recommendations.push('Take a brief pause to structure your thoughts before answering');
    }
    if (weaknesses.length === 0) {
      weaknesses.push('Minor details missed in some complex questions');
      recommendations.push('Keep practicing mock interviews to maintain sharpness');
    }

    let report = await Report.findOne({
  sessionId,
  user: req.user._id,
});

if (report) {
  return res.status(200).json({
    success: true,
    message: "Report already exists",
    data: report
  });
}

report = await Report.create({
      user: req.user._id,
      sessionId,
      role,
      difficulty,
      overallScore,
      communicationScore,
      technicalScore,
      confidenceScore,
      questionsAttempted: 10,
      questionsAnswered: numAns,
      completionPct: (numAns / 10) * 100,
      breakdown,
      strengths,
      weaknesses,
      recommendations,
      chatHistory: chatHistory || []
    });

    // Update streak on the User document now that a new report was created
    const userDoc = await User.findById(req.user._id);
    if (userDoc) {
      userDoc.updateStreak();
      await userDoc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getReportBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const report = await Report.findOne({
  sessionId,
  user: req.user._id,
});
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
