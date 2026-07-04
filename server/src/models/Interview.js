import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, enum: ['frontend', 'react', 'java', 'python', 'fullstack'] },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    duration: { type: Number }, // in minutes
    totalQuestions: { type: Number, default: 10 },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, status: 1 });
interviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Interview', interviewSchema);
