import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['article', 'video', 'course', 'documentation', 'practice'], default: 'article' },
});

const stepSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  resources: [resourceSchema],
  estimatedTime: String,
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  category: String,
});

const learningRoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    title: { type: String, default: 'Your Personalized Learning Roadmap' },
    role: String,
    steps: [stepSchema],
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

learningRoadmapSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('LearningRoadmap', learningRoadmapSchema);
