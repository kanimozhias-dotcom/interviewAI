/**
 * api.js — Centralised API service for InterviewAI
 * All backend communication goes through this module.
 */

const BASE_URL = '/api';

/**
 * Returns the JWT auth header object, or an empty object if no token is stored.
 * The token is stored in localStorage under the key 'token' by Login/Register.
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Questions ────────────────────────────────────────────────────────────────

/**
 * Fetch questions matching a specific role and difficulty.
 * Returns an array of question objects from MongoDB.
 *
 * @param {string} role       e.g. "Frontend Developer"
 * @param {string} difficulty e.g. "Entry-Level"
 * @returns {Promise<Array>}
 */
export async function fetchQuestions(role, difficulty) {
  const encodedRole = encodeURIComponent(role);
  const encodedDifficulty = encodeURIComponent(difficulty);
  const url = `${BASE_URL}/questions/${encodedRole}/${encodedDifficulty}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch questions (${res.status})`);
  }

  const json = await res.json();
  return json.data || [];
}

// ─── Answers ──────────────────────────────────────────────────────────────────

/**
 * Save a single interview answer to the database.
 * Requires a valid JWT token in localStorage ('token').
 *
 * @param {{
 *   role: string,
 *   difficulty: string,
 *   question: string,
 *   answer: string,
 *   sessionId: string,
 *   timestamp: string
 * }} payload
 * @returns {Promise<Object>}
 */
export async function saveAnswer(payload) {
  const res = await fetch(`${BASE_URL}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to save answer (${res.status})`);
  }

  return res.json();
}

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * Generate a performance report for a session.
 * Requires a valid JWT token in localStorage ('token').
 *
 * @param {string} sessionId
 * @param {Array} chatHistory
 * @returns {Promise<Object>}
 */
export async function generateReport(sessionId, chatHistory) {
  const res = await fetch(`${BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ sessionId, chatHistory }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to generate report (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch an existing performance report by sessionId.
 * Requires a valid JWT token in localStorage ('token').
 *
 * @param {string} sessionId
 * @returns {Promise<Object>}
 */
export async function fetchReport(sessionId) {
  const res = await fetch(`${BASE_URL}/reports/${sessionId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch report (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch all performance reports for the logged-in user.
 * Requires a valid JWT token in localStorage ('token').
 *
 * @returns {Promise<Array>}
 */
export async function fetchAllReports() {
  const res = await fetch(`${BASE_URL}/reports`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch reports (${res.status})`);
  }

  const json = await res.json();
  return json.data || [];
}

