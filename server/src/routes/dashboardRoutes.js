import express from "express";
import Report from "../models/Report.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // All reports for this user, newest first
    const reports = await Report.find({ user: userId }).sort({ createdAt: -1 });

    // Deduplicate by sessionId to remove duplicate reports
    const uniqueReportsMap = new Map();
    reports.forEach((r) => {
      if (!uniqueReportsMap.has(r.sessionId)) {
        uniqueReportsMap.set(r.sessionId, r);
      }
    });
    const uniqueReports = Array.from(uniqueReportsMap.values());

    const totalInterviews = uniqueReports.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            uniqueReports.reduce((sum, r) => sum + r.overallScore, 0) /
              totalInterviews
          )
        : 0;

    const bestScore =
      totalInterviews > 0
        ? Math.max(...uniqueReports.map((r) => r.overallScore))
        : 0;

    // Streak is managed and persisted in the User document (updated upon report creation)
    // -------- Calculate Real Streak --------

const reportDates = [
  ...new Set(
    uniqueReports.map((report) =>
      new Date(report.createdAt).toISOString().split("T")[0]
    )
  ),
].sort((a, b) => new Date(b) - new Date(a));

let streak = 0;

if (reportDates.length > 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestInterview = new Date(reportDates[0]);
  latestInterview.setHours(0, 0, 0, 0);

  const diff =
    (today - latestInterview) / (1000 * 60 * 60 * 24);

  // Streak is alive only if interview was today or yesterday
  if (diff <= 1) {
    streak = 1;

    for (let i = 1; i < reportDates.length; i++) {
      const current = new Date(reportDates[i - 1]);
      const previous = new Date(reportDates[i]);

      current.setHours(0, 0, 0, 0);
      previous.setHours(0, 0, 0, 0);

      const days =
        (current - previous) / (1000 * 60 * 60 * 24);

      if (days === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
}

    // Line chart: score over time (oldest → newest)
    const lineData = [...uniqueReports]
      .reverse()
      .map((r, i) => ({ interview: `#${i + 1}`, score: r.overallScore }));

    // Bar chart: breakdown of latest report's sub-scores
    const latestReport = uniqueReports[0] || null;
    const barData = latestReport
      ? [
          { name: "Technical", score: latestReport.technicalScore },
          { name: "Communication", score: latestReport.communicationScore },
          { name: "Confidence", score: latestReport.confidenceScore },
          { name: "Overall", score: latestReport.overallScore },
        ]
      : [];

    // Interview History (all unique completed reports)
    const recentInterviews = uniqueReports.map((r) => ({
      sessionId: r.sessionId,
      role: r.role,
      difficulty: r.difficulty,
      score: r.overallScore,
      questionsAnswered: r.questionsAnswered,
      date: r.createdAt,
    }));

    const completedInterviews = uniqueReports.filter(r => r.questionsAnswered > 0).length;
    const totalPracticeTimeMins = completedInterviews * 15;
    const totalPracticeTime = totalPracticeTimeMins >= 60 
      ? `${(totalPracticeTimeMins / 60).toFixed(1)} hrs` 
      : `${totalPracticeTimeMins} mins`;

    res.json({
      totalInterviews,
      completedInterviews,
      averageScore,
      bestScore,
      streak,
      totalPracticeTime,
      lineData,
      barData,
      recentInterviews,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;