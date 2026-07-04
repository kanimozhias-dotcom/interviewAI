import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    category: { type: String, required: true },
    question: { type: String, required: true },
    expectedAnswer: { type: String, default: '' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

questionSchema.index({ role: 1, difficulty: 1, category: 1 });

export default mongoose.model('Question', questionSchema);
