import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchReport } from '../services/api';
import '../css/Results.css';

const Results = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      navigate('/setup');
      return;
    }

    const loadReport = async () => {
      try {
        const data = await fetchReport(sessionId);
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="results-root">
        <div className="results-loading">
          <div className="loading-spinner" />
          <p>Loading your Performance Report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="results-root">
        <div className="results-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Report</h2>
          <p>{error || 'Report not found.'}</p>
          <button className="btn-primary" onClick={() => navigate('/setup')}>
            Return to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-root">
      <header className="results-header">
        <div className="header-content">
          <h1>Interview Performance Report</h1>
          <p className="subtitle">
            {report.role} • {report.difficulty}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/setup')}>
          New Interview
        </button>
      </header>

      <main className="results-main">
        {/* Top Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card primary">
            <span className="stat-label">Overall Score</span>
            <span className="stat-value">{report.overallScore}<small>/100</small></span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Communication</span>
            <span className="stat-value">{report.communicationScore}<small>/100</small></span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Technical Depth</span>
            <span className="stat-value">{report.technicalScore}<small>/100</small></span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">{report.confidenceScore}<small>/100</small></span>
          </div>
        </section>

        {/* Completion Info */}
        <section className="completion-info">
          <div className="info-item">
            <span className="info-label">Questions Attempted:</span>
            <span className="info-val">{report.questionsAttempted}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Questions Answered:</span>
            <span className="info-val">{report.questionsAnswered}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Completion:</span>
            <span className="info-val">{report.completionPct}%</span>
          </div>
        </section>

        {/* Feedback Section */}
        <div className="feedback-layout">
          <section className="feedback-card strengths">
            <h3>💪 Key Strengths</h3>
            <ul>
              {report.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </section>
          
          <section className="feedback-card weaknesses">
            <h3>📈 Areas for Improvement</h3>
            <ul>
              {report.weaknesses.map((weak, i) => (
                <li key={i}>{weak}</li>
              ))}
            </ul>
          </section>
          
          <section className="feedback-card recommendations">
            <h3>🎯 Recommendations</h3>
            <ul>
              {report.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Question Breakdown */}
        <section className="breakdown-section">
          <h2>Detailed Breakdown</h2>
          <div className="breakdown-list">
            {report.breakdown.map((item, index) => (
              <div key={index} className="breakdown-card">
                <div className="breakdown-header">
                  <span className="q-num">Question {index + 1}</span>
                  <span className={`q-score ${item.score >= 80 ? 'high' : item.score >= 60 ? 'med' : 'low'}`}>
                    Score: {item.score}/100
                  </span>
                </div>
                <div className="q-content">
                  <p className="question-text">{item.question}</p>
                </div>
                <div className="a-content">
                  <span className="label">Your Answer:</span>
                  <p className="answer-text">{item.answer}</p>
                </div>
                <div className="f-content">
                  <span className="label">Feedback:</span>
                  <p className="feedback-text">{item.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Results;
