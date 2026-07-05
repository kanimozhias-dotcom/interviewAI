import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import answerRoutes from './routes/answerRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import interviewRoutes from './routes/interviews.js';
import reportRoutes from './routes/reportRoutes.js';
// import roadmapRoutes from './routes/roadmaps.js';
// import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();


// Connect to database
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://intervuoai.vercel.app"
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/answers', answerRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/interviews', interviewRoutes);
app.use('/api/reports', reportRoutes);
// app.use('/api/roadmaps', roadmapRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InterviewAI Backend is Live 🚀",
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 InterviewAI Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/health\n`);
});

export default app;
