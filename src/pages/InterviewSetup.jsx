import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/InterviewSetup.css';

const ROLES = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    icon: '🎨',
    desc: 'React, CSS, JavaScript, performance & accessibility',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'backend',
    label: 'Backend Developer',
    icon: '⚙️',
    desc: 'APIs, databases, Node.js, security & scalability',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'fullstack',
    label: 'Full Stack Engineer',
    icon: '🔗',
    desc: 'End-to-end development, MERN stack & DevOps',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'datascience',
    label: 'Data Scientist',
    icon: '📊',
    desc: 'ML, statistics, Python, deep learning & MLOps',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: 'pm',
    label: 'Product Manager',
    icon: '🧭',
    desc: 'Product strategy, metrics, user research & roadmaps',
    gradient: 'from-pink-500 to-rose-600',
  },
];

const LEVELS = [
  {
    id: 'entry',
    label: 'Entry-Level',
    sub: '0 – 2 years',
    icon: '🌱',
    desc: 'Fundamentals, core concepts, and getting started',
  },
  {
    id: 'mid',
    label: 'Mid-Level',
    sub: '2 – 5 years',
    icon: '🚀',
    desc: 'Architecture, trade-offs, and real-world problem solving',
  },
  {
    id: 'senior',
    label: 'Senior',
    sub: '5+ years',
    icon: '⭐',
    desc: 'System design, leadership, and deep technical mastery',
  },
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = role, 2 = level
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setTimeout(() => setStep(2), 200);
  };

  const handleStart = () => {
    if (!selectedRole || !selectedLevel) return;
    navigate('/session', {
      state: {
        role: selectedRole.label,
        difficulty: selectedLevel.label,
      },
    });
  };

  return (
    <div className="setup-root">
      {/* Back nav */}
      <Link to="/dashboard" className="setup-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      <div className="setup-container">
        {/* Header */}
        <div className="setup-header">
          <div className="setup-badge">Interview Setup</div>
          <h1 className="setup-title">
            {step === 1 ? 'Choose your target role' : 'Select experience level'}
          </h1>
          <p className="setup-subtitle">
            {step === 1
              ? "We'll fetch questions from MongoDB tailored to your selected role."
              : `Questions will be filtered for ${selectedRole?.label} at the chosen level.`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="setup-steps">
          <div className={`setup-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Role</span>
          </div>
          <div className={`setup-step-line ${step === 2 ? 'active' : ''}`} />
          <div className={`setup-step ${step === 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Level</span>
          </div>
        </div>

        {/* Step 1: Role cards */}
        {step === 1 && (
          <div className="role-grid">
            {ROLES.map((role) => (
              <button
                key={role.id}
                className={`role-card ${selectedRole?.id === role.id ? 'selected' : ''}`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className={`role-icon-wrap gradient-${role.id}`}>
                  <span className="role-icon">{role.icon}</span>
                </div>
                <div className="role-info">
                  <h3 className="role-name">{role.label}</h3>
                  <p className="role-desc">{role.desc}</p>
                </div>
                <svg className="role-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Level cards */}
        {step === 2 && (
          <div className="level-section">
            <div className="selected-role-chip">
              <span>{selectedRole?.icon}</span>
              <span>{selectedRole?.label}</span>
              <button onClick={() => { setStep(1); setSelectedLevel(null); }} className="chip-change">
                Change
              </button>
            </div>

            <div className="level-grid">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  className={`level-card ${selectedLevel?.id === level.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  <div className="level-icon">{level.icon}</div>
                  <div className="level-info">
                    <h3 className="level-name">{level.label}</h3>
                    <p className="level-sub">{level.sub}</p>
                    <p className="level-desc">{level.desc}</p>
                  </div>
                  {selectedLevel?.id === level.id && (
                    <div className="level-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              className={`start-btn ${selectedLevel ? 'enabled' : 'disabled'}`}
              onClick={handleStart}
              disabled={!selectedLevel}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview — {selectedRole?.label} ({selectedLevel?.label || '...'})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSetup;

