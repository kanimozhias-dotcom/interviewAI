import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const badgeSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  earnedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [50, 'Name cannot exceed 50 characters'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'], select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: [200, 'Bio cannot exceed 200 characters'], default: '' },
    streak: { type: Number, default: 0 },
    lastInterviewDate: { type: Date },
    totalInterviews: { type: Number, default: 0 },
    badges: [badgeSchema],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (!this.lastInterviewDate) {
    this.streak = 1;
  } else {
    const lastDate = new Date(this.lastInterviewDate);
    const lastMid = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    const diffDays = Math.round((todayMid - lastMid) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streak += 1; // consecutive day
    } else if (diffDays > 1) {
      this.streak = 1; // streak broken
    }
    // if diffDays === 0, same day, do nothing to streak
  }
  
  this.lastInterviewDate = today;
  this.totalInterviews += 1;
};

export default mongoose.model('User', userSchema);
