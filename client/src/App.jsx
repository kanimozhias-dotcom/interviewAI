import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import InterviewSession from './pages/InterviewSession'
import Results from './pages/Results'
import Profile from './pages/Profile'
import InterviewHistory from './pages/InterviewHistory'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/session" element={<InterviewSession />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:sessionId" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<InterviewHistory />} />
      </Routes>
    </Router>
  )
}

export default App