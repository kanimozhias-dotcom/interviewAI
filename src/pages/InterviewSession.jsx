import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions, saveAnswer, generateReport } from '../services/api';
import '../css/InterviewSession.css';

// Generate a simple session ID
const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TOTAL_QUESTIONS = 10;

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, difficulty } = location.state || {};

  // ── State ──────────────────────────────────────────────────────────
  const [sessionId] = useState(generateSessionId);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | answering | saving | finishing
  const [errorMsg, setErrorMsg] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Speech recognition ref
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // ── Redirect guard ─────────────────────────────────────────────────
  useEffect(() => {
    if (!role || !difficulty) {
      navigate('/setup');
    }
  }, [role, difficulty, navigate]);

  // ── Scroll to bottom of chat ─────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, answer, status]);

  // ── Load & select 10 random questions ──────────────────────────────
  useEffect(() => {
    if (!role || !difficulty) return;

    const load = async () => {
      try {
        setStatus('loading');
        const all = await fetchQuestions(role, difficulty);
        if (all.length === 0) {
          setErrorMsg(`No questions found for ${role} / ${difficulty}. Please seed the database.`);
          setStatus('error');
          return;
        }
        const selected = shuffle(all).slice(0, TOTAL_QUESTIONS);
        setQuestions(selected);
        
        // Add first question to chat
        setChatHistory([
          { sender: 'ai', message: selected[0].question, timestamp: new Date() }
        ]);
        
        setStatus('answering');
      } catch (err) {
        setErrorMsg(err.message);
        setStatus('error');
      }
    };

    load();
  }, [role, difficulty]);

  // ── Speech recognition setup ────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interim = '';
      finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setAnswer(finalTranscript + interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      rec.start();
      setIsListening(true);
    }
  }, [isListening]);

  // ── Submit answer ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const currentQuestion = questions[currentIndex];
    setStatus('saving');

    // Add user answer to chat
    const userMsg = { sender: 'user', message: answer.trim(), timestamp: new Date() };
    const updatedChat = [...chatHistory, userMsg];
    setChatHistory(updatedChat);

    try {
      await saveAnswer({
        role,
        difficulty,
        question: currentQuestion.question,
        answer: answer.trim(),
        sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save answer:', err.message);
    }

    // Advance
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setStatus('finishing');
      // Generate Report and Redirect
      try {
        await generateReport(sessionId, updatedChat);
        navigate(`/results?sessionId=${sessionId}`);
      } catch (err) {
        console.error('Failed to generate report:', err.message);
        setErrorMsg('Failed to generate performance report.');
        setStatus('error');
      }
    } else {
      setCurrentIndex(nextIndex);
      setAnswer('');
      
      // Add next question to chat
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', message: questions[nextIndex].question, timestamp: new Date() }
      ]);
      
      setStatus('answering');
    }
  }, [answer, currentIndex, difficulty, isListening, questions, role, sessionId, chatHistory, navigate]);

  // ── Computed ────────────────────────────────────────────────────────
  const progress = questions.length > 0 ? ((currentIndex / questions.length) * 100).toFixed(1) : 0;
  const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // ── Render: Loading / Finishing ─────────────────────────────────────────────────
  if (status === 'loading' || status === 'finishing') {
    return (
      <div className="session-root">
        <div className="session-loading">
          <div className="loading-spinner" />
          <p className="loading-text">
            {status === 'loading' ? 'Fetching questions from MongoDB…' : 'Generating Performance Report…'}
          </p>
          <p className="loading-sub">{role} · {difficulty}</p>
        </div>
      </div>
    );
  }

  // ── Render: Error ───────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="session-root">
        <div className="session-error">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{errorMsg}</p>
          <button className="btn-primary" onClick={() => navigate('/setup')}>
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Interview Chat ───────────────────────────────────────────────
  return (
    <div className="session-root">
      {/* Top bar */}
      <header className="session-header">
        <div className="session-header-left">
          <div className="session-badge">{role}</div>
          <span className="session-level">{difficulty}</span>
        </div>
        <div className="session-header-right">
          <span className="session-counter">
            {currentIndex + 1} / {questions.length}
          </span>
          <button className="session-exit" onClick={() => navigate('/setup')}>
            Exit
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="session-progress-bar">
        <div className="session-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Chat Area */}
      <main className="session-chat-main">
        <div className="chat-container">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'ai' ? '🤖' : '👤'}
              </div>
              <div className="chat-bubble">
                <p className="chat-text">{msg.message}</p>
                <span className="chat-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Live Transcript / Typing Indicator */}
          {status === 'answering' && (answer.trim() || isListening) && (
            <div className="chat-message user live-typing">
              <div className="chat-avatar">👤</div>
              <div className="chat-bubble">
                <p className="chat-text">
                  {answer || (isListening ? <span className="listening-dots">...</span> : '')}
                </p>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="session-input-footer">
        <div className="input-container">
          <div className="input-toolbar">
            {hasSpeech && (
              <button
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? (
                  <>
                    <span className="mic-pulse" />
                    Recording…
                  </>
                ) : (
                  <>🎙️ Speak</>
                )}
              </button>
            )}
            <span className="word-count">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>

          <div className="input-box">
            <textarea
              className="chat-textarea"
              placeholder="Type your answer or use voice input..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={2}
            />
            <button
              className={`send-btn ${answer.trim() ? 'enabled' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!answer.trim() || status === 'saving'}
            >
              {status === 'saving' ? (
                <span className="btn-spinner" />
              ) : currentIndex + 1 === questions.length ? (
                'Finish'
              ) : (
                'Next Question'
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewSession;
