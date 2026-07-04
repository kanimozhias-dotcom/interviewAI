import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    role: { type: String, required: true },
    difficulty: { type: String, required: true },

    // Scores (0–100)
    overallScore:       { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalScore:     { type: Number, default: 0 },
    confidenceScore:    { type: Number, default: 0 },

    // Completion tracking
    questionsAttempted: { type: Number, default: 0 },
    questionsAnswered:  { type: Number, default: 0 },
    completionPct:      { type: Number, default: 0 },

    // Per-question breakdown
    breakdown: [
      {
        question:  { type: String },
        answer:    { type: String },
        score:     { type: Number, default: 0 },
        feedback:  { type: String, default: '' },
      }
    ],

    // Summary
    strengths:       [String],
    weaknesses:      [String],
    recommendations: [String],

    // Chat history snapshot
    chatHistory: [
      {
        sender:    { type: String, enum: ['ai', 'user'] },
        message:   { type: String },
        timestamp: { type: Date },
      }
    ],
  },
  { timestamps: true }
);
    
export default mongoose.model('Report', reportSchema);
