import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Frontend Developer');
  const [experience, setExperience] = useState('Mid-Level');

  const startInterview = (e) => {
  e.preventDefault();

  navigate("/session", {
    state: {
      role,
      difficulty: experience,
    },
  });
};

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      <div className="w-full max-w-2xl relative z-10">
        <button onClick={() => navigate('/dashboard')} className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>

        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Configure Your Interview</h1>
            <p className="text-gray-400 mt-2">Tailor the AI interviewer to your specific target role.</p>
          </div>

          <form onSubmit={startInterview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
              <select 
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Engineer</option>
                <option>Data Scientist</option>
                <option>Product Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <div className="grid grid-cols-3 gap-4">
                {['Entry-Level', 'Mid-Level', 'Advanced-Level'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperience(level)}
                    className={`py-3 px-4 rounded-xl border font-medium transition-all ${experience === level ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-800/50'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Focus Areas (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-600"
                placeholder="e.g. System Design, React hooks, Node.js"
              />
            </div>

            <div className="pt-6 border-t border-gray-800">
              <button 
                type="submit" 
                className="w-full py-4 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-600/30 transform transition-all hover:scale-[1.01]"
              >
                Begin Interview
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
