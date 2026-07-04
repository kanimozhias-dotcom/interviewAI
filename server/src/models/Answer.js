import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    // Session tracking fields (per spec)
    role: { type: String, default: '' },
    difficulty: { type: String, default: '' },
    sessionId: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },

    // Core content
    questionText: { type: String },
    userAnswer: { type: String, required: true, default: '' },

    // Relations (optional / legacy)
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: false },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Scoring (populated by AI grading later)
    score: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    timeSpent: { type: Number, default: 0 }, // seconds
    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

answerSchema.index({ sessionId: 1 });
answerSchema.index({ role: 1, difficulty: 1 });
answerSchema.index({ interview: 1 });
answerSchema.index({ userId: 1, isBookmarked: 1 });

export default mongoose.model('Answer', answerSchema);
