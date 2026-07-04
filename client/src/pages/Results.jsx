import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';

const Results = () => {
  const [searchParams] = useSearchParams();
const { sessionId: routeSessionId } = useParams();

const sessionId =
  routeSessionId || searchParams.get("sessionId");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const loadReport = async () => {
      try {

        if (!routeSessionId) {
  await fetch("http://localhost:5000/api/reports/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    sessionId,
  }),
});
}

        const response = await fetch(
  `http://localhost:5000/api/reports/${sessionId}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
        const result = await response.json();

        if (result.success) {
          setReport(result.data);
        } else {
          setError(result.message || "Failed to load report.");
        }
      } catch (err) {
        setError("Error loading report. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <span className="ml-4 text-xl">Loading your performance report...</span>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Unable to Load Report</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/setup" className="px-6 py-2 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700">
          Return to Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Dashboard
          </Link>
          <div className="font-semibold text-center leading-tight">
            Interview Results
            <div className="text-xs text-gray-400 font-normal">{report.role} • {report.difficulty}</div>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-6 sm:mt-12">
        {/* Score Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 sm:p-8 mb-8 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          
          <h1 className="text-xl sm:text-2xl font-bold mb-8 text-center">Overall Performance</h1>
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * report.overallScore) / 100} strokeLinecap="round" className="drop-shadow-lg transition-all duration-1000 ease-out" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {report.overallScore}<span className="text-2xl">%</span>
              </span>
              <span className="text-sm text-gray-400 mt-1">
                {report.overallScore >= 80 ? 'Excellent' : report.overallScore >= 60 ? 'Good' : 'Needs Work'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center border-t border-gray-800 pt-8 mt-4">
            <div>
              <div className="text-2xl font-bold text-white">{report.questionsAnswered} / {report.questionsAttempted}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{report.technicalScore}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Tech Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{report.communicationScore}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Communication</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{report.confidenceScore}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Confidence</div>
            </div>
          </div>
        </div>

        {/* Dynamic Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/40 border-t-4 border-emerald-500 border-gray-800 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="text-emerald-400 mr-2">💪</span> Key Strengths
            </h3>
            <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
              {report.strengths?.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-900/40 border-t-4 border-rose-500 border-gray-800 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="text-rose-400 mr-2">📈</span> Areas for Improvement
            </h3>
            <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
              {report.weaknesses?.map((weak, idx) => (
                <li key={idx}>{weak}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Detailed Feedback Breakdown</h2>
          
          {report.breakdown?.map((item, idx) => (
            <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg max-w-[80%]">{idx + 1}. {item.question}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  item.score >= 80 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : item.score >= 50 
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  Score: {item.score}/100
                </span>
              </div>
              
              <div className="mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Your Answer:</span>
                <p className="text-gray-300 text-sm leading-relaxed mt-1 bg-gray-950 p-3 rounded-lg border-l-2 border-indigo-500">
                  {item.answer}
                </p>
              </div>

              <div className="bg-gray-950 rounded-xl p-4 text-sm border border-gray-800">
                <span className="text-indigo-400 font-semibold mb-2 block">💡 Feedback:</span>
                {item.feedback}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
  <Link
    to="/setup"
    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition text-center"
  >
    Retake Interview
  </Link>

  <Link
  to="/history"
  className="w-full sm:w-auto px-6 py-3 bg-gray-800 rounded-lg font-medium hover:bg-gray-700 transition text-center"
>
  ← Back to Interview History
</Link>
</div>
      </main>
    </div>
  );
};

export default Results;
